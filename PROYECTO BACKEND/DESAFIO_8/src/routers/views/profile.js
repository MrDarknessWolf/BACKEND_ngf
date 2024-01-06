import express from "express";
import io from "../../app.js"
const router = express.Router();

router.get("/", (req, res) => {
  let data = {
    layout: "profile",
    user: req.session.user,
  };
  console.log("Current user",req.session.user)
  io.emit("current_user",req.session.user);
  res.render("index", data);
});

export default router;