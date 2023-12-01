import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://darkness:darkness@darkness.aqwkhfa.mongodb.net/Crossing-Ecomerce?retryWrites=true&w=majority")


const db = mongoose.connection

db.on('error',console.error.bind(console,"Error conecting to the databse:"));
db.once('open',()=>{
    console.log("Successfully connected :D")
})

export{mongoose,db}