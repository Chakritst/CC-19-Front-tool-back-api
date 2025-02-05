# Server

## Step 1 create package

```bash

npm init -y
```

## Step 2 install package....

```bash

npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma
````


```bash

npx prisma init

```

## Step 3 Git

```bash

git init
git add .
git commit -m "message"
```

next Step
copy code from repo
only first time

```bash
git remote add origin https://github.com/Chakritst/CC-19-Front-tool-back-api.git
git branch -M main
git push -u origin main
```

## Step 4 update package.json
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start" : "nodemon index.js"
  },
```
and code
```js 
index.js

const express = require("express");
const app = express();


//Start Server
const PORT = 8008;
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));
```

## Step 5 Use middleware

```js
const express = require("express");
const cors = require("cors")
const morgan = require("morgan")
const app = express();

//Middlewares
app.use(cors()); //allow cross domain
app.use(morgan("dev")); //show terminal log
app.use(express.json()) //For read json

//Routing

//Start Server
const PORT = 8008;
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));

```

## Step 6 Routing& Controller [Register]

/controller/auth-controller.js
```js
exports.register = (req,res,next)=>{
    //code
    try{
        res.json({message:"hello register"})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Server Error!!!"})
    }
}
```
/routes/auth-route.js
```js
const express = require("express");
const router = express.Router()
const authControllers = require("../controllers/auth-controller")

//@Endpoint http://localhost:8000/api/register
router.post('/register',authControllers.register);



// export
module.exports = router
```
## Step 7 Create handle Error
/middlewares/error.js

```js
const handleErrors = (err,req,res,next) =>{
    //code
    res
     .status( err.statusCode||500)
     .json({message: err.message ||"Something wrong!!"})
}


module.exports = handleErrors

```
and use in index.js

```js
const handleErrors = require("./middlewares/error")
app.use(handleErrors)

```

and change in try catch

```js
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

```
when update code in Github
```bash
git add .
git commit -m "message"
git push
```

## Step 8 Validate with Zod
/midlewares/validators.js

```js
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

```
and update code
/route/auth-route.js

```js
const express = require("express");
const router = express.Router()
const authControllers = require("../controllers/auth-controller");
const { validateWithZod, registerSchema, loginSchema } = require("../middlewares/validators");



//@Endpoint http://localhost:8000/api/register
router.post('/register', validateWithZod(registerSchema), authControllers.register);
router.post("/login", validateWithZod(loginSchema), authControllers.login);



// export
module.exports = router

```

## Step 9 Prisma
```bash
npx prisma db push
#Or
npx prisma migrate dev --name init
```

### config prisma
/configs/prisma.js
```js
const{PrismaClient} =require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma;
```

update code
Register
/controller/auth-controller.js

```js
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
```

## Step 10 Login
/controllers/auth-controller.js
```js

exports.login = async (req, res, next) => {
    //code
    try {
        // Step 1 req.body
        console.log(req.body);
        const { email, password } = req.body

        // Step 2 check email and password
        const profile = await prisma.profile.findFirst({
            where: {
                email: email,
            }
        })
        if (!profile) {
            return createError(400, "Email, Password is invalid!!")
        }
        const isMatch = bcrypt.compareSync(password, profile.password)

        if (!isMatch) {
            return createError(400, "Email, Password is invalid!!")
        }


        // Step 3 Generate token
        const payload = {
            id: profile.id,
            email: profile.email,
            firstname: profile.firstname,
            lastname: profile.lastname,
            role: profile.role,
        }
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: "1d"
        })
        console.log(token)
        // Step 4 Response

        res.json({
            message: "Login Success!!!",
            payload: payload,
            token: token,
        })
    } catch (error) {
        // console.log(error.message);
        // res.status(500).json({ message: "Server Error!!!" })
        next(error);

    }

}

```