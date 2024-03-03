import {Router} from "express";
//import UserDAO from "../dao/users.dao.js";
//import CartsDAO from "../dao/carts.dao.js";
import * as Users from "../Services/UserService.js"
import * as Cart from "../Services/CartService.js"
import * as recovery from "../Services/RecoveryService.js"

/////////////////////////errors
import CustomError from "../utils/Custom.error.js";
import * as InfoError from "../utils/info.error.js"
import EnumError from "../utils/enum.error.js";
//////////////////////////
import "dotenv/config.js";
import { createHash, isValidPassword } from "../utils.js";
import io from "../app.js"
//////////////////
import {  authToken,
    authorization,
    generateToken,
    passportCall, } from "../utils.js";

/////////////////

//const Users = new UserDAO();
//const Cart = new CartsDAO();
const UserRouter = Router();
/////////////// register 
UserRouter.post("/register",async (req,res)  => {
  const { name,last_name, email,age,password } = req.body;
    try {
      //console.log(user)
      if (!name || !email || !password){
        
      CustomError.createError({
        name:"User creation error",
        cause:InfoError.generateUserRegErrorInfo({name,last_name,email,age}),
        message:"Error creating the user",
        code:EnumError.USER_ERROR
      });
      res.redirect("/register");
      return;
    }
    let user = await Users.getUser(email);
      if (user) {
        CustomError.createError({
          name:"User creation error",
          cause:"User already exist in database",
          message:"Error creating the user",
          code:EnumError.USER_ERROR
        });       
        //console.log("pingpong") 
        //res.redirect("/register")
        return res.status(500).json({message:"Error, user already registered"});
      }else{
       ////////////////////////////////////////////
      const today = new Date();
      const birthYear = parseInt(age.substring(0, 4));
      const currentYear = today.getFullYear();
      const current_age = currentYear - birthYear;
      if(current_age< 18){
        CustomError.createError({
          name:"User creation error",
          cause:InfoError.generateUserAgeErrorInfo(),
          message:"Error creating the user",
          code:EnumError.USER_ERROR
        });
        //res.redirect("/login");
        //return;

        return res.status(501).json({message:"User must be over 18yrs",age:current_age})
      }
      //////////////////////////////////////////////
      //console.log("attempting savingcart")
       //para despues de la revision de sgunda entrega
      const newCart = await Cart.addCart(name)
      const newUser = {
        name,
        last_name,
        email,
        age:current_age,
        password: createHash(password),
        cart_id:newCart._id
      };
      //console.log("saving",newUser)
      let result = await Users.addUser(newUser)
      req.logger.debug("Success Creating user")
      res.redirect("/login")}
    } catch (error) {
      req.logger.error(error)
      res.redirect("/register")
    }
});

UserRouter.get("/current", async (req,res) =>{
      if(req.session.user===undefined){
        CustomError.createError({
          name:"User Session error",
          cause:InfoError.generateUserSesErrorInfo(),
          message:"Session has closed",
          code:EnumError.ROUTING_ERROR
        });        
        res.redirect("/")
        return;
    }
    
    let user_data=req.user.user
    //res.send({ status: "success", payload: req.user });
    let data = {
      layout: "profile",
      user: user_data,
    };
    req.logger.debug("Current user",user_data)
    io.emit("current_user",user_data);
    res.render("index", data);
  })

//////////////////7on this controller change to premium using post

UserRouter.get("/premium/:uid",(req,res)=>{
  try{
  if(req.session.user===undefined){
    CustomError.createError({
      name:"User Session error",
      cause:InfoError.generateUserSesErrorInfo(),
      message:"Session has closed",
      code:EnumError.ROUTING_ERROR
    });        
    res.redirect("/")
    return;
}


  let user_data=req.session.user
  let premium=req.session.user.role==="premium"
  //res.send({ status: "success", payload: req.user });
    let data = {
      layout: "premium",
      user: user_data,
      premium:premium,
    };
    res.render("index",data);}
    catch(error){
      console.log(error);
      return
    }
})

