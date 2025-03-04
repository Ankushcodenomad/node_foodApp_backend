const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
    },
   isActive:{
	type:Boolean
   }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
