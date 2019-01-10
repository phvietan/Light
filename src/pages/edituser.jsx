import '../css/edituser.css';
import React, { Component } from 'react';
import GoButton from '../components/gobutton';
import Select from '@material-ui/core/Select';
import SureModal from '../components/suremodal';
import { MdDeleteForever } from "react-icons/md";
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import NavigationBar from '../components/navigationbar';
import SuccessSnakeBar from '../components/successsnakebar';

import { getFromStorage } from '../utils/storage';

const axios = require('axios');

export default class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      openSureModal: false,
      openSnackBarSuccess: false,

      password: '',
      showResetPassword: false,
    };
  }

  async authorization() {
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

  async updateUserData() {
    const { id } = this.props.match.params;
    const params = {
      id,
      token: getFromStorage('login_token'),
    };

    const { data } = await axios.get('/api/users/user_info', { params });
    this.setState({
      ...data,
      classId: data.class,
    });
  }

  async componentDidMount() {
    await this.authorization();
    await this.updateUserData();
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;
    this.setState({ openSnackBarSuccess: false });
  };

  handleOpenSureModal() {
    this.setState({ openSureModal: true });
  };

  handleCloseSureModal() {
    this.setState({ openSureModal: false });
  }

  async submitRemove() {
    const { id } = this.props.match.params;
    const params = {
      id,
      token: getFromStorage('login_token'),
    };
    await axios.post('/api/users/delete', params);
    this.setState({ openSnackBarSuccess: true }, () => {
      setTimeout(() => {
        this.props.history.push('/home');
      }, 500);
    });
  }

  async submit() {
    if (!this.state.type) {
      this.setState({
        error: 'Type should be filled',
      });
      return;
    }
    if (!this.state.email) {
      this.setState({
        error: 'Email should be filled',
      });
      return;
    }
    if (!this.state.name) {
      this.setState({
        error: 'Name should be filled',
      });
      return;
    }
    if (this.state.type === 'student' && !this.state.classId) {
      this.setState({
        error: 'Class should be filled',
      });
      return;
    }
    if (!this.state.userId) {
      this.setState({
        error: 'ID should be filled',
      });
      return;
    }

    const { id } = this.props.match.params;
    const params = {
      id,
      name: this.state.name,
      email: this.state.email,
      type: this.state.type,
      userId: this.state.userId,
      password: this.state.password,
      token: getFromStorage('login_token'),
      classId: (this.state.type !== 'student') ? '' : this.state.classId,
    };

    try {
      await axios.patch('/api/users/update', params);
      this.setState({ openSnackBarSuccess: true }, () => {
        setTimeout(() => {
          this.props.history.push('/home');
        }, 500);
      });
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }
  }

  onChange(name, event) {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleChange(name, event) {
    this.props.handleChange(this.props.index, name, event);
  }

  render() {
    const { userId } = this.state;
    return (
      <div id="edit-user">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />

        <div id="edit-paragraph-user">
          <h1 id="edit-user-header">
            Editing user {userId}
            <div className="remove-button" onClick={this.handleOpenSureModal.bind(this)}><MdDeleteForever/></div>
          </h1>

          <span>Type: </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <FormControl className="add-user-type">
            <Select
              native
              value={this.state.type}
              onChange={this.onChange.bind(this, 'type')}
            >
              <option value="student">STUDENT</option>
              <option value="teacher">TEACHER</option>
              <option value="staff">STAFF</option>
            </Select>
          </FormControl>

          <br/>
          <br/>

          <span>Email: </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <TextField
            id="edit-user-email"
            value={this.state.email}
            onChange={this.onChange.bind(this, 'email')}
            fulldWidth
          />

          <br/>
          <br/>

          <span>Name: </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <TextField
            id="edit-user-name"
            value={this.state.name}
            onChange={this.onChange.bind(this, 'name')}
            fulldWidth
          />

          <br/>
          <br/>

          {this.state.type === 'student' &&
            <div>
              <span>Class: </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                id="edit-user-class"
                value={this.state.classId}
                onChange={this.onChange.bind(this, 'classId')}
                fulldWidth
              />

              <br/>
              <br/>
            </div>
          }

          <span>Password: </span>&nbsp;&nbsp;&nbsp;
          <TextField
            id="edit-user-password"
            value={this.state.password}
            onChange={this.onChange.bind(this, 'password')}
            type="password"
          />
          <br/>
          <br/>
          <p style={{ opacity: '0.5', cursor: 'default', color: 'grey' }}>If password is specified, that user's password will be reset</p>

          <GoButton
            onClick={this.submit.bind(this)}
            name="EDIT?"
            style={{ float: 'left' }}
          />

        </div>

        <SuccessSnakeBar
          open={this.state.openSnackBarSuccess}
          handleClose={this.handleClose.bind(this)}
          message="SUCCESSFULLY UPDATE"
        />

        <SureModal
          open={this.state.openSureModal}
          handleClose={this.handleCloseSureModal.bind(this)}
          message="Are you sure?"
          onClick={this.submitRemove.bind(this)}
        />

      </div>
    );
  }
}
