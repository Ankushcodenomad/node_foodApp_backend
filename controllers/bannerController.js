const bannerModel = require('../models/bannerModel');

const createBannerController = async (req, res) => {
	try {
		const { imageUrl, isActive } = req.body;
		if(!imageUrl){
			res.status(404).send({
				success:false,
				message:"Image not found!"
			})
		}
		const banner = new bannerModel({ imageUrl, isActive });
		await banner.save();
		res.status(201).send({ success: true, message: "Banner created successfully", banner });
	} catch (error) {
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
		const banner = await bannerModel.findByIdAndDelete(req.params.id);
		if (!banner) {
			return res.status(404).send({ success: false, message: "Banner not found" });
		}
		res.status(200).send({ success: true, message: "Banner deleted successfully" });
	} catch (error) {
		res.status(500).send({ success: false, message: "Server error", error: error.message });
	}
};
module.exports = { createBannerController,getAllBannersController,getBannerByIdController,updateBannerController,deleteBannerController }