const bcrypt = require('bcrypt-nodejs');
const UserSession = require('../models/user_session_schema');

class dbUserSession {
  async findAll() {
    return UserSession.find();
  }

  async findOne(query) {
    return UserSession.findOne(query);
  }

  async remove(_id) {
    return UserSession.findOneAndDelete({ _id });
  }

  async insert(newUser) {
    return UserSession.create(newUser);
  }

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }
}

module.exports = dbUserSession;
