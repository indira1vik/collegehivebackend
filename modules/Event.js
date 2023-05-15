const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    eventid:String,
    ename:String,
    creatorid:String,
    desc:String,
    edate:String,
    venue:String,
    reglink:String,
    verified:Boolean
  });

const EventModel = mongoose.model('events', EventSchema);

module.exports = EventModel;