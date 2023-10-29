require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const adviser = require("./src/routes/adviser");
const user = require("./src/routes/user");
const semester = require("./src/routes/semester");
const track = require("./src/routes/track");
const student = require("./src/routes/student");
const barangay = require("./src/routes/barangay");
const attendance = require("./src/routes/attendance");
const report = require("./src/routes/report");
const subject_teacher = require("./src/routes/subject_teacher");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers, *, Access-Control-Allow-Origin",
    "Origin, X-Requested-with, Content_Type,Accept,Authorization",
    "https://realtimeattendance.vercel.app"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
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
app.use(student);
app.use(barangay);
app.use(attendance);
app.use(report);
app.use(subject_teacher);
