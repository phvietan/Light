import '../css/signup.css';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { setToStorage } from '../utils/storage';
import TextField from '@material-ui/core/TextField';

const axios = require('axios');

const textFieldStyle = {
  width: "75%",
  fontSize: "0.5em",
};

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
    };
  }

  handleChange(name, event) {
    this.setState({
      [name]: event.target.value,
    });
  }

  async submit() {
    const request = {
      class: '',
      type: 'admin',
      name: 'admin',
      userId: 'admin',
      email: this.state.email,
      password: this.state.password,
    }
    if (request.email) { 
      let a = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/; 
      if (!a.test(request.email)) {
        this.setState({error: 'Invalid email',});
        return;
      }
    }
    else {
      this.setState({error: 'Invalid email',});
      return;
    }
    try {
      // Signup
      const { data } = await axios.post('/api/users/signup', request);
      if (!data.error_code) {
        const { token } = data.body;
        setToStorage('login_token', token);
        this.props.history.push('home');
      }
      else {
        this.setState({error: data.body.message,})
        return;
      }
      // Signin
      await axios.post('/api/users/signin', request);
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }
  }

  render() {
    return (
      <div id="signup">
        <h1>Sign Up</h1>
        <TextField
          id="signup-email"
          label="Email"
          value={this.state.email}
          onChange={this.handleChange.bind(this, 'email')}
          margin="normal"
          style={textFieldStyle}
        />
        <br/>
        <TextField
          id="signup-password"
          label="Password"
          value={this.state.password}
          onChange={this.handleChange.bind(this, 'password')}
          type="password"
          margin="normal"
          style={textFieldStyle}
        />
        <br/>
        <Button onClick={this.submit.bind(this)} id="signup-button">SUBMIT</Button>
        {this.state.error &&
          <p id="signup-error">{this.state.error}</p>
        }
      </div>
    );
  }
}
