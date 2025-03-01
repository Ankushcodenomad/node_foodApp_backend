const testController = (req,res)=>{
    try{
        console.log("contoller".bgYellow)
        res.status(200).send({
            success:true,
            message:'test user data api!'
        })
    }
    catch(error){
    console.log("🚀 ~ testController ~ error:", error)

    }
}

module.exports = {testController}

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Twilio Config
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  phone: String,
  otp: String,
  isVerified: Boolean,
  name: String,
  email: String,
});
const User = mongoose.model('User', UserSchema);

// 1. Send OTP
app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();

  await User.findOneAndUpdate(
    { phone },
    { otp, isVerified: false },
    { upsert: true, new: true }
  );

  // Simulate OTP sending (Replace with Twilio in production)
  console.log(`OTP for ${phone}: ${otp}`);
  res.json({ message: 'OTP sent successfully' });
});

// 2. Verify OTP
app.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ phone, otp });

  if (!user) return res.status(400).json({ message: 'Invalid OTP' });

  user.isVerified = true;
  await user.save();
  res.json({ message: 'OTP verified successfully' });
});

// 3. Create Profile
app.post('/create-profile', async (req, res) => {
  const { phone, name, email } = req.body;
  const user = await User.findOne({ phone, isVerified: true });

  if (!user) return res.status(400).json({ message: 'Phone number not verified' });

  user.name = name;
  user.email = email;
  await user.save();
  res.json({ message: 'Profile created successfully', user });
});

app.listen(3000, () => console.log('Server running on port 3000'));
