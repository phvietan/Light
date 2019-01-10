import GoButton from './gobutton';
import '../css/addpeoplebyhand.css';
import React, { Component } from 'react';
import { IoIosAdd } from "react-icons/io";
import AddUserComponent from './addusercomponent';
import { getFromStorage } from '../utils/storage';
import SuccessSnakeBar from '../components/successsnakebar';

const axios = require('axios');

export default class AddPeopleByHand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSnackBarSuccess: false,
      people: [{ id: '', name: '', class: '', type: 'STUDENT', email: '' }],
    };
  }

  handleChange(index, name, event) {
    const newValuePerson = {
      ...(this.state.people[index]),
      [name]: event.target.value,
    }
    const newValuePeople = this.state.people.map((person, idx) => {
      if (index !== idx) return person;
      return newValuePerson;
    });
    this.setState({
      people: newValuePeople,
    });
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;
    this.setState({ openSnackBarSuccess: false });
  };

  addMoreUser() {
    this.setState({
      people: [...this.state.people, { id: '', name: '', class: '', type: 'STUDENT', email: '' }]
    });
  }

  async submit() {
    const params = {
      people: this.state.people,
      token: getFromStorage('login_token'),
    };
    try {
      await axios.post('/api/users/adduser', params);
      this.setState({ openSnackBarSuccess: true }, () => {
        setTimeout(() => {
          this.props.history.push('/home');
        }, 500)
      });
    } catch (err) {
      alert(err.message);
    }
  }

  render() {
    return (
      <div id="people-component">
        {this.state.people.map((person, index) =>
          <div id={`people-component-${index}`}>
            <AddUserComponent
              userType={this.props.userType}
              type={person.type}
              index={index}
              handleChange={this.handleChange.bind(this)}
              id={person.id}
              name={person.name}
              email={person.email}
            />
          </div>
        )}
        <br/>
        <div id="add-user-button" onClick={this.addMoreUser.bind(this)}>
          <h1>
            <IoIosAdd />
            More users
          </h1>
        </div>
        <GoButton
          onClick={this.submit.bind(this)}
          name="SUBMIT"
        />
        <SuccessSnakeBar
          open={this.state.openSnackBarSuccess}
          handleClose={this.handleClose.bind(this)}
          message="SUCCESS UPLOADED"
        />

      </div>
    );
  }
};
