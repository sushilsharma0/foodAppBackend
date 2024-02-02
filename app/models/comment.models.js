const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
    },
    username: String,
    comment: String,
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
