
const express = require('express');
const { getUserController, updateUserController, updatePasswordController, resetPasswordController, deleteProfileController } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.get('/getUser',authMiddleware,getUserController)
router.put('/updateUser',authMiddleware,updateUserController)
router.post('/updatePassword',authMiddleware,updatePasswordController)
router.post('/resetPasswrod',authMiddleware,resetPasswordController)
router.delete('/deleteUser/:id',authMiddleware,deleteProfileController)
module.exports = router;
