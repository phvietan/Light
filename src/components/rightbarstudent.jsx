import '../css/rightbar.css';
import React, { Component } from 'react';

export default class RightBar extends Component {
  render() {
    return (
      <div className="right-bar" style={{ width: this.props.width }}>
        <div className="right-bar-list right-bar-button" onClick={this.props.handleOpen}>
          REPORT
        </div>
      </div>
    );
  }
}
