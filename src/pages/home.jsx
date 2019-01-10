import '../css/home.css';
import Box from '../components/box';
import Feed from '../components/feed';
import React, { Component } from 'react';
import Manage from '../components/manage';
import Course from '../components/course';
import LeftBar from '../components/leftbar';
import RightBar from '../components/rightbar';
import PostModal from '../components/postmodal';
import { getFromStorage } from '../utils/storage';
import NavigationBar from '../components/navigationbar';
import CourseSummary from '../components/coursesummary';
import RightBarStudent from '../components/rightbarstudent';

const axios = require('axios');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        type: 'staff',
      },
      feed: [],
      openingCourses: [],
      registeredCourses: [],
      token: getFromStorage('login_token'),
      choosingTab: 'School0',
      openPostModal: false,
    };
  }

  async getAuthorization() {
    // If currently login, it should update state of component
    const params = {
      token: this.state.token,
    }
    if (this.state.token) {
      try {
        const { data } = await axios.get('/api/users/info', { params });
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

  async getOpeningCourses() {
    const { data } = await axios.get('/api/courses/opening');
    this.setState({
      openingCourses: data.courses,
    });
  }

  async getRegisteredCourses() {
    const params = {
      userId: this.state.user.userId,
    };
    const { data } = await axios.get('/api/courses/registered', { params });

    this.setState({
      registeredCourses: data.registeredCourses,
    });
  }

  async componentDidMount() {
    await this.getAuthorization();
    await this.getOpeningCourses();
    await this.getRegisteredCourses();
  }

  chooseTab(id) {
    this.setState({
      choosingTab: id,
    });
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
    if (option==='Course') this.props.history.push('/add/course');
  }

  updateFeed(newData) {
    const { data, n } = newData;
    this.setState({
      feed: [...this.state.feed, ...data],
      feedLength: n,
    });
  }

  handleOpenRightBarStudent() {
    this.props.history.push('/add/report');
  }

  render() {
    const userType = this.state.user.type;
    return (
      <div id="home">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />
        <LeftBar
          width="20%"
          tab={this.state.choosingTab}
          chooseTab={this.chooseTab.bind(this)}
          userType={userType}
          openingCourses={this.state.openingCourses}
          registeredCourses={this.state.registeredCourses}
          layout={this.state.leftBarLayout}
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
        {(userType === 'student' || userType === 'teacher') &&
          <div>
            <RightBarStudent
              width="20%"
              handleOpen={this.handleOpenRightBarStudent.bind(this)}
            />
          </div>
        }
        {this.state.choosingTab === 'School0' &&
          <Feed
            id="home-content"
            data={this.state.feed}
            n={this.state.feedLength}
            updateFeed={this.updateFeed.bind(this)}
            user={this.state.user}
            history={this.props.history}
          />
        }
        {this.state.choosingTab === 'School1' &&
          <Box id="home-content"
            history={this.props.history}
            user={this.state.user}
          />
        }
        {this.state.choosingTab === 'School2' &&
          <Manage id="home-content"
            history={this.props.history}
          />
        }
        {this.state.choosingTab.slice(0, 7) === 'Opening' &&
          <CourseSummary
            id="home-content"
            onChange={() => {}}
            user={this.state.user}
            history={this.props.history}
            refresh={this.getRegisteredCourses.bind(this)}
            courseId={this.state.choosingTab.slice(8, this.state.choosingTab.length)}
          />
        }
        {this.state.choosingTab.slice(0, 7) === 'Registe' &&
          <Course
            id="home-content"
            courseId={this.state.choosingTab.slice(11, this.state.choosingTab.length)}
            onChange={() => {}}
            user={this.state.user}
          />
        }
      </div>
    );
  }
}
