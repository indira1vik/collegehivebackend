const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    userid:String,
    event:Object
  });

const RegisterModel = mongoose.model('registers', RegisterSchema);

module.exports = RegisterModel;