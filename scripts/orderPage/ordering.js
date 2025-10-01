import { orders } from '../../data/orders.js'
import { products, getProduct } from '../../data/products.js';
import { cart, clearCart } from '../../data/cart.js'
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { formatCurrency } from '../utils/money.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';

function getItem(orderItem){
        let gridHTML = '';
        
        orderItem.products.forEach((product) => {
          let dateString;
          //Getting the selected radio date 
          cart.forEach((cartItem) => {
            if(cartItem.productId === product.productId){
              let deliveryOptionId = cartItem.deliveryOptions;
              let deliveryOption = getDeliveryOption(deliveryOptionId)

              let today = dayjs()

              let deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
              dateString = deliveryDate.format("MMMM, D")
              console.log(dateString)
            }

          })
          //Getting mathing value
          const matchingProduct = getProduct(product.productId);

          //Inputting values
          gridHTML += `
            <div class="product-image-container">
              <img src="${matchingProduct.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${dateString}
              </div>
              <div class="product-quantity">
                Quantity: ${product.quantity}
              </div>
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId= ${orderItem.id}&productId= ${product.productId}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>
        `
          
           
        })

        //Emptying cart
      
      clearCart()
      return gridHTML
}


export function ordering(){
    let orderHTML = '';
    let count = 0;
    //Generating html for the order page
    orders.forEach((orderItem) => {

        console.log(orderItem)
        orderHTML += `
         <div class="order-container">
          
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${dayjs(orderItem.orderTime).format("MMMM, D")}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(orderItem.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${orderItem.id}</div>
            </div> 
          </div>
          <div class="order-details-grid js-order-details-grid">
          ${getItem(orderItem)}
          </div>
        </div>`

        


        document.querySelector('.js-orders-grid').innerHTML = orderHTML;
         
        
        
    })
   
}
