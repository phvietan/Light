import '../css/reportpage.css';
import { MdEdit } from 'react-icons/md';
import React, { Component } from 'react';
import { getFromStorage } from '../utils/storage';
import NavigationBar from '../components/navigationbar';

const axios = require('axios');

export default class ReportPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      title: '',
      content: '',

      comment: [],

      titleRows: 1,
      contentRows: 13,
    };
  }

  async authorization() {
    const params = {
      token: getFromStorage('login_token'),
    }
    // If currently login, it should update state of component
    if (params.token) {
      try {
        const { data } = await axios.get('/api/users/info', { params });
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

  async updateUsername() {
    const params = {
      id: this.state.userId,
      token: getFromStorage('login_token'),
    };
    const { data } = await axios.get('/api/users/user_info', { params });
    this.setState({
      username: data.name,
    });
  }

  async componentDidMount() {
    await this.authorization();
    await this.updateReportData();
    await this.updateUsername();
    this.resizeContent(this.state.title, 45, 'titleRows', 1);
    this.resizeContent(this.state.content, 60, 'contentRows', 1);
  }

  resizeContent(str, cols, stateName, minRow) {
    let lineCount = 0;
    str.split('\n').forEach(l => {
      lineCount += Math.ceil((l.length+0.5) / cols);
    });
    this.setState({
      [stateName] : Math.max(lineCount, minRow),
    });
  }

  async onChange(id, userId, event) {
    if (event.key === 'Enter') {
      const { value: comment } = document.getElementById('comment-section');
      if (comment === '') return;

      const params = {
        id,
        userId,
        comment,
      };

      try {
        await axios.post('/api/reports/comment', params);
        await this.updateReportData();
      } catch (err) {
        alert(err.message);
      }
      document.getElementById('comment-section').value = '';
    }
  }

  editReport() {
    this.props.history.push(`/edit/report/${this.props.match.params.id}`);
  }

  render() {
    const userType = this.state.user.type;
    const isAppearEdit = this.state.userId === this.state.user._id || userType === 'admin' || userType === 'staff';
    return (
      <div id="report-page">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />
        <div id="paragraph-report-page">
          <h1>Title:
            {isAppearEdit &&
              <span>
                <span className="button-report" onClick={this.editReport.bind(this)}><MdEdit/></span>
              </span>
            }
          </h1>

          <textarea
            cols={45}
            disabled
            type="text"
            id="report-page-title"
            value={this.state.title}
            rows={this.state.titleRows}
          />
          <br/>
          <br/>
          <h1>Content: </h1>
          <textarea
            disabled
            cols={60}
            type="text"
            id="report-page-content"
            value={this.state.content}
            rows={this.state.contentRows}
          />
          <h1>By: {this.state.username}</h1>

          <input
            id="comment-section"
            onKeyPress={this.onChange.bind(this, this.props.match.params.id, this.state.user.userId)}
            placeHolder="Place a comment..."
          />
          {this.state.comment.map((comment, index) =>
            <div
              key={`comment-${index}`}
              className="user-comment-section"
              style={index % 2 === 0 ? { backgroundColor: '#FAFAFA' } : { backgroundColor: '#FFF1F1' } }
            >
              <span
                className="comment-user-id"
                style={ this.state.user.userId === comment.userId ? { borderBottom: '1px solid #FA5A5B' } : {}}
              >
                {comment.userId}:
              </span>
              <span className="comment-content">{comment.comment} </span>
              <br/>
            </div>
          )}
        </div>
      </div>
    );
  }
}
