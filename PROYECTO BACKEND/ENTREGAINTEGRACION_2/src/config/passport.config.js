import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import userModel from "../models/user.model.js";
import "dotenv/config.js";
import Cart from '../models/carts.model.js';
import { createHash, isValidPassword } from "../utils.js";
const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  //console.log(2,req.cookies["access_token"])
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

const initializePassport = () => {

  /////////registro normal
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { name,last_name, email,age } = req.body;

        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("Usuario ya existe");
            return done(null, false);
          }
           ////////////////////////////////////////////
          const today = new Date();
          const birthYear = parseInt(age.substring(0, 4));
          const currentYear = today.getFullYear();
          const current_age = currentYear - birthYear;
          if(current_age< 18){
            return done("user is underage")
          }
          //////////////////////////////////////////////
          //console.log("attempting savingcart")
          const cart =new Cart({username:name}); //para despues de la revision de sgunda entrega
          const newCart = await cart.save(); 
          const newUser = {
            name,
            last_name,
            email,
            age:current_age,
            password: createHash(password),
            cart_id:newCart._id
          };
          //console.log("saving",newUser)
          let result = await userModel.create(newUser);
          //console.log("what happened",result)
          return done(null, result);
        } catch (error) {
          return done("Error al obtener usuario" + error);
        }
      }
    )
  );

  /////////////////log in
    passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await userModel.findOne({ email: username });
          if (!user) {
            console.log("Usuario no existe ");
            return done(null, false);
          }

          if (!isValidPassword(user, password)){
             return done(null, false);}
            

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
      ///////////////////jwt
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.KEYSECRET,
      },
      async (jwt_payload, done) => {

        try {

          return done(null, jwt_payload);
        } catch (error) {

          return done(error);
        }
      }
    )
  );
  //////////////////////////////
};
passport.serializeUser((user, done) => {
  //console.log(user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await userModel.findById(id);
  done(null, user);
});

export default initializePassport;