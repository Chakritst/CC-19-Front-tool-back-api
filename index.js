const express = require("express");
const cors = require("cors")
const morgan = require("morgan")
const handleErrors = require("./middlewares/error")


//Routing
const authRouter = require("./routes/auth-route")

const app = express();

//Middlewares
app.use(cors()); //allow cross domain
app.use(morgan("dev")); //show terminal log
app.use(express.json()) //For read json

//Routing
app.use("/api", authRouter)


//Handle Error
app.use(handleErrors)


//Start Server
const PORT = 8008;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
