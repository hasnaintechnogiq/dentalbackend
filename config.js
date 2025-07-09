const dotenv = require('dotenv');
const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017/konnbot");


dotenv.config({path:'./config.env'});


const DB = process.env.DATABASE;
const PORT = process.env.PORT;

mongoose.connect(DB).then(()=> {
    console.log("connection successful")
}).catch((err)=> console.log(err));