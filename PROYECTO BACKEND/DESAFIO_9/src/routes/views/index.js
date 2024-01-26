import express from "express";

const router =express.Router()


router.get("/",(req,res)=>{
    if(req.session.user===undefined){
        console.log("Hi please log in")
        res.redirect("/login")
        return;
    }
    else{
        console.log("welcome back")
        res.redirect("/api/products")
    }

})

export default router