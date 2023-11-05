//archivo de prentrega para que no me pierda.
import express from 'express'
import handlebars from 'express-handlebars';
import { productRouter } from './routes/product.router.js';
import { cartRouter } from './routes/carts.router.js';
import __dirname from './utils.js';
import viewRouter from './routes/view.router.js';
import {Server} from 'socket.io';
import path from 'path';

///////////////////////////////////
import {ProductManager} from './ProductManager.js'///solo para esta entrega
//////////////////////////////////


const app =express();
const port =8080;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api/products',productRouter);
app.use('/api/carts',cartRouter) ;
/////////////////////desafio 4//////////////////////
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'))
app.use('/', viewRouter);

const httpServer =app.listen(port,()=>{
    console.log(`Current port ${port}`)
})
const io = new Server(httpServer);

const pMI = new ProductManager();

io.on('connection', (socket) => {
    console.log("newclient online");
    socket.on('mesagge',(data)=>{
       
    })

    ///////////////////////Añadir unelemento///////////////
    socket.on('add_item',(data)=>{
        //console.log("New item",data)/// you are getting tis data soo find a way to just redirect  i guess
        const newProduct =data;
        const newProductCode =newProduct.code;
        const array =pMI.getProductFromFile();
        console.log("Attempting add new product")
        const duplicate = array.findIndex(product =>product.code === newProductCode);
        if(duplicate === -1){
            if(data.thumbnail.length>0){
                newProduct["thumbnail"]=`${data.thumbnail}`
            }
            pMI.addProduct(newProduct) //REMEMBER TO TURN THIS BACK ON
            const array =pMI.getProductFromFile(); //pido que me vuelva a taer la lista pero esta vez actualizda con el valor nuevo
            console.log(`New product is `);
            console.log(array[array.length-1])
            io.emit("confirm_add",[true,0,array[array.length-2].id,array[array.length-1]])}
                                //[If can be added, item if duplicated,the last id in array]
        else{
            console.log(`Error Item ${newProduct.title} by code ${newProductCode} already in database \nSimilar item`);
            console.log(array[duplicate])
            io.emit("confirm_add",[false,array[duplicate],0,0])

        }
    })
    ///////////////////////borrar un elemento//////////////
    socket.on('delete',(data)=>{
        console.log("want to delete ",data)
        const array =pMI.getProductFromFile();
        const product = array.findIndex(product =>product.id === Number(data));
        if(product === -1){
            console.log(`Item by ID ${data} was not found`);
            io.emit('confirm_delete',[false,data])
        }else{
            pMI.deleteProductById(Number(data));
            const array =pMI.getProductFromFile();
            io.emit('confirm_delete',[true,data]) //for the love of whats good this is what updates is the io
        }
    })

})


export default io;