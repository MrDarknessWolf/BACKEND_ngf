import express from 'express';
import {ProductManager} from '../ProductManager.js'
import { uploader } from '../utils.js';
const productRouter =express.Router();

const pMI = new ProductManager(); //PRODUCT MANAGER INSTANCE
///////////////Codigos Get
productRouter.get('/',(req,res)=>{
    //console.log("request accepted")
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
});

productRouter.get('/:idproduct',(req,res)=>{ //id is quite literally the number itself
    //console.log("Searching for product")
    const productId =parseInt(req.params.idproduct,10);
    const array =pMI.getProductFromFile();
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
productRouter.post('/',uploader.single('thumbnail'),(req,res)=>{ //añadir productos
    const newProduct =req.body;
    const newProductCode =newProduct.code;
    const array =pMI.getProductFromFile();
    console.log("Attempting add new product")
    const duplicate = array.findIndex(product =>product.code === newProductCode);
    if(duplicate === -1){
        const exist=req.file
        if(exist){
            newProduct["thumbnail"]=`${exist.destination}/${exist.filename}`
        }
        pMI.addProduct(newProduct) //REMEMBER TO TURN THIS BACK ON
        const array =pMI.getProductFromFile(); //pido que me vuelva a taer la lista pero esta vez actualizda con el valor nuevo
        res.status(201).json({newProduct:array[array.length-1]})}
    else{
        res.status(400).json({Error:`Item ${newProduct.title} by code ${newProductCode} already in database`,Item_Similar:array[duplicate]})
    }
});
//////////////////////////////////codigo PUT ////////////////////////////////////////
productRouter.put('/:idproduct',uploader.single('thumbnail'),(req,res)=>{ //id is quite literally the number itself
    console.log("Atempting update")
    const updatedProduct =req.body;
    const productId =parseInt(req.params.idproduct,10);
    const array =pMI.getProductFromFile();
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
        pMI.updateProductById(product+1,updatedProduct)
        const array =pMI.getProductFromFile();
        res.status(201).json({Updated:array[product]})
    }
});
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

export {productRouter}; //exportar la clase 
