const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
    product_id : String,
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true });

const bookmarkModel = mongoose.model("bookmark", bookmarkSchema);

module.exports = bookmarkModel;
