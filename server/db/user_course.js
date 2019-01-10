const UserCourse = require('../models/user_course_schema');

class dbUserCourse {
  async findOne(query) {
    return UserCourse.findOne(query);
  }

  async findAll() {
    return UserCourse.find();
  }

  async find(query) {
    return UserCourse.find(query);
  }

  async delete(query) {
    return UserCourse.remove(query);
  }

  async insert(newUserCourse) {
    return UserCourse.create(newUserCourse);
  }
}

module.exports = dbUserCourse;
