import { loadProductsFetch } from "../data/products.js";
import { ordering } from './orderPage/ordering.js'
import { cart, clearCart, addToPermanentCart, permanentCart } from '../data/cart.js'

async function loadPage(){
    try{
        await loadProductsFetch()
    }
    catch(error){
        console.log('Unexpected eror')
    }

    ordering();
    //Emptying cart
    addToPermanentCart(cart)
    permanentCart.forEach((item) => {
        console.log(item);
    })

    clearCart()
}

loadPage();

