import * as usersDao from "../persistence/users.dao.js"
const getUser=(username)=>{
    return usersDao.getUser(username);
}


const addUser=(newUser)=>{
    return usersDao.addUser(newUser);
}


const resetPass=(email,password) =>{
    return usersDao.resetPass(email,password)
}
export {getUser,addUser,resetPass}