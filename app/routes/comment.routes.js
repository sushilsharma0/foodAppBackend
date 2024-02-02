const express = require("express");
const router = express.Router();
const commentModel = require("../models/comment.models");

router.get("/", async (req, res) => {
  try {
    const { productId } = req.query;
    const comments = await commentModel.find({ productId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { productId, username, comment } = req.body;

  const newComment = new commentModel({
    productId,
    username,
    comment,
  });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedComment = await commentModel.findByIdAndUpdate(req.params.id,{
        comment:req.body.comment
    },{new:true})

    if (!updatedComment) {
        return res.status(404).json({ message: 'comments not found for updating' });
      }
  
      res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await commentModel.findByIdAndDelete(req.params.id);


    if (!result) {
        return res.status(404).json({ message: 'comment not found for deletion' });
      }
  
      res.json({ message: 'comment deleted' });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
