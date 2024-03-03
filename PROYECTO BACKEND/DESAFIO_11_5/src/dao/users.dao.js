import userModel from "./models/user.model.js";
import UserDTO from "./DTOs/user.dto.js";
class UserDAO{
    constructor() {}
    async getUser(username){
        try{
            return await userModel.findOne({ email: username });
        }
        catch(error){
            throw error;
        }
    }
    async getbyID(user_id){
        try{
            return await userModel.findById(user_id)
        }catch(error){
            throw error
        }
    }

    async addUser(newUser){
        try{
            const newuserInfo=new UserDTO(newUser)
            return await userModel.create(newuserInfo);
        }catch(error){
            throw error
        }
    }
    async resetPass(email,pass){
      
    return await userModel.updateOne({ email }, { password: pass });
    }
    async premuser(uid,role){
        return await userModel.updateOne({"_id":uid},{"role":role})
    }
}

export default UserDAO;