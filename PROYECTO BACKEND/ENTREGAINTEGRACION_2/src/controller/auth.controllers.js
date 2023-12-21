//usuario de prueba dummy@gmail.com
//pass: dummy3

import userModel from "../models/user.model.js";
import io from "../app.js"
import Cart from '../models/carts.model.js'; ///cada usario ligado a un carrito

import { createHash, isValidPassword } from "../utils.js";

/////////////////////registro de usuario////////// y creacion de carrito
export const registerUser =async (req,res) =>{

    try{
        const {name ,email,password} =req.body
        
        if (!name || !email || !password){
            return res.status(401)
            .send({ status: "Error", error: "Incomplete values" });
        }
        const user = new userModel({ name, email, password: createHash(password) });
        await user.save();
        user.password=undefined
        try{
        const cart =new Cart({username:name}); //para despues de la revision de sgunda entrega
        const newCart = await cart.save(); 
        res.redirect("/");}
        catch(error){
            console.log("error creating cart",error)
        }

    }catch(error){
        console.log("Error register")
        res.redirect("/register");
    }
}

/////////////////log in 
export const loginUser = async (req,res) =>{
    try{
        const { email,password} =req.body;

        if(email === "adminCoder@coder.com" & password ==="adminCod3r123"){
            req.session.user={name:"ADM1NC0DR",
                              email:"adminCoder@coder.com",
                              role:"ADMIN"};
            req.session.admin =true
            res.redirect("/api/products/")
        }
        else{
        
        const user = await userModel.findOne({ email },{ email: 1, name: 1, password: 1 });
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
    }catch(error){
        console.log("Error Logging in",error);
        res.redirect("/");
    }
    
}
/////////////////////////log_out
export const logOut =async (req,res) =>{
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
        console.log("Errpr clossing session",error);
        res.status(500).send("Error clossing session")
    }
}
/////////////////////recoperar o simplemente cambiar contraseña
export const recoveryPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      await userModel.updateOne({ email }, { password: createHash(password) });
      res.redirect("/");
    } catch (error) {
      console.error("Error al recuperar contraseña", error);
      res.status(500).send("Error al cerrar la sesión");
    }
  };