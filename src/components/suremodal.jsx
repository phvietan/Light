import '../css/suremodal.css';
import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

export default class SureModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.handleClose}
      >
        <Paper id="sure-modal">
          <h1>{this.props.message}</h1>
          <button onClick={this.props.onClick}>YES</button>
        </Paper>
      </Modal>
    );
  }
}
