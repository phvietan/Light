import SearchBar from './searchbar';
import CourseTab from './coursetab';
import React, { Component } from 'react';

const axios = require('axios');

export default class ManageCourses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      searchValue: '',
      filteredCourses: [],
    };
  }

  async componentDidMount() {
    const { data } = await axios.get('/api/courses/all_info');
    this.setState({
      courses: data.courses,
      filteredCourses: data.courses,
    });
  }

  search(event) {
    this.setState({
      searchValue: event.target.value
    }, () => {
      const { searchValue } = this.state;
      if (searchValue === '') this.setState({
        filteredCourses: this.state.courses,
      });
      else {
        const filteredCourses = this.state.courses.filter(course => course.code.indexOf(searchValue) > -1);
        this.setState({
          filteredCourses,
        });
      }
    });
  }

  onClick(id) {
    this.props.history.push(`/edit/course/${id}`);
  }

  render() {
    return (
      <div id={this.props.id}>
        <br/>
        <SearchBar
          value={this.state.searchValue}
          placeHolder="Search by courseId"
          onChange={this.search.bind(this)}
        />
        {this.state.filteredCourses.map((course, index) =>
          <CourseTab
            course={course}
            key={`${course.code}-${index}`}
            onClick={this.onClick.bind(this, course._id)}
          />
        )}
      </div>
    );
  }
}
