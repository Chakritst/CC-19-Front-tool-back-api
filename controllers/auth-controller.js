exports.register = (req, res, next) => {
    
    //code
    // Step 1 req.body
    console.log(req.body)
    // Step 2 validate
    // Step 3 Check already
    // Step 4 Encrypt bcrypt
    // Step 5 Insert to DB
    // Step 6 Response

    try {
        res.json({ message: "hello register" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error!!!" })
    }
}

exports.login = (req, res, next) => {
    //code
    try {
        console.log(ddddd);
        
        res.json({ message: "Hello Login" })
    } catch (error) {
        // console.log(error.message);
        // res.status(500).json({ message: "Server Error!!!" })
        next(error);

    }

}