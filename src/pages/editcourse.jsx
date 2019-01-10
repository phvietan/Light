import '../css/editcourse.css';
import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import GoButton from '../components/gobutton';
import SureModal from '../components/suremodal';
import { MdDeleteForever } from 'react-icons/md';
import Suggestion from '../components/suggestion';
import DateAndTime from '../components/dateandtime';
import NavigationBar from '../components/navigationbar';
import SuccessSnakeBar from '../components/successsnakebar';
import { getFromStorage } from '../utils/storage';

const axios = require('axios');

export default class EditCourse extends Component {
  constructor(props) {
    super(props);

    let myDate = new Date();

    //add a day to the date
    myDate.setDate(myDate.getDate() + 7);

    this.state = {
      error: '',

      nameRows: 1,
      titleRows: 1,
      contentRows: 13,

      user: {},
      openSureModal: false,
      openSnackBarSuccess: false,

      year: '',
      name: '',
      title: '',
      teachers: [],
      content: '',
      semester: '',
      moment: myDate,
      defaultClass: '',
      teacherId: '',
    };
  }

  async getAuthorization() {
    const params = {
      token: getFromStorage('login_token'),
    }
    // If currently login, it should update state of component
    if (params.token) {
      try {
        const { data } = await axios.get('/api/users/info', { params });
        if (data.type !== 'admin' && data.type !== 'staff') {
          alert('You are not authorized to view this page, You are returning to Home page');
          this.props.history.push('/home');
          return;
        }
        this.setState({
          user: data,
        });
      } catch (err) {
        // If cannot get info of this token (maybe hacker trying to tampered?)
        alert(err.message);

        // We should redirect to welcome page
        this.props.history.push('/');
      }
    }
    // If not found any token, redirect to welcome page
    else {
      this.props.history.push('/');
    }
  }

  async getTeachers() {
    const { data } = await axios.get('/api/users/teachers');
    const teachersId = data.map(teacher => teacher.userId);

    this.setState({
      teachers: teachersId,
    });
  }

  async updateCourseData() {
    const { id } = this.props.match.params;
    const params = {
      id,
    };

    const { data } = await axios.get('/api/courses/info', { params });
    this.setState({
      ...data,
      title: data.code,
      moment: new Date(data.date),
    });
  }

  async componentDidMount() {
    await this.getTeachers();
    await this.updateCourseData();
    await this.getAuthorization();

    this.resizeContent(this.state.name, 45, 'nameRows', 1);
    this.resizeContent(this.state.title, 45, 'titleRows', 1);
    this.resizeContent(this.state.content, 60, 'contentRows', 13);
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;
    this.setState({ openSnackBarSuccess: false });
  };

  resizeContent(str, cols, stateName, minRow) {
    let lineCount = 0;
    str.split('\n').forEach(l => {
      lineCount += Math.ceil((l.length+0.5) / cols);
    });
    this.setState({
      [stateName] : Math.max(lineCount, minRow),
    });
  }

  onChange(name, event) {
    this.setState({
      [name]: event.target.value,
    });
    if (name === 'content' || name === 'name' || name === 'title') {
      const stateName = (name === 'title') ? 'titleRows' : (name === 'name' ? 'nameRows' : 'contentRows');
      const minRow = (name === 'title' || name === 'name') ? 1 : 13;
      this.resizeContent(event.target.value, event.target.cols, stateName, minRow);
    }
  }

  async submit() {
    if (!this.state.title) {
      this.setState({
        error: 'Title should be filled',
      });
      return;
    }
    if (!this.state.name) {
      this.setState({
        error: 'Name should be filled',
      });
      return;
    }
    if (!this.state.content) {
      this.setState({
        error: 'Content should be filled',
      });
      return;
    }
    const { value: teacherId } = document.getElementById('downshift-simple-input');
    if (!this.state.year) {
      this.setState({
        error: 'Year should be filled',
      });
      return;
    }
    if (!this.state.semester) {
      this.setState({
        error: 'Semester should be filled',
      });
      return;
    }

    const { id } = this.props.match.params;
    const params = {
      id,
      teacherId,
      name: this.state.name,
      title: this.state.title,
      year: this.state.year,
      semester: this.state.semester,
      moment: this.state.moment.toString(),
      content: this.state.content,
      token: getFromStorage('login_token'),
      defaultClass: this.state.defaultClass,
    };

    try {
      await axios.patch('/api/courses/update', params);
      this.setState({
        error: '',
      });
      this.setState({ openSnackBarSuccess: true }, () => {
        setTimeout(() => {
          this.props.history.push('/home');
        }, 500);
      });
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }
  }

