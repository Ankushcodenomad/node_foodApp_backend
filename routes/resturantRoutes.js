const express = require('express');
const { createResturantController, getAllResturantController, getAllByIDController, deleteResturantController } = require('../controllers/resturantController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/createResturant',authMiddleware,createResturantController);
router.get('/getAll',authMiddleware,getAllResturantController);
router.get('/getAllById/:id',authMiddleware,getAllByIDController);
router.delete('/deleteResturant/:id',authMiddleware,deleteResturantController)
module.exports = router;