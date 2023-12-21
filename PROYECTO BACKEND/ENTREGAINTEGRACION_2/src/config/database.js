import mongoose from 'mongoose';
import "dotenv/config.js";

mongoose.connect(process.env.mongo,{})


const db = mongoose.connection

db.on('error',console.error.bind(console,"Error conecting to the databse:"));
db.once('open',()=>{
    console.log("Successfully connected :D")
})

export{mongoose,db}