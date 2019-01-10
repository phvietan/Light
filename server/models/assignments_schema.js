const { Schema } = mongoose;
const mongoose = require('mongoose');
const constants = require('./constants.js')

const { StringRequired } = constants;

const AssignmentsSchema = new Schema({
  courseId: StringRequired,
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Assignments', AssignmentsSchema);
