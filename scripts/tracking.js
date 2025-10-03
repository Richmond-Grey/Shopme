import { orders } from '../data/orders.js'
import { loadProductsFetch } from '../data/products.js'
import { getProduct } from '../../data/products.js'
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { cart, permanentCart } from '../data/cart.js'
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

                let finalDate;

            //Getting delivery day

            permanentCart.forEach((permItem) => {
                if(product.productId === permItem.id){
                    let date = dayjs(permItem.delivery);
                    document.querySelector('.js-delivery-date').innerHTML = `Arriving on ${date.format('dddd, MMMM D')}`;
                    finalDate = dayjs(permItem.delivery);
                }
            })

            //Testing finalDate with various dates
            console.log(`Our final date is ${finalDate}`)

            //Checking how many days it is to final date
            const hoursLeft = finalDate.diff(today, 'hours');
            console.log(hoursLeft)

            
            
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



      

      