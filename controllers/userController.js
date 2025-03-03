const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const getUserController =async(req,res)=>{
 try{
     const user = await userModel.findById({_id:req.body.id});
     if(!user){
        return res.status(404).send({
            success:false,
            message:"User Not Found"
        })
     }

     user.password = undefined;
     res.status(200).send({
        success:true,
        message:"User get Successfully",
        user
     })
 }catch(err){
    res.status(500).send({
        success:false,
        message:'Error in get User Api',
        error
    })
 }
}

const updateUserController = async(req,res)=>{
   try{
     const user = await userModel.findById({_id:req.body.id});
     if(!user){
        return res.status(404).send({
            success:false,
            message:"User not found"
        })
     }
     const {username,phone,address} = req.body
     console.log("🚀 ~ updateUserController ~ username:", username)
     
     if(username) user.username = username;
     if(phone) user.phone = phone;
     if(address) user.address = address;
     await user.save();
     res.status(200).send({
        success:true,
        message:"User Updated Successfully"
     })
   }catch(error){
     res.status(500).send({
        success:false,
        message:"Error in update user api",
        error
     })
   }
}

const updatePasswordController = async(req,res)=>{
    try{

         const user = await userModel.findById({_id:req.body.id});
         if(!user){
            return res.status(404).send({
                success:false,
                message:"User not found!"
            })
         }
        const {oldPassword,newPassword} = req.body;
        if(!oldPassword || !newPassword){
         return res.status(500).send({
              success:false,
              message:"Please provide old and new password"
         })
        }
         const isMatch = await bcrypt.compare(oldPassword,user.password)
              if(!isMatch){
                return res.status(500).send({
                  success:false,
                  message:"Invalid Old Password"
                })
              }
              var salt = bcrypt.genSaltSync(10);
              const hashedPassword = await bcrypt.hash(newPassword,salt)
              user.password = hashedPassword;
              await user.save();

              res.status(200).send({
                success:true,
                message:"Password Updated!"
              })
        res.status(200).send({
            success:true,
            message:"Update password successfully!"
        })
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Error in Update password api"
        })
    }
}

const resetPasswordController = async(req,res)=>{
    try{
        const {email,newPassword,answer} = req.body;
        console.log("🚀 ~ resetPasswordController ~ email:", newPassword)
        if(!email || !newPassword || !answer){
            
                res.status(500).send({
                    success:false,
                    message:"Please Provide All Fields"
                })
        }

        const user = await userModel.findOne({email,answer});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"User not found or invlaid answer"
            })
        }

        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword,salt)
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success:true,
            message:"reset password successfully!"
        })
    }catch(error){
        console.log("🚀 ~ resetPasswordController ~ error:", error)
        res.status(500).send({
            success:false,
            message:"Error in reset password api"
        })
    }
}

const deleteProfileController = async(req,res)=>{
    try{
     await userModel.findByIdAndDelete(req.params.id);
     return res.status(200).send({
        success:true,
        message:"Your account has been deleted!"
     })
    }catch(error){
        console.log("🚀 ~ deleteProfileController ~ error:", error)
        
      res.status(500).send({
        success:false,
        message:"error in delete profile api",
        error
      })
    }
}
module.exports = {getUserController,updateUserController,updatePasswordController,resetPasswordController,deleteProfileController};