const mongoose = require('mongoose');
const { Schema } = mongoose;
const constants = require('./constants.js')

const { StringRequired, TypeString } = constants;

const CourseFileSchema = new Schema({
  userId: StringRequired,
  courseId: StringRequired,
  assignmentId: TypeString,
  fileName: StringRequired,
  fileTopic: StringRequired,
  fileOriginalName: StringRequired,
});

module.exports = mongoose.model('CourseFile', CourseFileSchema);
