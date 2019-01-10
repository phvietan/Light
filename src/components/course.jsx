import '../css/course.css';
import Tab from '@material-ui/core/Tab';
import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import CourseSyllabus from './coursesyllabus';
import { getFromStorage } from '../utils/storage';
import CourseLectureNotes from './courselecturenotes';

const axios = require('axios');

export default class Course extends Component {
  constructor(props) {
    super(props);

    this.state = {
      year: 0,
      semester: 0,
      choosingTab: 0,
      isRegistered: false,
      numberOfRegistered: 0,
      courseId: props.courseId,
      openSnackBarSuccess: false,

      user: props.user,

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
    }
    const { data } = await axios.get('/api/users/user_info', { params });
    this.setState({
      teacherName: data.name,
    });
  }

  async componentDidMount() {
    await this.updateCourseData(this.state.courseId);
    await this.updateTeacherName(this.state.teacherId);

  }

  async componentWillReceiveProps(props) {
    await this.updateCourseData(props.courseId);
  }

  handleChooseTab(event, value) {
    this.setState({
      choosingTab: value,
    });
  }

  render() {
    return (
      <div id={this.props.id}>
        <div className="course-header">
          <h1>{this.state.code} : {this.state.name}</h1> <h2>{this.state.teacherName}</h2>
        </div>
        <br/>
        <br/>
        <div className="course-header">
          <h3>Semester {this.state.semester} {this.state.year}</h3>
        </div>

        <br/>

        <Tabs
          id="course-tabs-header"
          value={this.state.choosingTab}
          onChange={this.handleChooseTab.bind(this)}
          fullWidth
          centered
        >
          <Tab label="Syllabus" />
          <Tab label="Lecture Notes" />
        </Tabs>

        <br/>
        <div id="course-content">
          {this.state.choosingTab === 0 &&
            <CourseSyllabus
              numberOfRegistered={this.state.numberOfRegistered}
              content={this.state.content}
            />
          }
          {this.state.choosingTab === 1 &&
            <CourseLectureNotes
              user={this.state.user}
              courseId={this.state.courseId}
            />
          }
        </div>

      </div>
    );
  }
}
