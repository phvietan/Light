import UserTab from './usertab';
import SearchBar from './searchbar';
import React, { Component } from 'react';
import { getFromStorage } from '../utils/storage';

const axios = require('axios');

export default class ManageUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      searchValue: '',
      filteredUsers: [],
      getType: props.getType,
    };
  }

  async componentDidMount() {
    const params = {
      token: getFromStorage('login_token'),
    };
    const { data } = await axios.get('/api/users/all_users', { params });
    const users = data.users.filter(user => user.type === this.state.getType);

    this.setState({
      users,
      filteredUsers: users,
    });
  }

  search(event) {
    this.setState({
      searchValue: event.target.value
    }, () => {
      const { searchValue } = this.state;
      if (searchValue === '') this.setState({
        filteredUsers: this.state.users,
      });
      else {
        const filteredUsers = this.state.users.filter(user => user.userId.indexOf(searchValue) > -1);
        this.setState({
          filteredUsers,
        });
      }
    });
  }

  onClick(userId) {
    this.props.history.push(`/edit/user/${userId}`);
  }

  render() {
    return (
      <div id={this.props.id}>
        <br/>
        <SearchBar
          value={this.state.searchValue}
          onChange={this.search.bind(this)}
          placeHolder="Search by user id"
        />
        {this.state.filteredUsers.map(user =>
          <UserTab
            key={user.userId}
            user={user}
            onClick={this.onClick.bind(this, user._id)}
          />
        )}
      </div>
    );
  }
}
