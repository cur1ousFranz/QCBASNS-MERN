require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const adviser = require("./src/routes/adviser");
const user = require("./src/routes/user");
const semester = require("./src/routes/semester");
const track = require("./src/routes/track");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  next()
})
app.use(cors({ origin: "*" }));
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening to port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Something went wrong: ${error}`);
  });

// Routes
app.use(adviser);
app.use(user);
app.use(semester);
app.use(track);
