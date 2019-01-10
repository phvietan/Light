import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';

export default class DateAndTime extends Component {
    render() {
      return (
        <DateTimePicker
          onChange={this.props.onChange}
          value={this.props.moment}
          clearIcon={null}
          required
          locale="vi"
        />
      );
    }
}
