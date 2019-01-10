const mongoose = require('mongoose');
const { Schema } = mongoose;
const constants = require('./constants')
const bcrypt = require('bcrypt-nodejs');

const {
  TypeString,
  StringEmail,
  StringRequired,
  StringRequiredUnique,
  StringRequiredLowercase,
} = constants;

const UsersSchema = new Schema({
  name: TypeString,
  class: TypeString,
  email: StringEmail,
  password: StringRequired,
  userId: StringRequiredUnique,
  type: StringRequiredLowercase,
});

UsersSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UsersSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Users', UsersSchema);
