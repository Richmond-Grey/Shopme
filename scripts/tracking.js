import { orders, saveToStorage } from '../data/orders.js'
import { loadProductsFetch } from '../data/products.js'
import { getProduct } from '../../data/products.js'
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { cart, permanentCart, saveToStorage as saveToStorageCart } from '../data/cart.js'
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'; // Date formatting library

function getProductQuantity(orderItem, url){
    const searchProductId = url.searchParams.get('productId')

    orderItem.products.forEach((product) => {
        if(searchProductId.trim() === product.productId){
            console.log(product.productId)
            document.querySelector('.js-product-infos').innerHTML = `Quantity: ${product.quantity}`

            //Getting product from the cart using product Id

            const matchingProduct = getProduct(product.productId)
            //Getting image
            document.querySelector('.js-product-image').innerHTML = `<img class="product-image" src="${matchingProduct.image}">`

            //Getting name
            document.querySelector('.js-product-info').innerHTML = matchingProduct.name

            //Working on the loading animation

                const root = document.querySelector(':root');
                const rootStyle = getComputedStyle(root);
                    
                let loadingWidth = rootStyle.getPropertyValue('--progress-bar-width');

                console.log(loadingWidth)

                //Now we get the current day
                const today = dayjs();

                console.log(today)

                

            //Getting delivery day
            let finalDate;
            permanentCart.forEach((permItem) => {
                if(product.productId === permItem.id){
                    let date = dayjs(permItem.delivery);
                    document.querySelector('.js-delivery-date').innerHTML = `Arriving on ${date.format('dddd, MMMM D')}`;
                    finalDate = dayjs(permItem.delivery);
                    console.log(finalDate)
                }
            })

            console.log(finalDate)


            //Checking how many days it is to final date
            let hoursLeft;
            try{
                hoursLeft = finalDate.diff(today, 'hours');
            }
            catch{
                hoursLeft = -5
            }
            console.log(typeof hoursLeft)

            //Setting the width of the loading bar
            let calcWidth = 100 - hoursLeft;
            
            if(calcWidth < 0 && calcWidth < 5){
                calcWidth = 5;
            }

            else if(calcWidth > 100){
                calcWidth = 100;
            }

            root.style.setProperty('--progress-bar-width', `${calcWidth}%`);
            

            //Removing item from the permanent cart once it has been delivered
            permanentCart.forEach((permItems) => {
                
                if(product.productId === permItems.id){
                    
                    if(calcWidth === 100){
                       permanentCart.splice(permanentCart.indexOf(permItems), 1);
                       saveToStorageCart();
                       console.log('completed')
                        

                        //Setting html of the page

                        document.querySelector('.js-order-tracking').innerHTML = `<div class="order-tracking-title">Order Delivered</div>
                        <a href="amazon.html">Continue Shopping</a>`

                        //After 5hrs remove the item from the orders array and the container from the menu
                        if(hoursLeft === -5){
                                setTimeout(() => {
                                orders.forEach((orderItem) => {
                                        orderItem.products.forEach((productItem) => {
                                        if(productItem.productId === searchProductId.trim()){
                                            orderItem.products.splice(orderItem.products.indexOf(productItem), 1);
                                            console.log('It has been deleted')
                                            saveToStorage();
                                        }
                                        
                                        else{
                                            //console.log(`${permItem.productId} is not equal to ${searchProductId.trim()}`)
                                        }
                                    })
                                })
                                
                            }, 1000)

                            
                            orders.forEach((orderItem) => {
                                console.log(orderItem)
                            })
                            console.log('Deleted')
                        }
                        
                    }
                }
                //Handle bugs like the perm cart has already deleted the product but for some reason its still in the page
                else{
                    if(calcWidth === 100){
                        document.querySelector('.js-order-tracking').innerHTML = `<div class="order-tracking-title">Order Delivered</div>
                        <a href="amazon.html">Continue Shopping</a>`

                            if(hoursLeft === -5){
                                    setTimeout(() => {
                                    orders.forEach((orderItem) => {
                                            orderItem.products.forEach((productItem) => {
                                            if(productItem.productId === searchProductId.trim()){
                                                orderItem.products.splice(orderItem.products.indexOf(productItem), 1);
                                                console.log('It has been deleted')
                                                saveToStorage();
                                            }
                                            
                                            else{
                                                //console.log(`${permItem.productId} is not equal to ${searchProductId.trim()}`)
                                            }
                                        })
                                    })
                                    
                                }, 1000)

                                
                                orders.forEach((orderItem) => {
                                    console.log(orderItem)
                                })
                                console.log('Deleted')
                            }
                    }
                }
            })

            permanentCart.forEach((perm) => {
                     console.log(perm)
                })


            
            
        }
    })

    


}

function tracker(){
    console.log(orders)
        const url = new URL(window.location.href);
        const orderId = url.searchParams.get('orderId')
    

        orders.forEach((orderItem) => {
            //Remove any whitespace
            if (orderItem.id === orderId.trim()) {
                 getProductQuantity(orderItem, url)
                
             }

        })

}

async function loadProducts(){
    try{
        await loadProductsFetch()
    }
    catch(error){
        console.log('Unexpected error')
    }

    tracker()
}

loadProducts()



      

      