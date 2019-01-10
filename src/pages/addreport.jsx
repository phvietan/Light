import '../css/addreport.css';
import React, { Component } from 'react';
import GoButton from '../components/gobutton';
import NavigationBar from '../components/navigationbar';
import SuccessSnakeBar from '../components/successsnakebar';
import { getFromStorage, setToStorage } from '../utils/storage';

const axios = require('axios');

export default class AddReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        type: 'staff',
      },
      openSnackBarSuccess: false,
      title: getFromStorage('report-title') ? getFromStorage('report-title') : '',
      content: getFromStorage('report-content') ? getFromStorage('report-content') : '',

      titleRows: 1,
      contentRows: 13,
    };
    setToStorage('report-title', this.state.title);
    setToStorage('report-content', this.state.content);
  }

  async authorization() {
    const params = {
      token: getFromStorage('login_token'),
    }
    // If currently login, it should update state of component
    if (params.token) {
      try {
        const { data } = await axios.get('/api/users/info', { params });
        if (data.type !== 'student' && data.type !== 'teacher') {
          alert('You are not authorized to view this page, You are returning to Home page');
          this.props.history.push('/home');
          return;
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
    }, () => {
      setToStorage('report-title', this.state.title);
      setToStorage('report-content', this.state.content);
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
      token: getFromStorage('login_token'),
    };
    try {
      await axios.post('/api/reports/create', params);
      this.setState({ openSnackBarSuccess: true }, () => {
        setTimeout(() => {
          this.props.history.push('/home');
        }, 500)
      });
    } catch (err) {
      alert(err.message);
    }
    setToStorage('report-title', '');
    setToStorage('report-content', '');
  }

  render() {
    return (
      <div id="add-report">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />
        <div id="paragraph-report">
          <h1 id="add-report-header">Reporting</h1>
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
          message="SUCCESS UPLOADED"
        />
      </div>
    );
  }
}
