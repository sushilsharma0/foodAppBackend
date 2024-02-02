const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    product_id : String,
    quantity: {
        type: Number,
        default: 1,
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true });

const cartModel = mongoose.model("cart", cartSchema);

module.exports = cartModel;
