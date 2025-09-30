import { renderOrderSummary } from '../scripts/checkout/orderSummary.js';  

export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart){
  cart = [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptions: '1'
}, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptions: '2'
}];

}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
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
    
    
    
    //Try out the logic here man , if you like forget
      
      else{
        //currently working with refresh
        cartItem.quantity = cartItem.quantity - value;
        console.log('Hello');
        renderOrderSummary();
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