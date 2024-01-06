import express from 'express';
import Product from '../models/products.model.js';
import io from "../app.js"
const productRouter = express.Router()

productRouter.get('/', async (req,res)=>{  
    try{
        let current_user=req.session.user;
        let isAdmin =req.session.admin;
        ///////////usario actual//
        io.emit("current_user",current_user);
        //console.log("current user",req.session.user)
        let page = parseInt(req.query.page);
        if(!page) page=1;
        let query =req.query
        //console.log(query)
        const value_query =Object.values(query)[0]
        const name_query =Object.keys(query)[0]
        let has_query=false
        let products = await Product.paginate({},{page,limit:10,lean:true})
        if(name_query==="limit" ){
            has_query=true
            console.log("reprogram")
            products =await Product.paginate({},{page,limit:value_query,lean:true}) //limit de resultados en pantalla
        }
        else if (name_query ==="sort"){
            has_query=true
            if(value_query==="asc"){
                products =await Product.paginate({},{page,limit:10,lean:true,sort:{price:1}})
            }else{products =await Product.paginate({},{page,limit:10,lean:true,sort:{price:-1}})
            }
        }
        else if (Object.values(query).length>=2){
            has_query=true
            //console.log("sometig else")
            products = await Product.paginate(query,{page,limit:10,lean:true})
        }
        else{
            has_query=false
            //console.log("sometig")
            products = await Product.paginate({},{page,limit:10,lean:true})
        }
        ////////////////////////only missing limit but real limit and a normal query
        
        //console.log("///////////////")
        //console.log(products)
        //console.log("They want",Object.values(query)[0])
        //console.log(value_query)

        //////////////////FIX THE PAGINATING ///////////////////// and add multiple queries
        if (has_query){
            products.prevLink = products.hasPrevPage?`http://localhost:3000/api/products/?${name_query}=${value_query}&page=${products.prevPage}`:'';
            products.nextLink = products.hasNextPage?`http://localhost:3000/api/products/?${name_query}=${value_query}&page=${products.nextPage}`:'';
        }else{
        products.prevLink = products.hasPrevPage?`http://localhost:3000/api/products/?page=${products.prevPage}`:'';
        products.nextLink = products.hasNextPage?`http://localhost:3000/api/products/?page=${products.nextPage}`:'';}
        products.isValid= !(page<=0||page>products.totalPages)
        //console.log("valid?", products.isValid)
        //console.log(products)
        /////////////////almacenzar el usario/////////
        
        res.render('index',{
                layout:'products'
                ,products,current_user,isAdmin})

    }catch(error){res.status(500).json({message:error.message})}


})

export {productRouter}; //exportar la clase 
