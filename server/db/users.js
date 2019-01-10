const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');
const Users = require('../models/users_schema');

class dbUsers {
  async findAll() {
    return Users.find();
  }

  async findOne(query) {
    return Users.findOne(query);
  }

  async find(query) {
    return Users.find(query);
  }

  async updateById(id, newValue) {
    const newUser = { $set: newValue };
    try {
      const updated = await Users.updateOne({ _id: id }, newUser);
      return updated;
    } catch (err) {
      throw err;
    }
  }

  async insert(newUser) {
    return Users.create(newUser);
  }

  async insertMany(newPeople) {
    return Users.insertMany(newPeople);
  }

  async delete(query) {
    return Users.remove(query);
  }

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }
}

module.exports = dbUsers;
