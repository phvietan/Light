const TypeString = {
  type: String,
  default: '',
};

const StringRequired = {
  type: String,
  required: true,
  default: '',
};

const StringRequiredLowercase = {
  type: String,
  required: true,
  lowercase: true,
};

const StringRequiredUnique = {
  type: String,
  required: true,
  unique: true,
};

const StringEmail = {
  type: String,
  required: true,
  unique: true,
  match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
};


module.exports = {
    TypeString,
    StringRequired,
    StringRequiredLowercase,
    StringRequiredUnique,
    StringEmail,
};
