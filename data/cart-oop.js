//creating object
//We used this instead of cart so if the object name changes the code would still run

//Use pascal case naming conventions for things that generate Objects

function Cart(localStorageKey){
    const cart = {
    cartItems: undefined,

        loadFromStorage(){
            //Making sure we are saving these stuff in a new cart callled cart-oop not cart
            this.cartItems = JSON.parse(localStorage.getItem(localStorageKey));
            if (!this.cartItems){
                this.cartItems = [{
                    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                    quantity: 2,
                    deliveryOptions: '1'
                }, {
                    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                    quantity: 1,
                    deliveryOptions: '2'
                }];

                }
    },

        saveToStorage(){
            localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
    },

        addToCart(productId){
            // Check if the item is already in the cart
            let matchingItem;

            this.cartItems.forEach((item) => {
            if (productId === item.productId) {
                matchingItem = item;
            }
            });

            if (matchingItem) {
            matchingItem.quantity += 1;
            } else {
            this.cartItems.push({
                productId: productId,
                quantity: 1,
                //Default delivery option
                deliveryOptions: '1'
            });
            }

            this.saveToStorage();
    },

        removeFromCart(productId){
            const newCart = [];

            // Loop through the cart, push items in a new array exept the deleted one
            this.cartItems.forEach((cartItem) => {
                if (cartItem.productId !== productId){
                newCart.push(cartItem)
                }
            });

            this.cartItems = newCart

            this.saveToStorage();
            },

        //Update delivery option and quantity

        updateDeliveryOption(productID, deliveryOptionId){
            let matchingItem;

                this.cartItems.forEach((item) => {
                if (productID === item.productId) {
                    matchingItem = item;
                }
                });

                matchingItem.deliveryOptions = deliveryOptionId;

                this.saveToStorage();
    }

    }

    return cart;
}

const cart = Cart('cart-oop');
const businessCart = Cart('cart-business');


cart.loadFromStorage();

//Now we have two carts, that can make by copying and pasting the old cart 
//But changing the local storage names but here we use a function



businessCart.loadFromStorage();

console.log(cart)
console.log(businessCart)




