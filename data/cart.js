import { renderOrderSummary } from '../scripts/checkout/orderSummary.js';
import { renderPaymentSummary } from '../scripts/checkout/paymentSummary.js';  
import { getDeliveryOption } from './deliveryOptions.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export let cart = JSON.parse(localStorage.getItem('cart'));
export let permanentCart = JSON.parse(localStorage.getItem('permanentCart'));
if (!cart){
  cart = [];
}

if(!permanentCart){
  permanentCart = []
}



function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('permanentCart', JSON.stringify(permanentCart));
}

//Working on Cart Quantity

export function fixCartQuantity(){
  let newCart = []
  cart.forEach((item) => {
    if(!(item.quantity < 0)){
      newCart.push(item);
    }
  })
  cart = newCart;
  saveToStorage();
  renderOrderSummary();
  renderPaymentSummary();
}



export function addToCart(productId, value){
      // Check if the item is already in the cart
    let matchingItem;

    cart.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      //Not necessary since value will always be one but we just want to learn here
      matchingItem.quantity += value ? value: 1;
    } else {
      cart.push({
        productId: productId,
        quantity: value,
        //Default delivery option
        deliveryOptions: '1'
      });
    }

    saveToStorage();
}

export function removeFromCart(productId, value){
  const newCart = [];
  let count = 0;
  let result;
  

  // Loop through the cart, push items in a new array exept the deleted one
  cart.forEach((cartItem) => {

    if(cartItem.productId === productId){
      //If all the values are to be deleted

      if (value === cartItem.quantity){
        console.log('Hey');
        
        cart.forEach((item) => {
          if(productId !== item.productId){
            newCart.push(item);
            console.log(`Here is ${newCart}`)
          }
        });

        result = 0;
        cart = newCart;
      }
    
    
      
      else{
        //currently working with refresh
        cartItem.quantity = cartItem.quantity - value;
        console.log('Hello');
        renderOrderSummary();
        renderPaymentSummary();
        result = 1;

      }
    }
  });

  console.log(newCart);
  

  saveToStorage();
  return result;
  
}


export function updateCart(productId, value){
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      cartItem.quantity = cartItem.quantity + value;
      saveToStorage();
      renderOrderSummary();
      renderPaymentSummary();
    }
  })
}

//Update delivery option and quantity

export function updateDeliveryOption(productID, deliveryOptionId){
  let matchingItem;

    cart.forEach((item) => {
      if (productID === item.productId) {
        matchingItem = item;
      }
    });

    matchingItem.deliveryOptions = deliveryOptionId;

    saveToStorage();
}

export function clearCart(){
  localStorage.removeItem('cart')
}

//Add to permanent Cart

export function addToPermanentCart(carts){
  console.log(`This is ${carts}`)
  carts.forEach((cartItem) => {
    
    let tempCart = {}

    let deliveryOptionId = cartItem.deliveryOptions
    
    let deliveryOption = getDeliveryOption(deliveryOptionId)
    
    let today = dayjs()

    let deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    console.log(`Here is our ${deliveryDate}`)
    let dateString = deliveryDate.format("MMMM, D")
    
    tempCart ={
      name: "Items",
      id: cartItem.productId,
      delivery: dateString
    }

    permanentCart.push(tempCart)
  })
  
  saveToStorage();
}