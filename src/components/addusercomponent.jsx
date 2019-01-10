import '../css/addusercomponent.css';
import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

export default class AddUserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'STUDENT'
    }
  }

  handleChange(name, event) {
    this.props.handleChange(this.props.index, name, event);
  }

  render() {
    return (
      <div id="add-user-component">
        <span>Type:&nbsp;&nbsp;&nbsp;</span>
        <FormControl className="add-user-type">
          <Select
            native
            value={this.props.type}
            onChange={this.handleChange.bind(this, 'type')}
          >
            <option value="STUDENT">STUDENT</option>
            <option value="TEACHER">TEACHER</option>
            {this.props.userType === 'admin' &&
              <option value="STAFF">STAFF</option>
            }
          </Select>
        </FormControl>
        <br/>
        <span>ID: </span>
        <input
          value={this.props.id}
          className="add-user-id"
          onChange={this.handleChange.bind(this, 'id')}
        />
        <br/>
        <span>Email: </span>
        <input
        value={this.props.email}
          className="add-user-email"
          onChange={this.handleChange.bind(this, 'email')}
        />
        <br/>
        <span>Name: </span>
        <input value={this.props.name} onChange={this.handleChange.bind(this, 'name')} />
        {this.props.type === 'STUDENT' &&
          <div>
            <span>Class: </span>
            <input
              value={this.props.clas}
              className="add-user-class"
              onChange={this.handleChange.bind(this, 'class')}
            />
          </div>
        }
      </div>
    );
  }
}
