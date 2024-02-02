const express = require("express");
const router = express.Router();
const bookmarkModel = require("../models/bookmark.model");

router.get("/", async (req, res) => {
  try {
    const bookmark = await bookmarkModel.find();
    res.json(bookmark);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId || userId.trim() === "") {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const bookmark = await bookmarkModel.find({ userId });
    res.json(bookmark);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

router.post("/post", async (req, res) => {
  const { product_id, userId } = req.body;

  try {
    if (!userId || userId.trim() === "") {
      return res.status(400).json({ message: "Invalid userId" });
    }
    const bookmark = new bookmarkModel({ product_id, userId });
    await bookmark.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error adding item to bookmark:", error);
    res.status(500).json({ message: "Error adding item to bookmark" });
  }
});

router.delete("/delete/:id", async (req, res) => {
    const bookmarkItemId = req.params.id;
  
    try {
      const deleteBookmarkItem = await bookmarkModel.findByIdAndDelete(bookmarkItemId);
  
      if (!deleteBookmarkItem) {
        return res.status(404).json({ message: "bookmark item not found" });
      }
  
      res.status(200).json({ message: "bookmark item deleted successfully" });
    } catch (error) {
      console.error("Error deleting bookmark item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  module.exports = router;
