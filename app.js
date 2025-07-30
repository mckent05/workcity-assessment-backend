require("dotenv").config()
require('express-async-errors');

const express = require("express")
const connectDB = require("./config/db")
const authRouter = require("./routes/auth")
const cors = require('cors');
const errorHandlerMiddleware = require("./middleWare/errorHandler")
const authenticationHandler = require("./middleWare/authenticationHandler")
const clientRoutes = require("./routes/clients")
const projectRoutes = require("./routes/projects")
const notFound = require("./middleWare/notFound")
const app = express()
let connectionString = process.env.MONGO_URI
connectionString = connectionString.replace("<password>", encodeURIComponent(process.env.password))

const PORT = 3000


app.use(cors());
app.use(express.json())
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/clients", authenticationHandler, clientRoutes)
app.use("/api/v1/projects", authenticationHandler, projectRoutes)
app.use(errorHandlerMiddleware)
app.use(notFound)



const start = async () => {
    try {
        await connectDB(connectionString)
        app.listen(PORT, () => {
            console.log(`Server is runnning on ${PORT}...`)
        })
    }
    catch(err) {
        console.log(err)
    }
}

start()