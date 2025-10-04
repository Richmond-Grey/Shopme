// Importing everything we need from different modules

// 'orders' is an array of all orders made by the user.
// 'saveToStorage' saves the updated orders array to local storage.
import { orders, saveToStorage } from '../../data/orders.js'

// 'products' contains all available products, while 'getProduct' retrieves a specific product by its ID.
import { products, getProduct } from '../../data/products.js';

// 'cart' is the current shopping cart,
// 'clearCart' empties it,
// 'addToPermanentCart' saves purchased items permanently (for reordering),
// 'permanentCart' holds those saved items.
import { cart, clearCart, addToPermanentCart, permanentCart } from '../../data/cart.js'

// DayJS is a date formatting library — this version is imported from a CDN link.
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// This helps us display prices properly (e.g. converts 1200 cents → $12.00)
import { formatCurrency } from '../utils/money.js';

// Used to find the shipping/delivery details of a product
import { getDeliveryOption } from '../../data/deliveryOptions.js';


/*
  getItem(orderItem)
  ------------------
  This function builds the HTML for every single product inside one order.
  It loops through all products in the given order and creates a grid
  showing product image, name, delivery date, quantity, and action buttons.
*/
function getItem(orderItem) {
    let gridHTML = ''; // We'll collect all product HTML here

    // Go through each product in the current order
    orderItem.products.forEach((product) => {
        let dateString = ''; // This will hold the delivery date (formatted nicely)

        // Loop through all permanently saved cart items
        // to find the delivery date of this product
        permanentCart.forEach((permItem) => {
            // Check if the product IDs match
            if (product.productId === permItem.id) {
                let date = permItem.delivery; // Get delivery date from permanent cart
                // Format date like "October, 5"
                dateString = dayjs(date).format("MMMM, D");
            }
        });

        // Get the product details (name, image, price, etc.)
        const matchingProduct = getProduct(product.productId);

        // Add a section for each product to our HTML
        gridHTML += `
          <div class="product-image-container">
            <img src="${matchingProduct.image}">
          </div>

          <div class="product-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-delivery-date">Arriving on: ${dateString}</div>
            <div class="product-quantity">Quantity: ${product.quantity}</div>

            <!-- Button to buy this product again -->
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <!-- Link to tracking page for this product -->
            <a href="tracking.html?orderId=${orderItem.id}&productId=${product.productId}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        `;
    });

    return gridHTML; // Return all the HTML for this order’s items
}


/*
  ordering()
  ----------
  This function builds the entire orders page.
  It loops through all the orders and displays them on the page,
  showing their details (date, total, ID) and all products they contain.
*/
export function ordering() {
    let orderHTML = ''; // We'll store all the generated HTML here

    // Go through every order in our 'orders' array
    orders.forEach((orderItem) => {

        // Only render orders that actually have products inside them
        if (orderItem.products.length !== 0) {
            console.log(orderItem); // (Optional) log order to the console for debugging

            // Add HTML for each order
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
              </div>
            `;

            // Update the HTML on the page
            document.querySelector('.js-orders-grid').innerHTML = orderHTML;
        }
        else {
            // If the order is empty (no products), remove it completely
            orders.splice(orders.indexOf(orderItem), 1);
            // Save updated list of orders to storage
            saveToStorage();
        }
    });
}
