const handleErrors = (err,req,res,next) =>{
    //code
    res
     .status( err.statusCode||500)
     .json({message: err.message ||"Something wrong!!"})
}


module.exports = handleErrors