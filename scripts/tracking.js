import { orders } from '../data/orders.js'
import { loadProductsFetch } from '../data/products.js'

function getProductQuantity(orderItem, url){
    
    const searchProductId = url.searchParams.get('productId')
    orderItem.products.forEach((product) => {
        if(searchProductId.trim() === product.productId){
            console.log(product.productId)
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
        await loadProductsFetch
    }
    catch(error){
        console.log('Unexpected error')
    }

    tracker()
}

loadProducts()



      

      