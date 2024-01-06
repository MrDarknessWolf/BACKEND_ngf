import express from 'express';
import Cart from '../models/carts.model.js'
import { productRouter } from './products.router.js';


import io from '../app.js'
import Product from '../models/products.model.js';


const Cartrouter =express.Router();

////////////////////Los siguientes Cart router se utilizan con postman ya que manejo handlebars desde app.js

Cartrouter.get('/:id',async (req, res)=>{
    try{
        const carts= await Cart.findById(req.params.id).lean();
        
        //////////////////YOU HAVE TO FINISH THIS//////////////////
        res.render('index',{
            layout:'cart'
            ,carts})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

///agregar un carrito desactivado , se crea en automatico
/*
Cartrouter.post('/',async (req,res)=>{
    const cart =new Cart(req.body);

    try{
        const newCart = await cart.save();
        res.status(201).json(newCart)
    }catch(error){
        res.status(400).json({ message: error.message });
    }
})
*/
////// DELELTE PRODUCT, PUT ACTUALIZAR EL CARRITO, ,PUT DE PRODUCTO idsolo ejemplares
Cartrouter.delete("/:cid/products/:pid",async (req,res)=>{
    try{
        const cid= req.params.cid;
        const pid =req.params.pid;

        const get_cart = await Cart.findById(cid)
        const user=get_cart.username
        console.log("reading current cart",get_cart)
        //_-----------------------------------------
        const index=get_cart.products.findIndex(x=>{
            console.log(JSON.stringify(x.product))
            return JSON.stringify(x.product)===`"${pid}"`});
        console.log(index)
        const product = get_cart.products[index]

        //console.log(item_incart.quantity);
        get_cart.products.splice(index,1)
        //////////////////////////////
        get_cart.total = get_cart.total -(product.price*product.quantity);
        const result = await Cart.updateOne({
            username:"DummyCart"},
            get_cart
            );
        console.log("Item removed ")
        io.emit("cart_updated",[{username:user},get_cart])
        res.status(201).json({item_removed:product})
}catch(error){
    res.status(501).json({Error:"Id of item or Cart not found"})
}

})
//////////////actualizar nombre de carrito
Cartrouter.put("/:cid",async (req,res)=>{
    //solo se puede  atualizar el name ya que la creacion se hace solo con el name
    //recomendado actualizar el (65690f7c05047dcf74b1ca6c) para no desconfigurar 
    //el app.js esta configurado para funcionar con Dummy cart hasta tener sesiones definidas en otra entrega
    //console.log("uhhhhh")
    try{
    const cid= req.params.cid;
    const get_cart = await Cart.findById(cid)
    const user=get_cart.username
    get_cart.username=req.body.username
    //console.log(get_cart,req.body)
    const result = await Cart.updateOne({
        username:user},
        get_cart,
        );
    res.status(201).json({Cart_Updated:get_cart})}
    catch(error){
        res.result(501).json(error)
    }
})
////////////////////////actualizar cantidad de producto
Cartrouter.put("/:cid/products/:pid",async (req,res)=>{
    ////intentar añadir la estatua de gotzilla mediante front end por la alta cantidad
    // hacer update de cantidad con el codigo http://localhost:3000/api/carts/656909affa97729b3c5962e4/products/655b86eca7705314057a7f8f
    try{
        const cid= req.params.cid;
        const pid =req.params.pid;
        const product_indata=await Product.findById(pid)
        const get_cart = await Cart.findById(cid)
        const user=get_cart.username
        //console.log("reading current cart",get_cart)
        //_-----------------------------------------
        let current_total=0
        for(let item in get_cart.products){
            current_total+= get_cart.products[item].price*get_cart.products[item].quantity }
        //console.log("current total",current_total)
            

        /////////////////////////////////////////
        const index=get_cart.products.findIndex(x=>{
            console.log(JSON.stringify(x.product))
            return JSON.stringify(x.product)===`"${pid}"`});
        //console.log(index)
        const product = get_cart.products[index]

        
        //console.log("///////////////////",product)
        if(req.body.quantity === product.quantity){
            io.emit("cart_updated",[{username:user},get_cart])
            res.status(201).json({Message:"Item is already this quantity not updating"})
        }
        else if (req.body.quantity > product_indata.stock){
            io.emit("not_enough")
            res.status(501).json({Message:"Not enought items to fulfill the request"})
        }
        else if(req.body.quantity<1){
            get_cart.products[index].quantity=req.body.quantity
            let new_total=0
            for(let item in get_cart.products){
                new_total+= get_cart.products[item].price*get_cart.products[item].quantity}
            //console.log("new total",new_total)
            get_cart.total = new_total;
            get_cart.products.splice(index,1)
            const result = await Cart.updateOne({
                username:"DummyCart"},
                get_cart
                );
            console.log("Item removed ")
            io.emit("cart_updated",[{username:user},get_cart])
            res.status(201).json({item_removed:product})
        }
        else if(req.body.quantity<product.quantity){
            get_cart.products[index].quantity=req.body.quantity
            let new_total=0
            for(let item in get_cart.products){
                new_total+= get_cart.products[item].price*get_cart.products[item].quantity}
            //console.log("new total",new_total)
            get_cart.total = new_total;
            const result = await Cart.updateOne({
                username:"DummyCart"},
                get_cart
                );
            console.log("Item Updated ")
            io.emit("cart_updated",[{username:user},get_cart])
            res.status(201).json({item_updated:product})
        }
        else{
            get_cart.products[index].quantity=req.body.quantity
            //////////////////////////////
            let new_total=0
            for(let item in get_cart.products){
                new_total+= get_cart.products[item].price*get_cart.products[item].quantity}
            //console.log("new total",new_total)
            get_cart.total = new_total;
            const result = await Cart.updateOne({
                username:user},
                get_cart
                );
            console.log(get_cart)
            console.log("Item updated ")
            io.emit("cart_updated",[{username:user},get_cart])
            res.status(201).json({item_updated:product})
        }
    }catch(error){
        res.status(501).json({Error:"Item ID or Cart was not found"})
    }
})

///////////////////////ELIMINAR TODOS LOS PRODUCTOS///
//recomendado usar http://localhost:3000/api/carts/656909affa97729b3c5962e4

Cartrouter.delete("/:cid",async (req,res)=>{
    try{
    console.log("Cleaning list")
    const cid= req.params.cid;
    const get_cart = await Cart.findById(cid)
    const user=get_cart.username
    
    if(get_cart.products.length===0){
        res.status(501).json({Message:"Theres nothing to clean"})
    }
    else{
    console.log("before",get_cart)
    get_cart.products=[]
    let new_total=0
        for(let item in get_cart.products){
            new_total+= get_cart.products[item].price*get_cart.products[item].quantity}
    get_cart.total = new_total;
    console.log("after",get_cart)
    const result = await Cart.updateOne({
        username:user},
        get_cart
        );
    console.log(get_cart)
    console.log("Cart updated ")
    io.emit("cart_updated",[{username:user},get_cart])

    res.status(201).json({squeaky_clean:get_cart})
        }
    }catch(error){res.status(501).json({Error:"ID of the cart was not found"})}
})

export default Cartrouter;


//////////////////////////////////