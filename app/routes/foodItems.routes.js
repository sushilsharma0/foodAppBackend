const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const mongoose = require("mongoose");
const FoodItem = require("../models/foodItems.model");

// Get all food items
router.get("/", async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific food item by ID
router.get("/:id", async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    res.json(foodItem);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Set up multer for handling file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Adjust file size limit as needed
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, category, tags, description, price } = req.body;

    // Use sharp to compress and convert the image to base64
    const compressedImageBuffer = await sharp(req.file.buffer)
      .resize({ width: 300 }) // Adjust the width as needed
      .toBuffer();

    const base64Data = compressedImageBuffer.toString("base64");

    const newFoodItem = new FoodItem({
      name: name,
      category: category,
      tags :tags,
      description: description,
      price: price,
      image: base64Data,
    });

    await newFoodItem.save();
    res.json("ok");
  } catch (error) {
    res.json(error);
  }
});

router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    // Check if req.file is defined before accessing its properties
    if (req.file && req.file.buffer) {
      // Process the image
      const compressedImageBuffer = await sharp(req.file.buffer)
        .resize({ width: 300 })
        .toBuffer()
        .catch((error) => {
          throw new Error(`Error processing image: ${error.message}`);
        });

      const base64Data = compressedImageBuffer.toString("base64");

      // Update fields for both file and non-file updates
      const updateFields = {
        image: base64Data,
        name: req.body.name,
        category: req.body.category,
        tags:req.body.tags,
        description: req.body.description,
        price: req.body.price,
      };

      // Use the { new: true } option to return the updated document
      const updatedFood = await FoodItem.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
      );

      if (!updatedFood) {
        return res
          .status(404)
          .json({ message: "Ufood item not found for updating" });
      }

      res.json(updatedFood);
    } else {
      // If no file is provided, update only non-file fields
      const updateFields = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        tags:req.body.tags,
        price: req.body.price,
      };

      const updatedFood = await FoodItem.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
      );

      if (!updatedFood) {
        return res
          .status(404)
          .json({ message: "Food item not found for updating" });
      }

      res.json(updatedFood);
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating food item", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedFoodItem = await FoodItem.findByIdAndDelete(req.params.id);

    if (!deletedFoodItem) {
      return res
        .status(404)
        .json({ message: "Food item not found for deletion" });
    }

    res.json({ message: "Food item deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting food item", error: error.message });
  }
});

module.exports = router;
