const mongoose = require('mongoose');
const { Schema } = mongoose;
const constants = require('./constants.js')

const { StringRequired, TypeString } = constants;

const CoursesSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  year: Number,
  semester: Number,
  name: StringRequired,
  code: StringRequired,
  content: StringRequired,
  teacherId: TypeString,
});

module.exports = mongoose.model('Courses', CoursesSchema);
