const { z } = require("zod");

//npm i zod
// TEST validator
exports.registerSchema = z.object({
    email: z.string().email("Wrong Email "),
    firstname: z.string().min(3, "Firstname must be longer than 3 letters"),
    lastname: z.string().min(3, "Lastname must be longer than 3 letters"),
    password: z.string().min(6, "Password must be longer than 6 letters"),
    confirmPassword: z.string().min(6, "confirmPassword must be longer than 6 letters")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password is not match",
    path: ["confirmPassword"]
})


exports.loginSchema = z.object({
    email: z.string().email("Wrong Email "),
    password: z.string().min(6, "Password must be longer than 6 letters"),
})


exports.validateWithZod = (schema) => (req, res, next) => {
    try {
        console.log("Hello Middleware");
        schema.parse(req.body)
        next();
    } catch (error) {
        const errMsg = error.errors.map((item) => item.message)
        const errTxt = errMsg.join(",")
        const mergeError = new Error(errTxt)
        next(mergeError)
    }
}
