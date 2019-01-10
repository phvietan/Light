import '../css/coursesyllabus.css';
import React, { Component } from 'react';

export default class CourseSyllabus extends Component {
  render() {
    const { content } = this.props;
    return (
      <div id="course-syllabus">
        {content.split('\n').map((value, pIndex) =>
          <p key={pIndex}>
            {value}
          </p>
        )}
      </div>
    );
  }
}
