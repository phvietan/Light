import '../css/coursetab.css';
import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';

export default class CourseTab extends Component {
  render() {
    const { code, name, semester, year } = this.props.course;
    return (
      <div>
        <div className="course-tab" onClick={this.props.onClick}>
          <h1>{code} : {name}</h1>
          <h3>Semester: {semester}, {year}</h3>
        </div>
        <br/>
        <Divider/>
      </div>
    );
  }
};
