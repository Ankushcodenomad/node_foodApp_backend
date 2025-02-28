const testController = (req,res)=>{
    try{
        console.log("contoller".bgYellow)
        res.status(200).send({
            success:true,
            message:'test user data api!'
        })
    }
    catch(error){
    console.log("🚀 ~ testController ~ error:", error)

    }
}

module.exports = {testController}