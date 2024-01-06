//////////////////////////////////////controllers
import {
    logOutUser,
    logUser,
    registerUser,
    recoveryPassword,
    currentUser
}from "../../controller/userController.js"
import {  authToken,
  authorization,
  generateToken,
  passportCall, } from "../../utils.js";

import express from "express"

import io from "../../app.js"


const router =express.Router();
router.post("/register",registerUser);

router.get("/current",passportCall("jwt"),authorization("user"),(req, res)=>{
    currentUser
})
/////////////////////////////////

router.post("/login",logUser);
router.post("/logout",logOutUser)
router.post("/recovery", recoveryPassword);

export default router