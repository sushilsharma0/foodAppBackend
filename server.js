require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./app/routes/users.routes");
const foodRoutes = require("./app/routes/foodItems.routes");
const commentRoutes = require("./app/routes/comment.routes");
const adminRoutes = require("./app/routes/admin.routes");
const message = require("./app/routes/message.routes")
const cart = require("./app/routes/cart.routes")
const buyProduct = require("./app/routes/buyProduct.routes")
const bookmark = require("./app/routes/bookmar.routes")
const app = express();

app.use(express.static("public"));
app.use(bodyParser.json({ limit: "50mb" }));

//cors
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//connectiong with mongodb database
mongoose
  .connect(process.env.mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to food delivery application." });
});

//routes for user registration
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart" , cart)
app.use("/api/buyDetails" , buyProduct)
app.use("/api/bookmark" , bookmark)
app.use("/api" , message)



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}.`);
});
