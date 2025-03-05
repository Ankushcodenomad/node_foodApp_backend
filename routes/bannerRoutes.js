const express = require("express");
const {
  createBannerController,
  getAllBannersController,
  getBannerByIdController,
  updateBannerController,
  deleteBannerController,
  upload 
} = require("../controllers/bannerController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createBanner",upload.single("image"),authMiddleware,createBannerController);
router.get("/getAllBanner", authMiddleware, getAllBannersController);
router.get("/getBannerById:id", authMiddleware, getBannerByIdController);
router.put("/updateById:id", authMiddleware, updateBannerController);
router.delete("/deleteBanner:id", authMiddleware, deleteBannerController);
module.exports = router;
