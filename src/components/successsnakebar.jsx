import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";

export default class SuccessSnakeBar extends Component {
  render() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.props.open}
          onClose={this.props.handleClose}
        >
          <SnackbarContent
            aria-describedby="client-snackbar"
            style={{ color: 'white', backgroundColor: 'green' }}
            message={
              <span id="client-snackbar" style={{ cursor: 'default' }}>
                <IoIosCheckmarkCircle />
                &nbsp; 	&nbsp; 	&nbsp;
                {this.props.message}
              </span>
            }
            action={[
              <IoIosCloseCircle
                key="close"
                aria-label="Close"
                color="inherit"
                style={{ cursor: 'pointer' }}
                onClick={this.props.handleClose}
              />
            ]}
          />
        </Snackbar>
      </div>
    );
  }
}
