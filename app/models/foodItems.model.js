// server/models/foodItem.js
const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: String,
  category:String,
  tags:{
    type:String,
    lowercase:true
  },
  description: String,
  price: Number,
  image:String,
  // Add more fields as needed
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
