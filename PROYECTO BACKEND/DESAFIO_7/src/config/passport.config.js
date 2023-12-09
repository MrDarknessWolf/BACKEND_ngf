import passport from "passport";
import local from "passport-local";

import GitHubStrategy from "passport-github2";
import userModel from "../models/user.model.js";
import "dotenv/config.js";
import Cart from "../models/carts.model.js"
import { createHash, isValidPassword } from "../utils.js";
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.gitclientid,
        clientSecret: process.env.gitclientsecret,
        callbackURL: process.env.gitcallbackurl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              name: profile._json.name,
              email: profile._json.email,
              password: "",
            };
            let result = await userModel.create(newUser);
            try{
              const cart =new Cart({username:newUser.name}); //para despues de la revision de sgunda entrega
              const newCart = await cart.save(); 
              }
              catch(error){
                  console.log("error creating cart",error)}
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  /////////registro normal
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { name, email } = req.body;

        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("Usuario ya existe");
            return done(null, false);
          }
          const newUser = {
            name,
            email,
            password: createHash(password),
          };
          let result = await userModel.create(newUser);
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

          if (!isValidPassword(user, password)) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
passport.serializeUser((user, done) => {
  console.log(user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await userModel.findById(id);
  done(null, user);
});

export default initializePassport;