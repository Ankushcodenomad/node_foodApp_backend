const resturantModel = require("../models/resturantModel")

const createResturantController = async(req,res)=>{
try{
    const {
        title,
        imageUrl,
        foods,
        time,
        pickup,
        delivery,
        isOpen,
        logoUrl,
        rating,
        ratingCount,
        code,
        coords} = req.body
        if(!title || !coords){
            return res.status(500).send({
                success:false,
                message:"Please provide title and address"
            })
        }
        const newResturant = await resturantModel({
            title,
            imageUrl,
            foods,
            time,
            pickup,
            delivery,
            isOpen,
            logoUrl,
            rating,
            ratingCount,
            code,
            coords});
            await newResturant.save();
            res.status(201).send({
                success:true,
                message:"New Resturant Created successfully"
            })
}catch(error){
  console.log("error in resturant api",error)
  res.status(500).send({
    success:false,
    message:"error in resturant create api",
    error
  })
}
}
const getAllResturantController = async(req,res)=>{
    try{
        const resturant = await resturantModel.find({});
        if(!resturant){
            return res.status(404).send({
                success:false,
                message:'No Resturant Availible'
            })
        }
        res.status(200).send({
            success:true,
            totalCount:resturant.length,
            resturant
        })
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Error in get all resturant api",
            error
        })
    }
}

const getAllByIDController = async(req,res)=>{
    try{
        const resturantID = req.params.id;
            if(!resturantID){
                return res.status(404).send({
                    success:false,
                    message:"resturant id not found"
                })
            }

      const resturant = await resturantModel.findById(resturantID);
      if(!resturant){
        return res.status(404).send({
            success:false,
            message:"Resturant not found!",
        })
      }
      res.status(200).send({
        success:true,
        resturant
      })
    }catch(error){
        res.status(500).send({
            success:false,
            message:"error in get all resturant by ID api",
            error
        })
    }
}

const deleteResturantController = async(req,res)=>{
  try{
     const resturantID = req.params.id;
     if(!resturantID){
        return res.status(404).send({
            success:false,
            message:"No Resturant Id found!"
        })
     }
     await resturantModel.findByIdAndDelete(resturantID);
     res.status(200).send({
        success:true,
        message:'Resturant Deleted successfully'
     })
  }catch(error){
    res.status(500).send({
        success:false,
        message:"Error In delete resturant api!",
        error
    })
  }
}
module.exports = {createResturantController,getAllResturantController,getAllByIDController,deleteResturantController}