import * as cartDao from "../persistence/carts.dao.js"

const getCart=(user) =>{
    return cartDao.addCart(user);
}
const createCart =(name)=>{
    return  cartDao.addCart(name);
}

export {createCart,getCart}