const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../auth/adminAuth");
const adminModel = require("../models/admin.model");

router.get("/", async (req, res) => {
  try {
    const admin = await adminModel.find();
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Error fetching admins" });
  }
});


router.post("/adminRegister", async (req, response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create a new admin instance and collect the data
    const admin = new adminModel({
      adminname: req.body.adminname,
      phone_number: req.body.phone_number,
      email: req.body.email,
      password: hashedPassword,
    });

    // save the new admin
    const result = await admin.save();

    response.status(201).send({
      message: "Admin Created Successfully",
      result,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error creating admin",
      error: error.message,
    });
  }
});

router.post("/adminLogin", async (req, res) => {
  try {
    const user = await adminModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({
        message: "Email not found",
      });
    }

    const passwordCheck = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordCheck) {
      return res.status(400).send({
        message: "Passwords do not match",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      process.env.JWT_SECRET || "ADMIN-TOKEN",
      { expiresIn: "24h" }
    );

    res.status(200).send({
      message: "Login Successful",
      adminname: user.adminname,
      phone_number: user.phone_number,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error during login",
      error: error.message,
    });
  }
});

// authentication endpoint
router.get("/admin-auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = router;
