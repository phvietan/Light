import '../css/editnews.css';
import React, { Component } from 'react';
import GoButton from '../components/gobutton';
import SureModal from '../components/suremodal';
import { MdDeleteForever } from "react-icons/md";
import NavigationBar from '../components/navigationbar';
import SuccessSnakeBar from '../components/successsnakebar';
import { getFromStorage } from '../utils/storage';

const axios = require('axios');

export default class EditNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        type: 'staff',
      },
      title: '',
      content: '',
      titleRows: 1,
      contentRows: 13,
      openSureModal: false,
      openSnackBarSuccess: false,
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
        if (data.type !== 'admin' && data.type !== 'staff') {
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

  async updateNewsData() {
    const { id } = this.props.match.params;
    const params = {
      id,
    };

    const { data } = await axios.get('/api/news/info', { params });
    this.setState({
      title: data.title,
      content: data.content,
    });
  }

  async componentDidMount() {
    await this.authorization();
    await this.updateNewsData();
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
    const { id } = this.props.match.params;
    const params = {
      id,
      title: this.state.title,
      content: this.state.content,
      token: getFromStorage('login_token'),
    };
    try {
      await axios.patch('/api/news/update', params);
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
    await axios.post('/api/news/delete', params);
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
      <div id="edit-news">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />
        <div id="edit-paragraph-news">
          <h1 id="edit-news-header">
            Editing News
            <div className="remove-button" onClick={this.handleOpenSureModal.bind(this)}><MdDeleteForever/></div>
          </h1>
          <textarea
            id="edit-news-title"
            type="text"
            onChange={this.onChange.bind(this, 'title')}
            placeHolder = "News title"
            value={this.state.title}
            cols={45}
            rows={this.state.titleRows}
          />
          <br/>
          <br/>
          <textarea
            id="edit-news-content"
            placeHolder = "What is all the fuss about?"
            type="text"
            onChange={this.onChange.bind(this, 'content')}
            value={this.state.content}
            rows={this.state.contentRows}
            cols={60}
          />

          <br/>
          <GoButton
            name="EDIT?"
            style={{ float: "right" }}
            onClick={this.submit.bind(this)}
          />
        </div>

        <SuccessSnakeBar
          open={this.state.openSnackBarSuccess}
          handleClose={this.handleClose.bind(this)}
          message="SUCCESSFULLY UPDATE"
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
