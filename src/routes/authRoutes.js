
const express = require('express');
const multer = require('multer');
const { registerController, loginController, sendOtpController, verifyOtpController, createProfileController } = require('../controllers/authController');
const router = express.Router();
const upload = multer({ storage });
router.post('/register',registerController)
router.post('/login',loginController)
router.post('/send-otp',sendOtpController)
router.post('/verify-Otp',verifyOtpController)
router.post('/create-profile',upload.single('profilePic'),createProfileController)
module.exports = router;
