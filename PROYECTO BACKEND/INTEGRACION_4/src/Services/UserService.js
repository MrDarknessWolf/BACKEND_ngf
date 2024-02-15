import UserDAO from "../dao/users.dao.js";

const Users = new UserDAO();

const getUser=(username)=>{
    return Users.getUser(username);
}

const addUser=(user_info)=>{
    return Users.addUser(user_info);
}
const resetPass=(email,pass)=>{
    return Users.resetPass(email,pass);
}

const getbyID=(userID)=>{
    return Users.getbyID(userID)
}
const premuser=(uid,role)=>{
    return Users.premuser(uid,role)
}

export { getUser,getbyID,addUser,premuser,resetPass}