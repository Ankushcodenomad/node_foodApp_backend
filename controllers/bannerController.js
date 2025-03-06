const bannerModel = require('../models/bannerModel');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: "./uploads/", // Save images in the 'uploads' folder
	filename: (req, file, cb) => {
	  cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
	},
  });
  const upload = multer({ storage });
const createBannerController = async (req, res) => {	
	try {
		   console.log("#########################")
			if (!req.file) {
			  return res.status(400).send({ success: false, message: "No image uploaded!" });
			}
		
			const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
		
			const newBanner = new bannerModel({ imageUrl, isActive: true });
			await newBanner.save();
		
			res.status(201).send({ success: true, message: "Banner uploaded successfully", banner: newBanner });
		
	} catch (error) {
		console.log("🚀 ~ createBannerController ~ error:", error)
		
		res.status(500).send({ success: false, message: "Server error", error: error.message });

	}
};

// Get all banners
const getAllBannersController = async (req, res) => {
	try {
		const banners = await bannerModel.find();
		res.status(200).send({ success: true,message:"get all banners", banners });
	} catch (error) {
		res.status(500).send({ success: false, message: "Server error", error: error.message });
	}
};

// Get a single banner by ID
const getBannerByIdController = async (req, res) => {
	try {
		const banner = await bannerModel.findById(req.params.id);
		if (!banner) {
			return res.status(404).send({ success: false, message: "Banner not found" });
		}
		res.status(200).send({ success: true, banner });
	} catch (error) {
		res.status(500).send({ success: false, message: "Server error", error: error.message });
	}
};

// Update a banner
const updateBannerController = async (req, res) => {
	try {
		const { imageUrl, isActive } = req.body;
		const banner = await bannerModel.findByIdAndUpdate(req.params.id, { imageUrl, isActive }, { new: true });
		if (!banner) {
			return res.status(404).send({ success: false, message: "Banner not found" });
		}
		res.status(200).send({ success: true, message: "Banner updated successfully", banner });
	} catch (error) {
		res.status(500).send({ success: false, message: "Server error", error: error.message });
	}
};

// Delete a banner
const deleteBannerController = async (req, res) => {
	try {
		console.log("req.params.id",req.params.id)
		const banner = await bannerModel.findByIdAndDelete(req.params.id);
		if (!banner) {
			return res.status(404).send({ success: false, message: "Banner not found" });
		}
		res.status(200).send({ success: true, message: "Banner deleted successfully" });
	} catch (error) {
		console.log("🚀 ~ deleteBannerController ~ error:", error)
		res.status(500).send({ success: false, message: "Server error", error: error.message });
	}
};
module.exports = { createBannerController,getAllBannersController,getBannerByIdController,updateBannerController,deleteBannerController,upload }