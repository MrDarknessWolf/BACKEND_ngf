import express from 'express'

import ProductManager from './src/ProductManager.js'

const app = express();
const port = 8080;
const productManagerInstance = new ProductManager();


app.use(express.urlencoded({extended:true})); //para el query
app.use(express.json());
app.get('/hell',(req,res)=>{
    res.status(200).send("this is well hell is made");
})

app.get('/products',(req,res)=>{
    const array =productManagerInstance.getProductFromFile();
    //console.log(array[0]);
    let new_text =""
    let limites= req.query.limit;
    if(limites > array.length){
        limites = -1;
        new_text += "<span style='font-weight: bold; color: red;'>Request out of reach, showing full list<br></span>";
    }
    if(limites >0 ){
        new_text += `No. of items requested: ${limites} <br>`
        for (let i =0; i<=limites-1; i++){
            new_text += `Title: ${array[i].title}<br>`;
            new_text += `Description: ${array[i].description}<br>`;
            new_text += `Value: ${array[i].value}$<br>`;
            new_text += `ID: ${array[i].code}<br>`;
            new_text += `In-stock: ${array[i].stock}<br>`;
            new_text += `Thumbnail:<img src =${array[i].thumbnail} width="100" style="border: 1px solid black;"></img><br>`;
            new_text += "</div><br>";
        }
        res.status(200).send(new_text)
    }
    else{
         new_text +="Items in the database <br><br>";
        for (let i =0; i<array.length; i++){
            new_text += `Title: ${array[i].title}<br>`;
            new_text += `Description: ${array[i].description}<br>`;
            new_text += `Value: ${array[i].value}$<br>`;
            new_text += `ID: ${array[i].code}<br>`;
            new_text += `In-stock: ${array[i].stock}<br>`;
            new_text += `Thumbnail: <img src =${array[i].thumbnail} width="100" style="border: 1px solid black;"></img><br>`;
            new_text += "</div><br>";}
        res.status(200).send(new_text)
    }
    //res.send("hello sexy");
})
////////////////////////////productos por id
app.get('/products/:idproduct',(req,res)=>{ //id is quite literally the number itself
    const productId =parseInt(req.params.idproduct,10);
    const array =productManagerInstance.getProductFromFile();
    const product = array.findIndex(product =>product.code === productId);
    let display_text =""
    //console.log(product)
    if(product === -1){
        res.status(404).json({Error: `Item by ID ${productId} was not found`});
    }else{
        
        display_text +=`<span style='font-weight: bold; color: green;'>Item with ID ${productId} was found </span><br><br>`;
        display_text += `Title: ${array[product].title}<br>`;
        display_text += `Description: ${array[product].description}<br>`;
        display_text += `Value: ${array[product].value}$<br>`;
        display_text += `ID: ${array[product].code}<br>`;
        display_text += `In-stock: ${array[product].stock}<br>`;
        display_text += `Thumbnail: <img src =${array[product].thumbnail} width="100" style="border: 1px solid black;"></img><br>`;
        display_text += "</div><br>";
        res.status(200).send(display_text)
    }
});



/////////listerine
app.listen(port, ()=>{
    console.log(`server is being listened by ${port}`)
})