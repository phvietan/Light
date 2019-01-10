import '../css/manage.css';
import ManageUsers from './manageusers';
import Tab from '@material-ui/core/Tab';
import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import ManageCourses from './managecourses';

export default class Manage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      choosingTab: 0,
    };
  }

  handleChooseTab(_, value) {
    this.setState({
      choosingTab: value,
    });
  }

  render() {
    return (
      <div id={this.props.id}>
        <div id="manage-content">
          <Tabs
            id="manage-tabs"
            value={this.state.choosingTab}
            onChange={this.handleChooseTab.bind(this)}
            fullWidth
            centered
          >
            <Tab label="Students" />
            <Tab label="Teachers" />
            <Tab label="Staffs" />
            <Tab label="Courses" />
          </Tabs>

          {this.state.choosingTab === 0 &&
            <ManageUsers
              id="manage-users"
              getType="student"
              history={this.props.history}
            />
          }
          {this.state.choosingTab === 1 &&
            <ManageUsers
              getType="teacher"
              id="manage-users"
              history={this.props.history}
            />
          }
          {this.state.choosingTab === 2 &&
            <ManageUsers
              getType="staff"
              id="manage-users"
              history={this.props.history}
            />
          }
          {this.state.choosingTab === 3 &&
            <ManageCourses
              id="manage-courses"
              history={this.props.history}
            />
          }
        </div>

      </div>
    );
  }
}
