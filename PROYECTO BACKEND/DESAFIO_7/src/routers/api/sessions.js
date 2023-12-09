//////////////////////////////////////controllers

import {
    logOut,
    loginUser,
    registerUser,
    recoveryPassword
}from "../../controller/auth.controllers.js"
import passport from "passport";

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
        const cart =new Cart({username:user.name}); //para despues de la revision de sgunda entrega
        const newCart = await cart.save(); 
        res.redirect("/profile")}
    catch(error){
            console.log("error creating cart",error)
        }
  }
);

//router.post("/login",loginUser);
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
        res.redirect("/profile")
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