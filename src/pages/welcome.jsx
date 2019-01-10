import '../css/welcome.css';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Login from '../components/login.jsx';
import Signup from '../components/signup.jsx';
import GridList from '@material-ui/core/GridList';
import { getFromStorage } from '../utils/storage';

const axios = require('axios');

export default class Welcome extends Component {
  async componentDidMount() {
    const params = {
      token: getFromStorage('login_token'),
    }
    // If currently login, it should be redirect to home page
    if (params.token) {
      try {
        await axios.get('/api/users/info', { params });
        this.props.history.push('/home')
      } catch (err) {
        throw err;
      }
    }
  }

  render() {
    return (
      <div id="welcome">
        <div id="form_login">
          <div id="title">
            <img src="/icon.svg" alt="icon"/>
          </div>
          <div style={{ align: 'center' }}>
            <h2 style={{ width: '100%', fontFamily: 'Avenir Next', fontWeight: '300', color: '#FA5A5B'}}>Light your work, light your knowledge</h2>
          </div>
          <GridList className="signup-login-block">
            {/*<Grid item xs={6}>
              <Signup history={this.props.history}/>
            </Grid>*/}
            <Grid item xs={12}>
              <Login history={this.props.history}/>
            </Grid>
          </GridList>
        </div>
      </div>
    );
  }
}
