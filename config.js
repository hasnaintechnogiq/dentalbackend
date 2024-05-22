const dotenv = require('dotenv');
const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017/konnbot");


dotenv.config({path:'./config.env'});


const DB = process.env.DATABASE;
const PORT = process.env.PORT;

mongoose.connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
    // useFindAndModify: false
}).then(()=> {
    console.log("connection sucsessfull")
}).catch((err)=> console.log(err));