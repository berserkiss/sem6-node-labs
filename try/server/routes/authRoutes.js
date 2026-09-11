const express = require("express");
const { signup, login, generateOtp } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/generate-otp", generateOtp);

module.exports = router;