const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const bcrypt = require("bcryptjs")

exports.register = async (req, res, next) => {

    try {
        //code
        // Step 1 req.body

        const { email, firstname, lastname, password, confirmPassword } = req.body;

        // console.log(email,firstname,lastname,password,confirmPassword)
        // Step 2 validate

        // if(!email){
        //     return createError(400,"Email is require!!!")
        // }

        // if(!firstname){
        //     return createError(400,"Firstname is required!!!")
        // }

        // if(!lastname){
        //     return res.status(400).json({message:"lastname is required"})

        // }
        // Step 3 Check already
        const checkEmail = await prisma.profile.findFirst({
            where: {
                email: email,
            }


        })
        console.log(checkEmail);
        if (checkEmail) {
            return createError(400, "Email is already exist")
        }

        // Step 4 Encrypt bcrypt
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, 10)
        // console.log(hashedPassword);

        // Step 5 Insert to DB
        const profile = await prisma.profile.create({
            data: {
                email: email,
                firstname: firstname,
                lastname: lastname,
                password: hashedPassword,
            }
        })
        // Step 6 Response

        res.json({ message: "register complete" })
    } catch (error) {
        console.log("Step 2 Catch")
        next(error)
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