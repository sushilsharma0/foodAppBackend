const express = require("express");
const router = express.Router();
const buyProductModel = require("../models/buyProduct.model");

router.get("/get", async (req, res) => {
  try {
    const data = await buyProductModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/post", async (req, res) => {
  const {
    product_details,
    userId,
    userName,
    full_name,
    address,
    city,
    state_province,
    postal_code,
  } = req.body;

  try {
    const data = new buyProductModel({
      product_details,
      userId,
      userName,
      full_name,
      address,
      city,
      state_province,
      postal_code,
    });

    const savedData = await data.save();
    res.json(savedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