UserRouter.post("/premium/:uid",async (req,res)=>{
  let uid= req.params.uid;
  let current_role=req.session.user.role

  if(current_role==="premium"){
    await Users.premuser(uid,"user");
    req.session.user.role="User"
    return res.redirect(`/api/users/premium/${uid}`)
  }else{
    await Users.premuser(uid,"premium");
    req.session.user.role="premium"
    return res.redirect(`/api/users/premium/${uid}`) 
  }
})
//////////////////////log in - out//////////
UserRouter.post("/login",async (req,res) =>{
    
    try {
      const { email,password} =req.body;
      //console.log(req.body)
      if(email === process.env.ADMIN_EMAIL & password ===process.env.ADMIN_PASSWORD){
        req.session.user={name:"ADM1NC0DR",
                          email:process.env.ADMIN_EMAIL,
                          role:"ADMIN"};
        req.session.admin =true
        //console.log(req.session.admin)
        let user = req.session.user;
        io.emit("current_user",req.session.user);
        io.emit("log_success")
        //console.log("pong")
        res.redirect("/profile")
      }else{
        
        let user = await Users.getUser(email);
        if (!user){
          console.log("User or password incorrect");
          //await io.emit("somethig_wrong") //para despues
          CustomError.createError({
            name:"User Log Error",
            cause:InfoError.generateUserLogError(),
            message:"Error while logging in",
            code:EnumError.USER_ERROR
          });
          return res.redirect("/login")
          //return res.status(501).json({message:"User or password incorrect"});
          }
      else if (!isValidPassword(user, password)){
        CustomError.createError({
          name:"User Log Error",
          cause:InfoError.generateUserLogError(),
          message:"Error while logging in",
          code:EnumError.USER_ERROR
        });
        //return res.redirect("/login")
        return res.status(501).json({message:"User or password incorrect"});
        }
      else{
          req.logger.info("User id found connecting")
          user.password=undefined;
          if(user.role==="premium"){
            user.role="premium"
          }else{
          user.role="User"}
          //console.log("User is:",user)
          req.session.user=user;
          req.session.admin=false; 
          //console.log("why",req.session.user)
          io.emit("current_user",req.session.user);
          io.emit("log_success")
          res.redirect("/profile")
      }
    }
    } catch (error) {
      req.logger.error(error)
      return res.redirect("/");
    }
  } )

  UserRouter.post("/logout", async (req,res) =>{
    try{
        if(req.session.user){
            delete req.session.user;
            req.session.destroy((error)=>{
            if (error){
                req.logger.fatal("error clossing current session",error);
                res.status(500).send("Error clossing session",error)
            }else{
                req.logger.info("Session has been closed")
                res.redirect("/")
            }
        })}
      
    }catch (error){
        req.logger.fatal("Error clossing session",error);
        res.status(500).send("Error clossing session")
    }
  }
  )
  ///////////////////////reset password
  UserRouter.post("/restore/:cid",async(req,res)=>{
    let user = await Users.getbyID(req.params.cid);
    let pass =req.body.password_two
    let email=user.email;
    console.log(email)
    ////////////////////////////////////
    if(isValidPassword(user, pass)){
      io.emit("duplexpass")
      req.logger.warn("the password is an old one")
      return res.redirect(`/recovery/${req.params.cid}`)
    }else{
      let result =await Users.resetPass(email,createHash(pass))
      //console.log(result)
      let delete_token =await recovery.deleteToken(req.params.cid)
      req.logger.info("recovery logger destroyed")
      return res.redirect("/");
    }

  })
  ////////////////////request reset token
  UserRouter.post("/resetreq",async (req, res) => {
    try {
      const { email } = req.body;
  

      let user = await Users.getUser(email);
      //console.log(!user)
        if (!user){
          CustomError.createError({
            name:"Usererror",
            cause:InfoError.generateUserLogError(),
            message:"Error user was not found",
            code:EnumError.USER_ERROR
          });
          return res.redirect("/")
          }
          else{
            //console.log(user)
            //console.log("user found",token)
            return res.redirect(`/api/ticket/pass_token/${user.email}&${user._id}`);
          }

      /////////////////////////////////////////////
      
    } catch (error) {
      CustomError.createError({
          name:"User Log Error",
          cause:InfoError.generateUserLogError(),
          message:"User not found",
          code:EnumError.USER_ERROR
        });
      }
      return res.redirect("/");
    
  });

  export default UserRouter;
