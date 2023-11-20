import express from 'express';
import fs from 'fs'
import {ProductManager} from '../ProductManager.js'
const cartRouter =express.Router();

const cart =[];
let idCounter=0;
const path ="./carrito.json"
const prodpath="./Products.json"
let data = fs.readFileSync(path, 'utf-8');
if(data.length <=0){
    console.log("file was either empty or not found... writting....")
    fs.writeFileSync(path, JSON.stringify(cart), 'utf-8')
    console.log("file fixed")
    data = fs.readFileSync(path, 'utf-8');
}
const array = JSON.parse(data);

//console.log(array.length)
cartRouter.post('/',(req,res)=>{
    
    if(array.length >0){
        idCounter= array[array.length-1].id+1;
    }
    else{idCounter++}
    
    const cartName = array.findIndex(cart =>cart.name === req.body.name);
    if(cartName ===-1){
    let newCart={
            id:idCounter,
            name:req.body.name,// para poder por lo menos darle una personalzacion y diferenciar un poco mas
            products:[]}
        //console.log(newCart)
        array.push(newCart)
        fs.writeFileSync(path, JSON.stringify(array), 'utf-8')
        res.status(200).json({NEWCART:newCart});}
    else{res.status(401).json({ERROR:`We are sorry the cart named [${req.body.name}] already exist`})}
});
///////////////////////////////codigo para obtener los archivos
cartRouter.get('/:cid',(req,res)=>{ //no requiere hacer refresh porque siempre se ejecuta la primera parte de este codigo
    const cartId =parseInt(req.params.cid,10);
    const cartIndex = array.findIndex(cart =>cart.id === cartId);
    console.log("calling cart by the id selected")
    if(cartIndex === -1){
        res.status(401).json({Error:`Cart by id ${cartId} was not found`})
    }
    else if(array[cartIndex].products.length === 0){
        console.log("Cart is empty")
        res.status(200).json({Response:`Cart ${array[cartIndex].name} by ID ${cartId} is actually empty`});
    }else{
        res.status(200).json(`items in cart${cartId}: \n ${array[cartIndex].products}`)
    }
    
});


///////////////////////Codigo de post 
cartRouter.post('/:cid/product/:pid',(req,res)=>{
    //Seccion donde buscamos el carrito en este caso con lo que llega por params buscamos sin en la base de datos existe
    const cartId =parseInt(req.params.cid,10);
    const productID =parseInt(req.params.pid,10);
    const cartIndex = array.findIndex(cart =>cart.id === cartId);
    //Seccion donde se busca el producto dentro de la base de datos del producto esto es para confirmar que la solicitud se  puede hacer
    const productData = fs.readFileSync(prodpath, 'utf-8');
    const arrayP = JSON.parse(productData);
    const productIndex = arrayP.findIndex(product =>product.id === productID);
    console.log("Index item selected",productIndex+1) 
    //Verificamos que el carro exista como primer bloque de seguridad si no devuelve error
    if(cartIndex === -1){
        res.status(401).json({Error:`Cart by id ${cartId} was not found`})
    }
    else{
        ///el carro existe ahora si el producto no existe se devuelve el error
        if(productIndex ===-1){
            res.status(401).json({Error: `Product By ID ${productID} was not found`})
        }//El producto existe ahora vamos a agregarlo
        else{
            //console.log(array[cartIndex].products) //chequeo si el producto ya existe en el carrito
            const itemIndex = array[cartIndex].products.findIndex(item =>item.ProductID === productID);
            //console.log(itemIndex)
            console.log(array[cartIndex].products[itemIndex].Quantity)
            //si el producto no existe se crea uno nuevo en la base de el carrito
            if(itemIndex ==-1){
                console.log("Item is new")
                const newProduct={
                    ProductID:arrayP[productIndex].id,
                    Quantity:1
            }
            array[cartIndex].products.push(newProduct)
            fs.writeFileSync(path, JSON.stringify(array), 'utf-8')
            res.status(200).json({itemAdded:newProduct})
        }//ahora si el producto ya existe en el carrito se busca con el itemIndex y se actualiza su quantity
            else{
                console.log("item was in the basket")
                const updateProduct={
                    ProductID:arrayP[productIndex].id,
                    Quantity:array[cartIndex].products[itemIndex].Quantity+1
                }
                array[cartIndex].products[itemIndex]=updateProduct
                fs.writeFileSync(path, JSON.stringify(array), 'utf-8')
                res.status(200).json({itemUpdated:updateProduct})
            }
        }
    }

})

export {cartRouter}; //exportar la clase 