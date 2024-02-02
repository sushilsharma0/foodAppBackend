const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const User = require("../models/users.model")(mongoose);
const auth = require("../auth/auth");
const multer = require("multer");
const sharp = require("sharp");
// Set up multer for handling file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Get all food items
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(500).json({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "user not found for deletion" });
    }
    res.json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

// register endpoint
router.post(
  "/register",
  upload.single("profileImage"),
  async (request, response) => {
    // Use sharp to compress and convert the image to base64
    const compressedImageBuffer = await sharp(request.file.buffer)
      .resize({ width: 300 }) // Adjust the width as needed
      .toBuffer();

    const base64Data = compressedImageBuffer.toString("base64");

    // hash the password
    bcrypt
      .hash(request.body.password, 10)
      .then((hashedPassword) => {
        // create a new user instance and collect the data
        const user = new User({
          username: request.body.username,
          phone_number: request.body.phone_number,
          email: request.body.email,
          password: hashedPassword,
          profileImage: base64Data,
        });

        // save the new user
        user
          .save()
          // return success if the new user is added to the database successfully
          .then((result) => {
            response.status(201).send({
              message: "User Created Successfully",
              result,
            });
          })
          // catch error if the new user wasn't added successfully to the database
          .catch((error) => {
            response.status(500).send({
              message: "Error creating user",
              error: error.message,
            });
          });
      })
      // catch error if the password hash isn't successful
      .catch((e) => {
        response.status(500).send({
          message: "Password was not hashed successfully",
          error: e.message,
        });
      });
  }
);

// login endpoint
router.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {
          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            id: user._id,
            email: user.email,
            username: user.username,
            profileImage: user.profileImage,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error: error.message,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e: e.message,
      });
    });
});

router.put("/update/:id", upload.single("profileImage"), async (req, res) => {
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
        profileImage: base64Data,
        username: req.body.username,
        phone_number: req.body.phone_number,
        email: req.body.email,
      };

      // Use the { new: true } option to return the updated document
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found for updating" });
      }

      res.json(updatedUser);
    } else {
      // If no file is provided, update only non-file fields
      const updateFields = {
        username: req.body.username,
        phone_number: req.body.phone_number,
        email: req.body.email,
      };

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found for updating" });
      }

      res.json(updatedUser);
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating user", error: error.message });
  }
});



// authentication endpoint
router.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = router;
