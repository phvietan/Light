import '../css/dropdownmenu.css';
import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import {
  getFromStorage,
  deleteFromStorage,
} from '../utils/storage';

const axios = require('axios');

export default class DropdownMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };

    this.redirect = this.redirect.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget });
  };

  redirect(url) {
    this.props.history.push(url);
  }

  async handleClose(action) {
    this.setState({ anchorEl: null });
    if (action === 'Profile') this.redirect(`/profile/${this.props.id}`);
    if (action === 'Logout') await this.signout();
  };

  async signout() {
    // deleteFromStorage('')
    const token = getFromStorage('login_token');
    deleteFromStorage('login_token');
    // Logout
    await axios.post('/api/users/logout', { token });
    this.props.history.push('/');
  }

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <Button
          onClick={this.handleClick}
        >
          <p style={{ color: this.props.color }}>{this.props.id}</p>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose.bind(this)}
        >
          <MenuItem onClick={this.handleClose.bind(this, 'Profile')}>Profile</MenuItem>
          <MenuItem onClick={this.handleClose.bind(this, 'Logout')}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
}
