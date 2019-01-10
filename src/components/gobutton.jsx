import '../css/gobutton.css';
import React, { Component } from 'react';

export default class GoButton extends Component {
  render() {
    return (
      <div className="button" onClick={this.props.onClick} style={this.props.style}>
        <p className="btnText">{this.props.name}</p>
        <div className="btnTwo">
          <p className="btnText2">GO!</p>
        </div>
      </div>
    );
  }
}
