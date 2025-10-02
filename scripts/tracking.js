import { orders } from '../data/orders.js'
import { loadProductsFetch } from '../data/products.js'
import { getProduct } from '../../data/products.js'
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { cart } from '../data/cart.js'

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

            //Getting delivery day
        
            
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



      

      