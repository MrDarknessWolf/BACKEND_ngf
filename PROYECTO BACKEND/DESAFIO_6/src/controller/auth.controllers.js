//usuario de prueba dummy@gmail.com
//pass: dummy3

import userModel from "../models/user.model.js";
import io from "../app.js"
import Cartrouter from '../models/carts.model.js'; ///cada usario ligado a un carrito
/////////////////////registro de usuario////////// y creacion de carrito
export const registerUser =async (req,res) =>{

    try{
        const {name ,email,password} =req.body
        
        const user = new userModel({name,email,password});
        await user.save();
        //const cart =new Cart({username:name}); para despues de la revision de sgunda entrega
        //const newCart = await cart.save(); 
        res.redirect("/");

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
        
        const user = await userModel.findOne({email,password});
        
        if(user){
            console.log("User id found connecting")
            req.session.user=user;
            req.session.admin=false;
            io.emit("log_success")
            res.redirect("/api/products/")
        }else{

            console.log("User or password incorrect");
            //await io.emit("somethig_wrong") //para despues
            res.redirect("/")
            //res.status(501).json({error:"User or password incorrect"})
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
                res.redirect("/")
            }
        })}
      
    }catch (error){
        console.log("just error at all")
        console.log("Errpr clossing session",error);
        res.status(500).send("Error clossing session")
    }
}

