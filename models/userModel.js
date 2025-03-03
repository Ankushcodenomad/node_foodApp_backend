const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true, 'user name is required!']
    },
    email:{
        type:String,
        required:[true, 'email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    phone:{
        type:String,
        required:[true, 'phone number is required']
    },
    usertype:{
        type:String,
        required:[true, 'user type is required'],
        default:'client',
        enum:['client', 'admin', 'vendor', 'driver']
    },
    profile:{
        type:String,
        default:'https://e7.pngegg.com/pngimages/831/88/png-clipart-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design.png'
    }
},{timestamps:true});

module.exports = mongoose.models.User || mongoose.model('User',userSchema)