const Courses = require('../models/courses_schema');

class dbCourses {
  async findAllByDate() {
    return Courses.find().sort({ date: -1 });
  }

  async findAll() {
    return Courses.find();
  }

  async findOne(query) {
    return Courses.findOne(query);
  }

  async delete(query) {
    return Courses.remove(query);
  }

  async updateById(_id, newValue) {
    const newCourse = { $set: newValue };
    try {
      const updated = await Courses.updateOne({ _id }, newCourse);
      return updated;
    } catch (err) {
      throw err;
    }
  }

  async insert(newCourse) {
    return Courses.create(newCourse);
  }
}

module.exports = dbCourses;
