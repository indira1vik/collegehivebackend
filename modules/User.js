const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userid:String,
    fname:String,
    email:String,
    role:String,
    dept:String,
    batch:String,
    pass:String
  });

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;