  handleChangeTime(moment) {
    this.setState({
      moment
    });
  }

  onSelect(value) {
    this.setState({
      teacherId: value,
    });
  }

  async submitRemove() {
    const { id } = this.props.match.params;
    const params = {
      id,
      token: getFromStorage('login_token'),
    };
    await axios.post('/api/courses/delete', params);
    this.setState({ openSnackBarSuccess: true }, () => {
      setTimeout(() => {
        this.props.history.push('/home');
      }, 500);
    });
  }

  handleOpenSureModal() {
    this.setState({ openSureModal: true });
  };

  handleCloseSureModal() {
    this.setState({ openSureModal: false });
  }

  render() {
    return (
      <div id="edit-course">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />
        <div id="paragraph-edit-course">
          <h1 id="edit-course-header">
            Editing Course
            <div className="remove-button" onClick={this.handleOpenSureModal.bind(this)}><MdDeleteForever/></div>

          </h1>

          <textarea
            id="edit-course-title"
            type="text"
            onChange={this.onChange.bind(this, 'title')}
            placeholder = "Course Title (CS300)"
            value={this.state.title}
            cols={45}
            rows={this.state.titleRows}
          />
          <br/>
          <br/>
          <textarea
            id="edit-course-name"
            type="text"
            onChange={this.onChange.bind(this, 'name')}
            placeholder = "Course Name (Software Engineering)"
            value={this.state.name}
            cols={45}
            rows={this.state.nameRows}
          />
          <br/>
          <br/>
          <textarea
            id="edit-course-content"
            type="text"
            placeholder = "Course Description / Syllabus"
            onChange={this.onChange.bind(this, 'content')}
            value={this.state.content}
            cols={60}
            rows={this.state.contentRows}
          />

          <br/>
          <br/>
          <Suggestion
            suggestions={this.state.teachers}
            value={this.state.teacherId}
            onSelect={this.onSelect.bind(this)}
            onChange={this.onChange.bind(this, 'teacherId')}
          />

          <br/>
          <Input
            placeholder='Year. Ex: 2019'
            value={this.state.year}
            onChange={this.onChange.bind(this, 'year')}
          />

          <Input
            style={{ marginLeft: '20px' }}
            placeholder='Semester. Ex: 1'
            value={this.state.semester}
            onChange={this.onChange.bind(this, 'semester')}
          />

          <br/>
          <br/>

          <h3>Due registration date:</h3>
          <DateAndTime
            onChange={this.handleChangeTime.bind(this)}
            moment={this.state.moment}
          />

          <br/>
          <br/>
          <Input
            placeholder='Default class. Ex: 16CTT'
            value={this.state.defaultClass}
            onChange={this.onChange.bind(this, 'defaultClass')}
          />

          <br/>
          <p style={{ opacity: '0.5', cursor: 'default' }}>Every students with class as above will be added to the course as default</p>

          <GoButton
            name="SUBMIT?"
            style={{ float: "right" }}
            onClick={this.submit.bind(this)}
          />


          {this.state.error &&
            <h1 style={{ color: 'red' }}>{this.state.error}</h1>
          }
        </div>

        <SuccessSnakeBar
          open={this.state.openSnackBarSuccess}
          handleClose={this.handleClose.bind(this)}
          message="SUCCESS UPLOADED"
        />

        <SureModal
          open={this.state.openSureModal}
          handleClose={this.handleCloseSureModal.bind(this)}
          message="Are you sure?"
          onClick={this.submitRemove.bind(this)}
        />
      </div>
    );
  }
}
