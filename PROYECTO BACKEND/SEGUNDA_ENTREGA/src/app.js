import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import  Server  from "socket.io";
/////////////////Importing From files//////////////
import {db} from "./config/database.js"
import path from 'path';
import Cartrouter from './routers/carts.router.js';
import { productRouter } from './routers/products.router.js';
//TO DO 

///////////////Extra imports/////////////
import Product from './models/products.model.js';
import Cart from './models/carts.model.js'

const app =express();
const port = 3000;
app.use(express.urlencoded({extended:true}));
app.use(express.json());

///////////routers//////////
app.use('/api/carts',Cartrouter)
app.use('/api/products',productRouter)
///////////Handlebars///////
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'))

const httpServer =app.listen(port,()=>{
    console.log(`Current port ${port}`)
})


const io = new Server(httpServer);
io.on('connection',async(socket)=>{
    let user={username:"DummyCart"};
    console.log('Cart Ready')
    const preload_cart = (await Cart.find(user))[0]
    if(preload_cart === undefined){
        console.log("cart not found")
    }
    else if(preload_cart.products.length >0){
        console.log("items found")
        socket.emit("cart_updated",[user,preload_cart])
    }else{socket.emit("list_user",user)}
    //////////////////////////////////////socket para añadir del carro
    socket.on("add_to_cart", async (data)=>{
        const get_cart= (await Cart.find(user))[0]
        //console.log("reading",data)
        //console.log(get_cart)
        const product = (await Product.find({_id:data}))[0]
        //console.log("Item selected",product)
        let total =get_cart.total
        ///////////////////Encontrar los duplicados dentro del carro, primero se mira el carro luego se verifica su id
        const Current_products = get_cart.products
        //console.log(Current_products) //iteramos dentro de los productos para sacar su id
        let index=get_cart.products.findIndex(x=>{
            return JSON.stringify(x.product)===`"${data}"`});
        if(index > -1){
            console.log("duplication at index",index)
            let duplicated_item = get_cart.products[index]
            if (product.stock > duplicated_item.quantity){
                get_cart.products[index].quantity=duplicated_item.quantity+1;
                let new_total=0
                for(let item in get_cart.products){
                    new_total+= get_cart.products[index].price*get_cart.products[index].quantity}
                get_cart.total = new_total;
            }
            else{
                socket.emit("not_enough")
            }}
        else{
        ////////// en caso tal de no ser un duplicado>
        //primero hacer update a los items
        get_cart.products.push({product:product,name:product.title,thumbnail:product.thumbnail,price:product.price,quantity:1})
        }
        let new_total=0
                for(let item in get_cart.products){
                    new_total+= get_cart.products[item].price*get_cart.products[item].quantity}
        get_cart.total = new_total;
        console.log(`item added to cart` , product)
        const result = await Cart.updateOne({
            username:"DummyCart"},
            get_cart
            );
        console.log(get_cart)
        socket.emit("cart_updated",[user,get_cart])
    })
    ///////////////////////////////////////////socket para borrar del carro
    socket.on("remove_from_cart",async (data)=>{
        const get_cart= (await Cart.find(user))[0]
        const product = (await Product.find({_id:data}))[0]

        const total =get_cart.total
        //console.log(data)
        //_-----------------------------------------
        const index=get_cart.products.findIndex(x=>{
            return JSON.stringify(x.product)===`"${data}"`});
        //console.log(index)
        let item_incart = get_cart.products[index];
        console.log(item_incart.quantity);
        if(item_incart.quantity >1){
            get_cart.products[index].quantity=item_incart.quantity-1;
        }else{
            get_cart.products.splice(index,1)
        }
        //////////////////////////////
        let new_total=0
                for(let item in get_cart.products){
                    new_total+= get_cart.products[item].price*get_cart.products[item].quantity}
        get_cart.total = new_total;
        const result = await Cart.updateOne({
            username:"DummyCart"},
            get_cart
            );
            console.log(get_cart)
            socket.emit("cart_updated",[user,get_cart])
    })
    ///////////////////////////////////////sorting
    socket.on('sort_now', async (data) => {
        console.log("Received", data);
        if(data[1]==="ALL"){
            const redirectURL = `/api/products/`;
            socket.emit('redirect', redirectURL);

        }else{
        const redirectURL = `/api/products/?${data[0]}=${data[1]}`;
        socket.emit('redirect', redirectURL);}
      });
})


export default io;

