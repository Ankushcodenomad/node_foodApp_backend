
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const registerController = async (req, res) => {
  try {
    const { username, email, password, phone, address,answer } = req.body;
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
    const hashedPassword = await bcrypt.hash(password,salt)
    const user = await userModel.create({
      username,
      email,
      password:hashedPassword,
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
const loginController = async(req,res)=>{
    try{
      const {email ,password} = req.body;
      if(!email || !password){
            return res.status(500).send({
                success:false,
                message:"Please Provide Email or Password"
            })
      }
      const user = await userModel.findOne({email})
      if(!user){
        return res.status(404).send({
            message:false,
            message:'User not Found'
        })
      }
      const isMatch = await bcrypt.compare(password,user.password)
      if(!isMatch){
        return res.status(500).send({
          success:false,
          message:"Invalid Credentials"
        })
      }
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:'7d'
      })
      user.password = undefined
      res.status(200).send({
        success:true,
        message:"Login Successfully",
        token,
        user
      })
    }catch(error){
        console.log("error=======login=>",error);
        res.status(500).send({
            success:false,
            message:"Error in Login Api",
            error
        })
    }
}
module.exports = { registerController,loginController };
