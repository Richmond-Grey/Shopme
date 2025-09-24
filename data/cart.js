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

export function addToCart(productId){
      // Check if the item is already in the cart
    let matchingItem;

    cart.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += 1;
    } else {
      cart.push({
        productId: productId,
        quantity: 1,
        //Default delivery option
        deliveryOptions: '1'
      });
    }

    saveToStorage();
}

export function removeFromCart(productId){
  const newCart = [];

  // Loop through the cart, push items in a new array exept the deleted one
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId){
      newCart.push(cartItem)
    }
  });

  cart = newCart

  saveToStorage();
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