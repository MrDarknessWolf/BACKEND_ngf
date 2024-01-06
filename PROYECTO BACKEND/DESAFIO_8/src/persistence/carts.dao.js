import Cart from '../models/carts.model.js';

const getCart= async(user) =>{
    const cart=(await Cart.find({username:`${user}`}))[0]
    return cart}

const addCart = async(name) =>{
    const cart =new Cart({username:name});
    return await cart.save(); 
}



export{addCart,getCart}