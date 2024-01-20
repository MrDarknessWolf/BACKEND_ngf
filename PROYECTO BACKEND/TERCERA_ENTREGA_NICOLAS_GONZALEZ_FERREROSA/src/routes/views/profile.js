import express from "express";
import io from "../../app.js"
const router = express.Router();

router.get("/", (req, res) => {
  if(req.session.user===undefined){
    console.log("oh no, the session expired")
    res.redirect("/")
    return;
  }
  let data = {
    layout: "profile",
    user: req.session.user,
  };
  //console.log(req.session.admin)
  console.log("Current user",req.session.user)
  io.emit("current_user",req.session.user);
  res.render("index", data);
});

export default router;