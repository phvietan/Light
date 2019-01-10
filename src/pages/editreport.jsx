import '../css/editreport.css';
import React, { Component } from 'react';
import GoButton from '../components/gobutton';
import SureModal from '../components/suremodal';
import { MdDeleteForever } from 'react-icons/md';
import NavigationBar from '../components/navigationbar';
import SuccessSnakeBar from '../components/successsnakebar';

import { getFromStorage } from '../utils/storage';

const axios = require('axios');

export default class EditReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      openSnackBarSuccess: false,
      title: '',
      content: '',

      titleRows: 1,
      contentRows: 13,
    };
  }

  async updateReportData() {
    const { id } = this.props.match.params;
    const params = {
      id,
    };

    const { data } = await axios.get('/api/reports/report_info', { params });
    this.setState({
      ...data.reports,
    });
  }

  async authorization() {
    const params = {
      token: getFromStorage('login_token'),
    }
    // If currently login, it should update state of component
    if (params.token) {
      try {
        const { data } = await axios.get('/api/users/info', { params });
        if (data.type !== 'admin' && data.type !== 'staff') {
          if (data._id !== this.state.userId) {
            alert('You are not authorized to view this page, You are returning to Home page');
            this.props.history.push('/home');
            return;
          }
        }

        this.setState({
          user: data,
        });
      } catch (err) {
        // If cannot get info of this token (maybe hacker trying to tampered?)
        alert(err.message);

        // We should redirect to welcome page
        this.props.history.push('/');
      }
    }
    // If not found any token, redirect to welcome page
    else {
      this.props.history.push('/');
    }
  }

  async componentDidMount() {
    await this.updateReportData();
    await this.authorization();
    this.resizeContent(this.state.title, 45, 'titleRows', 1);
    this.resizeContent(this.state.content, 60, 'contentRows', 13);
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;
    this.setState({ openSnackBarSuccess: false });
  };

  resizeContent(str, cols, stateName, minRow) {
    let lineCount = 0;
    str.split('\n').forEach(l => {
      lineCount += Math.ceil((l.length+0.5) / cols);
    });
    this.setState({
      [stateName] : Math.max(lineCount, minRow),
    });
  }

  onChange(name, event) {
    const stateName = (name === 'title') ? 'titleRows' : 'contentRows';
    const minRow = (name === 'title') ? 1 : 13;
    this.resizeContent(event.target.value, event.target.cols, stateName, minRow);
    this.setState({
      [name]: event.target.value,
    });
  }

  async submit() {
    if (!this.state.title) {
      alert('Title should be filled');
      return;
    }
    if (!this.state.content) {
      alert('Content should be filled');
      return;
    }
    const params = {
      title: this.state.title,
      content: this.state.content,
      id: this.props.match.params.id,
      token: getFromStorage('login_token'),
    };
    try {
      await axios.patch('/api/reports/update', params);
      this.setState({ openSnackBarSuccess: true }, () => {
        setTimeout(() => {
          this.props.history.push('/home');
        }, 500)
      });
    } catch (err) {
      alert(err.message);
    }
  }

  async submitRemove() {
    const { id } = this.props.match.params;
    const params = {
      id,
      token: getFromStorage('login_token'),
    };
    await axios.post('/api/reports/delete', params);
    this.setState({ openSnackBarSuccess: true }, () => {
      setTimeout(() => {
        this.props.history.push('/home');
      }, 500)
    });
  }

  handleOpenSureModal() {
    this.setState({ openSureModal: true });
  };

  handleCloseSureModal() {
    this.setState({ openSureModal: false });
  }

  render() {
    return (
      <div id="edit-report">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />
        <div id="edit-paragraph-report">
          <h1 id="edit-report-header">
            Editing Report
            <div className="remove-button" onClick={this.handleOpenSureModal.bind(this)}><MdDeleteForever/></div>
          </h1>

          <textarea
            id="report-title"
            type="text"
            onChange={this.onChange.bind(this, 'title')}
            placeHolder = "Report header"
            value={this.state.title}
            cols={45}
            rows={this.state.titleRows}
          />
          <br/>
          <br/>
          <textarea
            cols={60}
            type="text"
            id="report-content"
            value={this.state.content}
            rows={this.state.contentRows}
            placeHolder = "Report content"
            onChange={this.onChange.bind(this, 'content')}
          />

          <GoButton
            name="SUBMIT?"
            style={{ float: "right" }}
            onClick={this.submit.bind(this)}
          />
        </div>

        <SuccessSnakeBar
          open={this.state.openSnackBarSuccess}
          handleClose={this.handleClose.bind(this)}
          message="SUCCESS UPDATED"
        />

        <SureModal
          open={this.state.openSureModal}
          handleClose={this.handleCloseSureModal.bind(this)}
          message="Are you sure?"
          onClick={this.submitRemove.bind(this)}
        />
      </div>
    );
  }
}
