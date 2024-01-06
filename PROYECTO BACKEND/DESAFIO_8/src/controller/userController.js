//usuario de prueba dummy@gmail.com
//pass: dummy3


const showProfile = (req, res) => {
    let user = {
      layout: "profile",
      name: req.session.name,
      email: req.session.email,
    };
    
    console.log(user);
    res.render("index", { user });
  };
  
 
////////////////////////////////

import * as userServices from "../services/users.service.js"
import * as cartServices from "../services/carts.service.js"
import "dotenv/config.js";
import { createHash, isValidPassword } from "../utils.js";
import io from "../app.js"



const registerUser = async (req,res)  => {
  try {
    const { name,last_name, email,age,password } = req.body;

    let user = await userServices.getUser(email);
    //console.log(user)
    if (!name || !email || !password){
      return res.status(401)
      .send({ status: "Error", error: "Incomplete values" });
  }
    if (user) {
      console.log("Usuario ya existe, intente otro email o inicie sesion");
      res.redirect("/register")
    }else{
     ////////////////////////////////////////////
    const today = new Date();
    const birthYear = parseInt(age.substring(0, 4));
    const currentYear = today.getFullYear();
    const current_age = currentYear - birthYear;
    if(current_age< 18){
      console.log("user underage")
      res.redirect("/login")
    }
    //////////////////////////////////////////////
    //console.log("attempting savingcart")
     //para despues de la revision de sgunda entrega
    const newCart = await cartServices.createCart(name)
    const newUser = {
      name,
      last_name,
      email,
      age:current_age,
      password: createHash(password),
      cart_id:newCart._id
    };
    console.log("saving",newUser)
    let result = await userServices.addUser(newUser)
    //console.log("what happened",result)
    res.redirect("/login")}
  } catch (error) {
    console.log("Error creating"+error)
    res.redirect("/login")
  }

}

const logUser = async (req,res) =>{
    
  try {
    const { email,password} =req.body;
    //console.log(email)
    if(email === process.env.ADMIN_EMAIL & password ===process.env.ADMIN_PASSWORD){
      req.session.user={name:"ADM1NC0DR",
                        email:process.env.ADMIN_EMAIL,
                        role:"ADMIN"};
      req.session.admin =true
      let user = req.session.user;
      res.redirect("/api/products/")
    }else{
      
      let user = await userServices.getUser(email);
      if (!user){
        console.log("User or password incorrect");
        //await io.emit("somethig_wrong") //para despues
        return res.redirect("/")
        //res.status(501).json({error:"User or password incorrect"})
        }
    else if (!isValidPassword(user, password)){
        return res.status(401).send({
          status: "Error",
          error: "Usuario y/o contraseña incorrecta 2",
        });}
    else{
        console.log("User id found connecting")
        user.password=undefined;
        user.role="User"
        console.log(user)
        req.session.user=user;
        req.session.admin=false; 
    
        io.emit("current_user",req.session.user);
        io.emit("log_success")
        res.redirect("/api/products/")
    }
  }
  } catch (error) {
    console.log(error)
    return res.redirect("/");
  }
}

const logOutUser =async (req,res) =>{
  try{
      if(req.session.user){
          delete req.session.user;
          req.session.destroy((error)=>{
          if (error){
              console.log("error clossing current session",error);
              res.status(500).send("Error clossing session",error)
          }else{
              console.log("see you soon")
              res.redirect("/")
          }
      })}
    
  }catch (error){
      console.log("just error at all")
      console.log("Error clossing session",error);
      res.status(500).send("Error clossing session")
  }
}


const recoveryPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    /////////change for a fuction in users
    //console.log("new pass",createHash(password))
    userServices.resetPass(email,createHash(password))
    res.redirect("/");
  } catch (error) {
    console.error("Error al recuperar contraseña", error);
    res.status(500).send("Error al cerrar la sesión");
  }
};

const currentUser = async (req,res) =>{
  let user_data=req.user.user
  //res.send({ status: "success", payload: req.user });
  let data = {
    layout: "profile",
    user: user_data,
  };
  console.log("Current user",user_data)
  io.emit("current_user",user_data);
  res.render("index", data);
}

export { showProfile ,currentUser,logOutUser,logUser,registerUser,recoveryPassword};