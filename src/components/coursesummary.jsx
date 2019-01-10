import GoButton from './gobutton';
import '../css/coursesummary.css';
import { MdEdit } from 'react-icons/md';
import React, { Component } from 'react';
import SuccessSnakeBar from '../components/successsnakebar';
import { getFromStorage } from '../utils/storage';

const axios = require('axios');

export default class CourseSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      year: 0,
      semester: 0,
      isRegistered: false,
      numberOfRegistered: 0,
      openSnackBarSuccess: false,

      token: getFromStorage('login_token'),

      name: '',
      code: '',
      content: '',
      teacherId: '',
      teacherName: '',
      date: Date.now(),
    };
  }

  async updateCourseData(courseId) {
    const params = {
      courseId,
    };
    const { data } = await axios.get('/api/courses/summary', { params });

    this.setState({
      ...data,
      courseId,
    });
  }

  async updateTeacherName(userId) {
    if (!Boolean(userId)) return;

    const params = {
      userId,
      token: this.state.token,
    };
    const { data } = await axios.get('/api/users/user_info', { params });
    this.setState({
      teacherName: data.name,
    });
  }

  async checkRegistered(userId, courseId) {
    const params = {
      userId,
    };
    const { data } = await axios.get('/api/courses/registered', { params });
    const registeredCourses = data.registeredCourses.map(course => course.id);

    const isRegistered = registeredCourses.indexOf(courseId) > -1;
    this.setState({
      userId,
      courseId,
      isRegistered,
    });
  }

  async componentDidMount() {
    await this.updateCourseData(this.props.courseId);
    await this.checkRegistered(this.props.user.userId, this.props.courseId);
    await this.updateTeacherName(this.state.teacherId);
  }

  async componentWillReceiveProps(props) {
    await this.updateCourseData(props.courseId);
    await this.checkRegistered(props.user.userId, props.courseId);
    await this.updateTeacherName(this.state.teacherId);

  }

  async submit() {
    const params = {
      token: this.state.token,
      courseId: this.state.courseId,
    };
    try {
      await axios.post('/api/courses/enrollment', params);
      await this.checkRegistered(this.props.user.userId, this.state.courseId);
      await this.props.refresh();
      this.setState({
        openSnackBarSuccess: true,
      }, () => {
        setTimeout(() => {
          this.setState({
            openSnackBarSuccess: false,
          });
        }, 1000);
      });
    } catch (err) {
      alert(err.message);
    }
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;
    this.setState({ openSnackBarSuccess: false });
  };

  editPost(id) {
    this.props.history.push(`/edit/course/${id}`);
  }

  render() {
    const type = this.props.user.type;

    const D = new Date(this.state.date);
    const date = D.toDateString();
    const time = `${D.getHours()}:${D.getMinutes()}`;
    return (
      <div id={this.props.id} className="course-summary-group">
        <div className="course-summary-title">
          <h1>{this.state.code}: {this.state.name}</h1>
          {(type === 'staff' || type === 'admin') &&
            <button
              onClick={this.editPost.bind(this, this.props.courseId)}
            >
              <MdEdit/>
            </button>
          }
          <p className="course-summary-support-line">Semester {this.state.semester}, {this.state.year} </p>
        </div>
        {/*<div className="feed-time">{news.startDate.slice(0, 10)}</div>*/}
        <div className="course-summary-content">
          {this.state.content.split('\n').map(value =>
            <p>
              {value}
            </p>
          )}
        </div>

        {this.state.teacherId &&
          <div className="course-summary-content">
            <p>Instructor: {this.state.teacherName}</p>
          </div>
        }
        <p className="course-summary-registered">Number of students registered: {this.state.numberOfRegistered}</p>
        <br/>
        <br/>

        <div>
          <p className="course-summary-due-date">Due date: {date} on {time}</p>
          {type==='student' &&
            <GoButton
              onClick={this.submit.bind(this)}
              name={this.state.isRegistered ? "Unenroll?" : "Enroll?"}
              style={{ float: "left", marginLeft: "4rem" }}
            />
          }
        </div>
        <SuccessSnakeBar
          open={this.state.openSnackBarSuccess}
          handleClose={this.handleClose.bind(this)}
          message="SUCCESS"
        />
      </div>
    );
  }
}
