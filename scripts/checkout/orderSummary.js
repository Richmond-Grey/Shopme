// Importing functions, data, and utilities from other modules
import { cart, removeFromCart, updateCart, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js'; // Example external lib
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'; // Date formatting library
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';


// Function to render the entire cart/order summary on the page
export function renderOrderSummary() {
  let cartSummaryHTML = '';

  // Loop through each item in the cart
  cart.forEach((cartItem) => {
      // Each cart item has a productId, use it to fetch the product details
      const productId = cartItem.productId;
      const matchingProduct = getProduct(productId);

      // Get delivery option details for the current cart item
      const deliveryOptionId = cartItem.deliveryOptions;
      const deliveryOption = getDeliveryOption(deliveryOptionId);

      // Calculate estimated delivery date using dayjs
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D'); // e.g., "Monday, July 1"

      // Build up HTML for each cart item
      cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
          <div class="delivery-date">
            Delivery date: ${dateString}
          </div>

          <div class="cart-item-details-grid">
            <!-- Product image -->
            <img class="product-image" src="${matchingProduct.image}">

            <!-- Product details: name, price, quantity -->
            <div class="cart-item-details">
              <div class="product-name">${matchingProduct.name}</div>
              <div class="product-price">${matchingProduct.getPrice()}</div>

              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
                </span>

                <!-- Update/Delete buttons for each product -->
                <span class="update-quantity-link link-primary js-update-link"
                  data-product-id="${matchingProduct.id}">
                  Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-link"
                  data-product-id="${matchingProduct.id}">
                  Delete
                </span>

                <!-- Placeholder for input fields (e.g. when updating/deleting) -->
                <div class="js-value-input" data-product-id="${matchingProduct.id}"></div>
              </div>
            </div>

            <!-- Delivery option radio buttons -->
            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              ${deliveryOptionsHTML(matchingProduct, cartItem)}              
            </div>
          </div>
        </div>`;
  });


  // Function to build HTML for the delivery options (radio buttons)
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      // Calculate estimated date for each option
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      // Free or paid shipping
      const priceString = deliveryOption.priceCents === 0 
        ? 'FREE' 
        : `$${formatCurrency(deliveryOption.priceCents)} - `;

      // Mark the selected option as checked
      const isChecked = deliveryOption.id === cartItem.deliveryOptions;

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>`;
    });
    return html;
  }

  // Render the full HTML inside the container
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
 

  // ---------------- DELETE FUNCTIONALITY ----------------
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      // Find the placeholder div for this product
      document.querySelectorAll('.js-value-input').forEach((num) => {
        if (num.dataset.productId === productId) {
          // Get the cart item to know how many can be deleted
          cart.forEach((item) => {
            if (item.productId === num.dataset.productId) {
              // Add input and button for custom quantity deletion
              num.innerHTML = `
                <input type="number" min="1" max="${item.quantity}" value="1" class="js-input-value">
                <button class="js-enter-btn">Enter</button>`;

              let enterButton = document.querySelector('.js-enter-btn');
              let itemValue = document.querySelector('.js-input-value');

              // Handle delete action
              enterButton.addEventListener('click', () => {
                const status = removeFromCart(productId, Number(itemValue.value));

                // If quantity becomes 0, remove the whole product container
                if (status === 0) {
                  const container = document.querySelector(`.js-cart-item-container-${productId}`);
                  container.remove();
                }

                // Reset input field
                num.innerHTML = '';
              });
            }
          });
        }
      });

      // Always update payment summary after deletion
      renderPaymentSummary();
    });
  });


  // ---------------- UPDATE FUNCTIONALITY ----------------
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const updateProductID = link.dataset.productId;

      // Show input field to add new quantity
      document.querySelectorAll('.js-value-input').forEach((num) => {
        if (num.dataset.productId === updateProductID) {
          num.innerHTML = `
            <input type="number" min="1" max="100" value="1" class="js-input-value">
            <button class="js-enter-btn">Add</button>`;

          let enterButton = document.querySelector('.js-enter-btn');
          let itemValue = document.querySelector('.js-input-value');

          // Handle update action
          enterButton.addEventListener('click', () => {
            updateCart(updateProductID, Number(itemValue.value));
            num.innerHTML = ''; // Reset input
          });
        }
      });

      // Update payment summary after quantity update
      renderPaymentSummary();
    });
  });


  // ---------------- DELIVERY OPTION FUNCTIONALITY ----------------
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;

      // Update delivery option in the cart
      updateDeliveryOption(productId, deliveryOptionId);

      // Re-render summary + payment summary to reflect new delivery choice
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
