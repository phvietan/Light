const mongoose = require('mongoose');
const { Schema } = mongoose;
const constants = require('./constants.js');

const { StringRequired } = constants;

var CommentSchema = new Schema({
  userId: StringRequired,
  comment: StringRequired,
});

const ReportSchema = new Schema({
  startDate: {
    type: Date,
    default: Date.now,
  },
  title: StringRequired,
  userId: StringRequired,
  content: StringRequired,
  comment: [CommentSchema],
});

module.exports = mongoose.model('Reports', ReportSchema);
