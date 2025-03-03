
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const twilio = require('twilio');
const multer = require('multer');
// app.use('/uploads', express.static('uploads'));
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const registerController = async (req, res) => {
  try {
    const { username, email, password, phone, address, answer } = req.body;
    if (!username || !email || !password || !phone || !address || !answer) {
      return res.status(500).send({
        success: false,
        message: "Please Provide all fields",
      });
    }
    const exiting = await userModel.findOne({ email });
    if (exiting) {
      return res.status(500).send({
        success: false,
        message: "Email already registered please login!",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      answer
    });
    res.status(201).send({
      success: true,
      message: "Successfully Registered",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in register api!",
      error,
    });
  }
};
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Email or Password"
      })
    }
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).send({
        message: false,
        message: 'User not Found'
      })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials"
      })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    user.password = undefined
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user
    })
  } catch (error) {
    console.log("error=======login=>", error);
    res.status(500).send({
      success: false,
      message: "Error in Login Api",
      error
    })
  }
}

const sendOtpController = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(404).send({
        success: false,
        message: "Phone number is not found",
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await User.findOneAndUpdate(
      { phone },
      { otp: hashedOtp, isVerified: false },
      { upsert: true, new: true }
    );

    await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log(`OTP for ${phone}: ${otp}`);
    res.status(200).send({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in send otp Api",
      error
    })
  }

}

const verifyOtpController = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(404).send({
        success: false,
        message: "Phone number or OTP not found!"
      })
    }
    const user = await userModel.findOne({ phone });

    if (!user || !user.otp) return res.status(400).send({ success: false, message: 'Invalid OTP' });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).send({ success: false, message: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = null; 
    await user.save();
    res.status(200).send({ success:true,message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in otp verify api!",
      error
    })
  }
}

const createProfileController= async(req,res) =>{
try{
  const { phone, name, email, password } = req.body;
  if(!phone){
    return res.status(404).send({
      success:false,
      message:"Phone no not found!"
    })
  }
  const user = await userModel.findOne({ phone, isVerified: true });

  if (!user) return res.status(400).send({success:false, message: 'Phone number not verified' });

  const hashedPassword = await bcrypt.hash(password, 10);
  user.name = name;
  user.email = email;
  user.password = hashedPassword;
  if (req.file) user.profilePic = `/uploads/${req.file.filename}`;

  await user.save();
  res.status(200).send({success:true, message: 'Profile created successfully', user });
}catch(error){
  res.status(500).send({
    success:false,
    message:"Error in create profile api",
    error
  })
}
}
module.exports = { registerController, loginController, sendOtpController, verifyOtpController,createProfileController };
