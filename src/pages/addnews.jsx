import '../css/addnews.css';
import React, { Component } from 'react';
import GoButton from '../components/gobutton';
import RightBar from '../components/rightbar';
import PostModal from '../components/postmodal';
import NavigationBar from '../components/navigationbar';
import SuccessSnakeBar from '../components/successsnakebar';
import { getFromStorage, setToStorage } from '../utils/storage';

const axios = require('axios');

export default class AddNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        type: 'staff',
      },
      openSnackBarSuccess: false,
      title: getFromStorage('title') ? getFromStorage('title') : '',
      content: getFromStorage('content') ? getFromStorage('content') : '',

      titleRows: 1,
      contentRows: 13,
    };
    setToStorage('title', this.state.title);
    setToStorage('content', this.state.content);
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
      setToStorage('title', this.state.title);
      setToStorage('content', this.state.content);
    });
  }

  async submit() {
    if (!this.state.title) {
      alert('Title should be filled');
      return;
    }
    if (!this.state.content) {
      alert('Title should be filled');
      return;
    }
    const params = {
      title: this.state.title,
      content: this.state.content,
      token: getFromStorage('login_token'),
    };
    try {
      await axios.post('/api/news/create', params);
      this.setState({ openSnackBarSuccess: true }, () => {
        setTimeout(() => {
          this.props.history.push('/home');
        }, 500)
      });
    } catch (err) {

    }
    setToStorage('title', '');
    setToStorage('content', '');
  }

  handleOpenPostModal() {
    this.setState({ openPostModal: true });
  };

  handleClosePostModal() {
    this.setState({ openPostModal: false });
  };

  chooseOption(option) {
    if (option==='News') this.handleClosePostModal();
    if (option==='User') this.props.history.push('/add/user');
    if (option==='Course') this.props.history.push('/add/course');
  }

  render() {
    const userType = this.state.user.type;
    return (
      <div id="add-news">
        <NavigationBar
          user={this.state.user}
          history={this.props.history}
        />
        <div id="paragraph-news">
          <h1 id="add-news-header">Adding News</h1>
          <textarea
            id="news-title"
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
            id="news-content"
            placeHolder = "What is all the fuss about?"
            type="text"
            onChange={this.onChange.bind(this, 'content')}
            value={this.state.content}
            rows={this.state.contentRows}
            cols={60}
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

        {(userType === 'admin' || userType === 'staff') &&
          <div>
            <RightBar
              width="20%"
              handleOpen={this.handleOpenPostModal.bind(this)}
            />
            <PostModal
              open={this.state.openPostModal}
              handleClose={this.handleClosePostModal.bind(this)}
              chooseOption={this.chooseOption.bind(this)}
            />
          </div>
        }
      </div>
    );
  }
}
