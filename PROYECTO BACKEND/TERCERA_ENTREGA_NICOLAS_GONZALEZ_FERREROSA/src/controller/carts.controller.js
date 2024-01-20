import {Router} from "express";
import CartsDAO from "../dao/carts.dao.js";
import ProductsDAO from "../dao/products.dao.js";

import io from '../app.js'
const cartRouter = Router();
const carts=new CartsDAO()
/*
cartRouter.get("/",async (req, res)=>{
    try{
        const current_id =req.session.user._id
        res.redirect(`/api/cart/${current_id}`)

    }catch(error){
        res.status(501).json({message:error.message})
    }
})*/
cartRouter.get("/:cid",async(req,res)=>{
    if(req.session.user===undefined){
        console.log("oh you have traveled too far, sing in now")
        res.redirect("/")
        return;
    }
    if(req.params.cid==="ticket"){
        //console.log("oop")
        res.redirect("/api/cart/ticket")
    }
    //console.log(req.params)
    const current_user=req.session.user
    const cart= await carts.getCart(req.session.user.name)
    const products = cart.products
    //console.log("cart found",cart)
    res.render('index',{
        layout:'cart'
        ,cart,current_user})
})
cartRouter.get("/:cid/payment",async(req,res)=>{
    if(req.session.user===undefined){
        console.log("oh you have traveled too far, sing in now")
        res.redirect("/")
        return;
    }
    const current_user=req.session.user
    const cart= await carts.getCart(req.session.user.name)
    const products = cart.products
    console.log("Lets go pay",cart)
    res.render('index',{
        layout:'payment'
        ,cart,current_user})
})
/*
cartRouter.get("/:cid/ticket",async(req,res)=>{
    console.log("payment yime")
    res.status(201).json({Message:"success"})
})*/
export default cartRouter;