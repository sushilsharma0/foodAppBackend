const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    adminname:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    phone_number:{
        type:Number,
        required:true,
        trim:true
    },
    email: {
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    }
},{timestamps:true});

const adminModel = mongoose.model("admin" , adminSchema);

module.exports = adminModel;