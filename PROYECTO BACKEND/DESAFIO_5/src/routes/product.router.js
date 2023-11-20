import express from 'express';
import {ProductManager} from '../ProductManager.js'
import { Server } from 'socket.io';
import { uploader } from '../utils.js';
import Product from '../models/product.model.js';
import io from '../app.js';
const productRouter =express.Router();

//const pMI = new ProductManager(); //PRODUCT MANAGER INSTANCE
///////////////Codigos Get
productRouter.get('/',async (req,res)=>{
    try{
        let limites= req.query.limit;
        let products=await Product.find().lean()
        let items =products
        //console.log(items)
        if(limites > products.length){
            res.status(404).json({Error:"Request out of reach"})
        }
        if(limites >0 && limites <= products.length){
            console.log("accesing")
            let products=await Product.find({limit:limites}).lean()
            items = products
            res.status(201).render("index",{
                layout:"realTimeProducts",
                products});
            }
        if(limites==undefined){
            res.status(201).render("index",{
                layout:"realTimeProducts",
                items});
        }
    }catch(error){
        res.status(500).json({message:error.message})
    }
    /*
    const array =pMI.getProductFromFile();
    const new_text={};
    let limites= req.query.limit;
    if(limites > array.length){
        new_text["error"] ="Request out of reach";
        res.status(404).json({message:new_text})
    }
    if(limites >0 && limites <= array.length){
        for (let i =0; i<=limites-1; i++){
            new_text[`Item ${i+1}`]=array[i]
        }
        res.status(200).json({Response:new_text})
    }
    */
});

productRouter.get('/:idproduct',async (req,res)=>{ //id is quite literally the number itself
    //console.log("Searching for product")
    const productId =(req.params.idproduct);
    const array =await Product.find();
    //console.log(productId)
    const product = array.findIndex(product =>product.id === productId);
    const display_text ={}
    if(product === -1){
        res.status(404).json({Error: `Item by ID ${productId} was not found`});
    }else{
        display_text[`Item ${product+1}`]=array[product];
        res.status(200).json({Response:display_text})
    }
});
//////////////////////////////////////codigos POST////////////////////////////////////
productRouter.post('/',uploader.single('thumbnail'),async (req,res)=>{ //añadir productos
    const newProduct =new Product(req.body);
    const newProductCode =newProduct.code;
    const array=await Product.find()
    console.log("Attempting add new product")
    const duplicate = array.findIndex(product =>product.code === newProductCode);
    const lastItem=await Product.find().sort({ _id: -1 }).limit(1)
    //console.log("last item is",lastItem[0].id)
    if(duplicate === -1){
        const exist=req.file
        if(exist){
            newProduct["thumbnail"]=`${exist.destination}/${exist.filename}`
        }
        
        const newItem=await newProduct.save()
        //pMI.addProduct(newProduct) //REMEMBER TO TURN THIS BACK ON
        //const array =pMI.getProductFromFile(); //pido que me vuelva a taer la lista pero esta vez actualizda con el valor nuevo
        io.emit("confirm_add",[true,0,lastItem[0].id,newItem])
        res.status(201).json({newProduct:newItem})}
    else{
        io.emit("confirm_add",[false,newProduct,0,0])
        res.status(400).json({Error:`Item ${newProduct.title} by code ${newProductCode} already in database`,Item_Similar:array[duplicate]})
    }
});
//////////////////////////POST SOCKET////////////////

//////////////////////////////////codigo PUT ////////////////////////////////////////
productRouter.put('/:idproduct',uploader.single('thumbnail'),async (req,res)=>{ //id is quite literally the number itself
    console.log("Atempting update")
    const lastItem=await Product.find().sort({ _id: -1 }).limit(1)
    try{
        const product = await Product.findByIdAndUpdate(req.params.idproduct, req.body, { new: true });
        if (!product){
            return res.status(404).json({Error:`item by the id ${req.params.id} was not found`})
        }
        io.emit("confirm_add",[true,0,lastItem[0].id,product])
        res.status(200).json({Message:`Item by id ${req.params.idproduct} Upated`,product});
    }catch (error){
        res.status(500).json({Error:error})
    }
    /*
    const updatedProduct =req.body;
    const productId =req.params.idproduct;
    const array =await Product.find();
    const product = array.findIndex(product =>product.id === productId);
    if(product === -1){
        res.status(404).json({Error: `Item by ID ${productId} was not found`});
    }else{
        //console.log(updatedProduct)
        //console.log("id found",product)
        const exist=req.file
        if(exist){
            updatedProduct["thumbnail"]=`${exist.destination}/${exist.filename}`
        }
        //pMI.updateProductById(product+1,updatedProduct)
        //const array =pMI.getProductFromFile();
        //res.status(201).json({Updated:array[product]})
    }*/
});

/*
/////////////////////////////Codigo DELETE //////////////////////////////////////////
productRouter.delete('/:idproduct',(req,res)=>{ //id is quite literally the number itself
    console.log("Atempting Deletion")
    const productId =parseInt(req.params.idproduct,10);
    const array =pMI.getProductFromFile();
    const product = array.findIndex(product =>product.id === productId);
    if(product === -1){
        res.status(404).json({Error: `Item by ID ${productId} was not found`});
    }else{
        //console.log(updatedProduct)
        //console.log("id found",product)
        pMI.deleteProductById(product+1)
        const array =pMI.getProductFromFile();
        res.status(201).json({Updated:array})
    }
});
*/

export {productRouter}; //exportar la clase 
