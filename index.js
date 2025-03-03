console.log("hello")
require("dotenv").config()
const express = require("express");
const bodyParser = require('body-parser');
var mongo = require('mongodb');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require("./config/db");

connectDb();
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
app.use('/uploads', express.static('uploads'));
app.use("/api/v1/auth",require("./routes/authRoutes"))
app.use("/api/v1/user",require("./routes/userRoutes"))
app.use("/api/v1/resturant",require("./routes/resturantRoutes"));
app.get("/",(req,res)=>{
  return res.status(200).send("<h1>Welcome in nodejs</h1>")
})

console.log("checking the env",process.env.PORT)


const PORT = process.env.PORT ;
app.listen(PORT,()=>{
console.log('listening on port 3002!'.bgRed,PORT)
})