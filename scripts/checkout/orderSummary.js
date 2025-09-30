import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';




export function renderOrderSummary(){
  let cartSummaryHTML = '';
  cart.forEach((cartItem) => {
      //Using the productID we can search for the product in the products.js and 
      //import their other details here

      const productId = cartItem.productId;

      //Using the product ID we can search for the product in the products.js
      const matchingProduct = getProduct(productId);
      const deliveryOptionId = cartItem.deliveryOptions;

      const deliveryOption = getDeliveryOption(deliveryOptionId);

      const today = dayjs();

      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

      const dateString = deliveryDate.format('dddd, MMMM D');

      cartSummaryHTML += `<div class="cart-item-container
              js-cart-item-container-${matchingProduct.id}">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src= ${matchingProduct.image}>

                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price">
                    ${matchingProduct.getPrice()}
                  </div>
                  <div class="product-quantity">
                    <span>
                      Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary">
                      Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link"
                    data-product-id = "${matchingProduct.id}">
                      Delete
                    </span>
                    <div class= "js-value-input"
                    data-product-id= ${matchingProduct.id}>
                    </div>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHTML(matchingProduct, cartItem)}              
                </div>
              </div>
            </div>`
            ;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem){
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();

      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString = deliveryOption.priceCents === 0 
      ? 'FREE' 
      : `$${formatCurrency(deliveryOption.priceCents)} - `;

    const isChecked = deliveryOption.id === cartItem.deliveryOptions;

    html +=  `<div class="delivery-option js-delivery-option"
                    data-product-id="${matchingProduct.id}"
                    data-delivery-option-id = "${deliveryOption.id}">
                    <input type="radio"
                      ${isChecked ? 'checked' : ''}
                      class="delivery-option-input"
                      name="delivery-option-${matchingProduct.id}">
                    <div>
                      <div class="delivery-option-date">
                        ${dateString}
                      </div>
                      <div class="delivery-option-price">
                        ${priceString}  Shipping
                      </div>
                    </div>
                  </div>`
    })
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
 
  //Delete link
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      document.querySelectorAll('.js-value-input').forEach((num) => {
        if(num.dataset.productId === productId){

          //Looking for the item in the cart to get the Quantity
          cart.forEach((item) => {
            if(item.productId === num.dataset.productId){
              num.innerHTML = `<input type="number" min="1" max="${item.quantity}" value="1" class='js-input-value'>
              <button class= 'js-enter-btn'> Enter </button>`;

              let enterButton = document.querySelector('.js-enter-btn');
              let itemValue = document.querySelector('.js-input-value');

              enterButton.addEventListener('click', () => {
                //console.log(Number(itemValue.value));
                const status = removeFromCart(productId, Number(itemValue.value));
                console.log(typeof status)
                //If it returns false, the container won't be removed
                if(status === 0){
                  const container = document.querySelector(`.js-cart-item-container-${productId}`);
                  container.remove();
                }
                num.innerHTML = '';
              })
            }
          })
          
        }
      })
      
      //After deleting the product from the cart, we updated the payment summary code
      renderPaymentSummary();
    });
  });


  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener(('click'), () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
};


