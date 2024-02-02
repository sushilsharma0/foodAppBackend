// server/models/foodItem.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  first_name:{
    type:String,
    trim:true,
    required:[true, "Enter your first name"]
  },
  last_name:{
    type:String,
    trim:true,
    required:[true ,"Enter your last name"]
  },
  phone_number:{
    type:Number,
    required:[true , "Enter your phone number"],
    trim:true
  },
  email:{
    type:String,
    required:true,
    trim:true
  },
  message:{
    type:String,
    required:true,
    trim:true
  }
});

const messageModel = mongoose.model('Message-From-User', messageSchema);

module.exports = messageModel;
