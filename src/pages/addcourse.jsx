import '../css/addcourse.css';
import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import GoButton from '../components/gobutton';
import RightBar from '../components/rightbar.jsx';
import Suggestion from '../components/suggestion';
import DateAndTime from '../components/dateandtime';
import PostModal from '../components/postmodal.jsx';
import NavigationBar from '../components/navigationbar';
import SuccessSnakeBar from '../components/successsnakebar';
import { getFromStorage, setToStorage } from '../utils/storage';

const axios = require('axios');

export default class AddCourse extends Component {
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

      openPostModal: false,
      user: { type: 'staff' },
      openSnackBarSuccess: false,

      name: getFromStorage('course-name') ? getFromStorage('course-name') : '',
      title: getFromStorage('course-title') ? getFromStorage('course-title') : '',
      content: getFromStorage('course-content') ? getFromStorage('course-content') : '',
      year: '',
      semester: '',
      defaultClass: '',
      moment: myDate,
      teacherId: '',

      teachers: [],
    };
    setToStorage('course-name', this.state.name);
    setToStorage('course-title', this.state.title);
    setToStorage('course-content', this.state.content);
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

  async componentDidMount() {
    await this.getTeachers();
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
    }, () => {
      setToStorage('course-name', this.state.name);
      setToStorage('course-title', this.state.title);
      setToStorage('course-content', this.state.content);
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

    const params = {
      name: this.state.name,
      year: this.state.year,
      title: this.state.title,
      content: this.state.content,
      semester: this.state.semester,
      teacherId: this.state.teacherId,
      moment: this.state.moment.toString(),
      token: getFromStorage('login_token'),
      defaultClass: this.state.defaultClass,
    };

    try {
      await axios.post('/api/courses/create', params);
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
    setToStorage('course-name', '');
    setToStorage('course-title', '');
    setToStorage('course-content', '');
  }

  handleOpenPostModal() {
    this.setState({ openPostModal: true });
  };

  handleClosePostModal() {
    this.setState({ openPostModal: false });
  };

  chooseOption(option) {
    if (option==='News') this.props.history.push('/add/news');
    if (option==='User') this.props.history.push('/add/user');
    if (option==='Course') this.handleClosePostModal();
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

  render() {
    const userType = this.state.user.type;
    return (
      <div id="add-course">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />
        <div id="paragraph-add-course">
          <h1 id="add-course-header">Adding Course</h1>
          <textarea
            id="add-course-title"
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
            id="add-course-name"
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
          cols={60}
            type="text"
            id="add-course-content"
            value={this.state.content}
            rows={this.state.contentRows}
            placeholder = "Course Description / Syllabus"
            onChange={this.onChange.bind(this, 'content')}
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

        {(userType === 'admin' || userType === 'staff') &&
          <div>
            <RightBar
              width="20%"
              handleOpen={this.handleOpenPostModal.bind(this)}
            />
            <PostModal
              open={this.state.openPostModal}
              handleClose={this.handleClosePostModal.bind(this)}
              chooseOption={this.chooseOption.bind(this)}
            />
          </div>
        }

      </div>
    );
  }
}
