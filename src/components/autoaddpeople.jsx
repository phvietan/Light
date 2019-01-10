import GoButton from './gobutton';
import '../css/autoaddpeople.css';
import React, { Component } from 'react';
import SuccessSnakeBar from '../components/successsnakebar';

const axios = require('axios');

export default class AutoAddPeople extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      openSnackBarSuccess: false,
      showHelper: false,
    };
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;
    this.setState({ openSnackBarSuccess: false });
  };

  async submit() {
    const { files } = document.getElementById("auto-upload-file");
    if (!Boolean(files[0])) {
      alert('No file choosing');
      return;
    }
    const formData = new FormData();
    formData.append("data", files[0]);
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };
    try {
      await axios.post('/api/users/upload', formData, config);
      this.setState({ openSnackBarSuccess: true }, () => {
        setTimeout(() => {
          this.props.history.push('/home');
        }, 500)
      });
    } catch (err) {
      alert(err.message);
      // this.setState({
        // errorMessage: err,
      // });
    }
  }

  handleHelper = () => {
    this.setState({ showHelper: !this.state.showHelper })
  }

  render() {
    return (
      <>
      <div id="auto-add-people" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {
          this.state.showHelper &&
          <>
            <div style={{ alignItems: 'left', fontFamily: 'Helvetica', fontWeight: 'lighter' }}>
              <div style={{ margin: '3px' }}>There must be 5 required fields in your file: type, name, userid, email, class</div>
              <div style={{ margin: '3px' }}>Default password will be '1' for all account</div>
            </div>
            <img src="https://i.ibb.co/HBzY9DC/Screen-Shot-2019-01-10-at-10-25-11-AM.jpg" alt="Screen-Shot-2019-01-10-at-10-25-11-AM" border="0"
                style={{ margin: '10px' }}
            />
          </>
        }
        <input
          type="file"
          id="auto-upload-file"
          accept=".csv, .txt, .xlsx, .xls"
        />
        <GoButton
          name="SUBMIT?"
          onClick={this.submit.bind(this)}
        />
        <SuccessSnakeBar
          open={this.state.openSnackBarSuccess}
          handleClose={this.handleClose.bind(this)}
          message="SUCCESS UPLOADED"
        />
        <p style={{ 'color': 'red' }}>{this.state.errorMessage}</p>
      </div>
      <button onClick={this.handleHelper}>
      {
        !this.state.showHelper ? 'Help?' : 'Hide'
      }
      </button>
      </>
    );
  }
};
