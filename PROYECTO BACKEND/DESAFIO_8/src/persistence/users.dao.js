import userModel from "../models/user.model.js";
import { isValidPassword } from "../utils.js";

const getUser= async(username)=>{
    return await userModel.findOne({ email: username });
}

const addUser = async(newUser) =>{

    return await userModel.create(newUser);
}

const resetPass = async(email,pass) =>{
    console.log("resseting")
    return await userModel.updateOne({ email }, { password: pass });
}

export{getUser,addUser, resetPass}