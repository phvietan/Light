const mongoose = require('mongoose');
const { Schema } = mongoose;
const constants = require('./constants.js')

const { StringRequired } = constants;

const UserCourseSchema = new Schema({
  userId: StringRequired,
  courseId: StringRequired,
});

module.exports = mongoose.model('UserCourse', UserCourseSchema);
