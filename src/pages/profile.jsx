import '../css/profile.css';
import React, { Component } from 'react';
import { getFromStorage } from '../utils/storage';
import NavigationBar from '../components/navigationbar.jsx';

const axios = require('axios');

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const params = {
      token: getFromStorage('login_token'),
    }
    // If currently login, it should update state of component
    if (params.token) {
      try {
        const { data } = await axios.get('/api/users/info', { params });
        this.setState({
          user: data,
        });
      } catch (err) {
        // If cannot get info of this token (maybe hacker trying to tampered?)
        console.error(err);

        // We should redirect to welcome page
        this.props.history.push('/');
      }
    }
    // If not found any token, redirect to welcome page
    else {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <div id="profile">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />
      </div>
    );
  }
}
