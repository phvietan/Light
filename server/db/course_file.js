const bcrypt = require('bcrypt-nodejs');
const CourseFile = require('../models/course_file_schema');

class dbCourseFile {
  async findAll() {
    return CourseFile.find();
  }

  async find(query) {
    return CourseFile.find(query);
  }

  async findOne(query) {
    return CourseFile.findOne(query);
  }

  async delete(query) {
    return CourseFile.remove(query);
  }

  async insert(newCourseFile) {
    return CourseFile.create(newCourseFile);
  }
}

module.exports = dbCourseFile;
