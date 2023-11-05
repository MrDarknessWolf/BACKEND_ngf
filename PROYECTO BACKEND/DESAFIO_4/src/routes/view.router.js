import express from 'express';
import { ProductManager } from '../ProductManager.js';
import { Server } from 'socket.io';
import { uploader } from '../utils.js';

import io from '../app.js';
const pMI = new ProductManager("./Products.json"); //PRODUCT MANAGER INSTANCE

const viewRouter = express.Router();

viewRouter.get('/', (req, res) => {
  const pMI = new ProductManager("./Products.json");
  //console.log("attempting")
  const items = pMI.getProductFromFile();
  //console.log(items)
  res.render("index", {
    layout: 'home',
    items
  });
});

viewRouter.get("/realtimeproducts", (req, res) => {
  const pMI = new ProductManager("./Products.json");
  //console.log("attempting")
  const items = pMI.getProductFromFile();
  res.render('index', {
    layout: 'realTimeProducts',
    items
  });
});

//////////////////add new product post man/////////////////
viewRouter.post("/realtimeproducts",uploader.single('thumbnail'),(req, res) => {
  //console.log("New item",data)/// you are getting tis data soo find a way to just redirect  i guess
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
      console.log(`New product is `);
      console.log(array[array.length-1])
      io.emit("confirm_add",[true,0,array[array.length-2].id,array[array.length-1]])
      res.status(201).json({newProduct:array[array.length-1]})
    }
      //[If can be added, item if duplicated,the last id in array]
  else{
        console.log(`Error Item ${newProduct.title} by code ${newProductCode} already in database \nSimilar item`);
        console.log(array[duplicate])
        io.emit("confirm_add",[false,array[duplicate],0,0])
        res.status(400).json({Error:`Item ${newProduct.title} by code ${newProductCode} already in database`,Item_Similar:array[duplicate]})
  
    }
});


/////////////////delete via post man /////////////////////////

viewRouter.delete('/realtimeproducts/:idproduct', (req, res) => { //id is quite literally the number itself
  console.log("Atempting Deletion")
  const productId = parseInt(req.params.idproduct, 10);
  const array = pMI.getProductFromFile();
  const product = array.findIndex(product => product.id === productId);
  if (product === -1) {
    console.log(`Item by ID ${data} was not found`);
    io.emit('confirm_delete', [false, data]);
    res.status(404).json({Error:"Error Item not found"})

  } else {
    pMI.deleteProductById(productId);
    const array = pMI.getProductFromFile();
    io.emit('confirm_delete', [true, productId]);
    res.status(200).json({Response:"Item was deleted"})
  }
});

///////////////////////////////

export default viewRouter;