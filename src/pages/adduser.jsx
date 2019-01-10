import '../css/adduser.css';
import Tab from '@material-ui/core/Tab';
import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import RightBar from '../components/rightbar';
import PostModal from '../components/postmodal';
import NavigationBar from '../components/navigationbar';
import AutoAddPeople from '../components/autoaddpeople';
import AddPeopleByHand from '../components/addpeoplebyhand';
import { getFromStorage } from '../utils/storage';

const axios = require('axios');

export default class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        type: 'staff',
      },
      choosingTab: 0,
      openSnackBarSuccess: false,
    };
  }

  async componentDidMount() {
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

  handleClose(event, reason) {
    if (reason === 'clickaway') return;
    this.setState({ openSnackBarSuccess: false });
  };

  handleOpenPostModal() {
    this.setState({ openPostModal: true });
  };

  handleClosePostModal() {
    this.setState({ openPostModal: false });
  };

  chooseOption(option) {
    if (option==='News') this.props.history.push('/add/news');
    if (option==='User') this.handleClosePostModal();
    if (option==='Course') this.props.history.push('/add/course');
  }

  handleChooseTab(event, value) {
    this.setState({
      choosingTab: value,
    });
  }

  // TODO: Add client validation
  render() {
    const userType = this.state.user.type;
    return (
      <div id="add-user">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />

        <div id="add-user-content">
          <Tabs
            id="add-user-header"
            value={this.state.choosingTab}
            onChange={this.handleChooseTab.bind(this)}
            fullWidth
            centered
          >
            <Tab label="Handwork" />
            <Tab label="Auto" />
          </Tabs>

          {this.state.choosingTab === 0 &&
            <AddPeopleByHand
              userType={userType}
              history={this.props.history}
            />
          }
          {this.state.choosingTab === 1 &&
            <AutoAddPeople
              history={this.props.history}
            />
          }
        </div>

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
