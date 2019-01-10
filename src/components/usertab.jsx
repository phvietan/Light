import '../css/usertab.css';
import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';

export default class UserTab extends Component {
  render() {
    const { userId, class: classId, name } = this.props.user;
    return (
      <div>
        <div className="user-tab" onClick={this.props.onClick}>
          <h1>{name}</h1>
          <h2>{classId}</h2>
          <br/>
          <br/>
          <br/>
          <h3>ID: {userId}</h3>
        </div>
        <br/>
        <Divider/>
      </div>
    );
  }
};
