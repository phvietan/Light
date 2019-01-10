const storage = require('./storage');
const { getFromStorage } = storage;

const axios = require('axios');

const getDataWhenLoggedIn = async () => {
  const params = {
    token: getFromStorage('login_token'),
  }
  // If currently login, it should update state of component
  if (params.token) {
    try {
      const { data } = await axios.get('/api/users/info', { params });
      this.setState({
        ...data,
      });
    } catch (err) {
      // If cannot get info of this token (maybe hacker trying to tampered?)
      console.error(err);

      // We should redirect to welcome page
      this.props.history.push('/');
    }
  }
  // If not found any token, redirect to welcome page
  else {
    this.props.history.push('/');
  }
}

const getDataWhenNotLoggedIn = async () => {
  const params = {
    token: getFromStorage('login_token'),
  }
  // If currently login, it should be redirect to home page
  if (params.token) {
    try {
      await axios.get('/api/users/info', { params });
      this.props.history.push('home')
    } catch (err) {
      throw err;
    }
  }
  else {
    document.body.style.backgroundImage = "url('welcome.png')";
  }
}

module.exports = {
  getDataWhenLoggedIn,
  getDataWhenNotLoggedIn,
};
