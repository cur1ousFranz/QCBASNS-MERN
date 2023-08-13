const express = require("express");
const { login } = require("../controllers/UserController");
const router = express.Router();

router.post("/api/v1/user", login);

module.exports = router;
