//////////////////////////////////////controllers
import {
    logOut,
    loginUser,
    registerUser,
    recoveryPassword
}from "../../controller/auth.controllers.js"
import passport from "passport";
import {  authToken,
  authorization,
  generateToken,
  passportCall, } from "../../utils.js";

import express from "express"

import io from "../../app.js"
import Cart from '../../models/carts.model.js';

const router =express.Router();

//router.post("/register",registerUser);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  async (req, res) => {
    
    let user = req.user;
    user.password=undefined
    try{

        res.redirect("/login")}
    catch(error){
            console.log("error creating cart",error)
        }
  }
);


//router.post("/login",loginUser);
/*
router.get("/current", (req, res) => {
  let data = {
    layout: "profile",
    user: req.session.user,
  };
  console.log("Current user",req.session.user)
  io.emit("current_user",req.session.user);
  res.render("index", data);
});
*/
router.get("/current",passportCall("jwt"),authorization("user"),(req, res)=>{
  res.send({ status: "success", payload: req.user });
})
/////////////////////////////////

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    let user = req.user;
    if (!user)
      return res
        .status(400)
        .send({ status: "Error", error: "Inalid Credentials" });
        user.password=undefined;
        req.session.user=user;
        req.session.admin=false;

        io.emit("current_user",req.session.user);
        io.emit("log_success")
        /////sessions maneja mas faicl que con tokens...
        let token = generateToken(user)
        res.cookie("access_token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      //console.log(req.cookies["access_token"])
          ///
        res.redirect("/api/sessions/current")
  }
);
router.post("/logout",logOut)
router.post("/recovery", recoveryPassword);
///////////////metodos del github
router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
  );
router.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
      req.session.user = req.user;
      res.redirect("/profile");
    }
  );
  


export default router