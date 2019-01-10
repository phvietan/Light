const bcrypt = require('bcrypt-nodejs');
const Assignments = require('../models/assignments_schema');

class dbAssignments {
  async findAll() {
    return Assignments.find();
  }

  async findOne(query) {
    return Assignments.findOne(query);
  }

  async remove(_id) {
    return Assignments.findOneAndDelete({ _id });
  }

  async insert(newCourseFile) {
    return Assignments.create(newCourseFile);
  }
}

module.exports = dbAssignments;
