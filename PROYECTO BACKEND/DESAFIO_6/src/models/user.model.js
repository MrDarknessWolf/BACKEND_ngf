import mongoose from "mongoose";

const userCollection ="user";
const {Schema,model } =mongoose;

const userSchema = new Schema ({
    name:String,
    email:String,
    password: String,
    role:{type:String, default:"user"}
})

const userModel = model(userCollection,userSchema)

export default userModel;