const mongoose = require('mongoose');
const { Schema } = mongoose;
const constants = require('./constants.js');

const { StringRequired } = constants;

const NewsSchema = new Schema({
  startDate: {
    type: Date,
    default: Date.now,
  },
  title: StringRequired,
  content: StringRequired,
});

module.exports = mongoose.model('News', NewsSchema);
