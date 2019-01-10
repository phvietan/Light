import '../css/login.css';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { setToStorage, deleteFromStorage } from '../utils/storage';

const axios = require('axios');

const textFieldStyle = {
  width: "75%",
  fontSize: "0.5em",
};

export default class Login extends Component {
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
      const { data } = await axios.post('/api/users/signin', request);
      if (!data.error_code) {
        const { token } = data.body;
        setToStorage('login_token', token);
        this.props.history.push('/home');
      }
      else {
        deleteFromStorage('login_token');
        this.setState({error: data.body.message,})
      }
    } catch (err) {
      this.setState({error: err.message,})
      deleteFromStorage('login_token');
    }
  }

  render() {
    return (
      <div id="login">
        <h1>Login</h1>

        <TextField
          id="login-email"
          label="Email"
          value={this.state.email}
          onChange={this.handleChange.bind(this, 'email')}
          margin="normal"
          style={textFieldStyle}
        />
        <br/>
        <TextField
          id="login-password"
          label="Password"
          value={this.state.password}
          onChange={this.handleChange.bind(this, 'password')}
          type="password"
          margin="normal"
          style={textFieldStyle}
        />
        <br/>
        <br/>
        <Button onClick={this.submit.bind(this)} id="login-button">SUBMIT</Button>
        {this.state.error &&
          <p id="login-error">{this.state.error}</p>
        }
      </div>
    );
  }
}
