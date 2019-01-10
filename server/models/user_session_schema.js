const mongoose = require('mongoose');
const { Schema } = mongoose;
const constants = require('./constants')

const { StringRequired } = constants;

const UserSessionSchema = new Schema({
  userId: StringRequired,
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('UserSession', UserSessionSchema);
