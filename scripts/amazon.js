// Importing dependencies and data modules
import { cart, addToCart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.esm.js";

// Load all products first, then run the render function
loadProducts(renderProductsGrid);


/* 
-------------------------------------
 SEARCH FUNCTION
-------------------------------------
This function handles the search logic.
It takes in:
  - item: the text the user typed
  - url: the current page URL
It uses Fuse.js for fuzzy searching, so users can find results even with small typos.
*/
export function search(item, url) {
  let results;

  // Check if we’re not already on the same page
  if (!(window.location.href === url)) {

    // If the search box is empty (no item typed)
    if (item === '') {

      // Fuse.js options — what fields to search through and how strict to be
      const options = {
        keys: ["name", "keywords"], // The fields we’ll search in each product
        threshold: 0.4 // Lower = more strict, higher = more fuzzy matches
      };

      // Initialize Fuse with our products and options
      const fuse = new Fuse(products, options);

      // Perform the search (in this case, empty search)
      const result = fuse.search(item);

      console.log(result);

      // Extract the matched items only
      const matches = result.map(r => r.item);
      console.log(matches);

      // Store matches in results
      results = matches;
    } 
    
    // If the user typed something
    else {
      const options = {
        keys: ["name", "keywords"],
        threshold: 0.4
      };

      const fuse = new Fuse(products, options);

      // Search using Fuse.js
      const result = fuse.search(item);
      console.log(result);

      const matches = result.map(r => r.item);
      console.log(matches);

      // If nothing matches, tell renderProductsGrid() to clear results
      if (matches.length === 0) {
        results = 'clear';
      } else {
        results = matches;
      }
    }
  }

  return results;
}



/*
-------------------------------------
 RENDER PRODUCTS GRID
-------------------------------------
This function:
  - Displays all the products on the page
  - Handles search input (both pressing Enter and clicking the icon)
  - Updates cart quantity
  - Adds "Add to cart" functionality
*/
function renderProductsGrid() {

  // Get the search bar element
  const searching = document.querySelector('.js-search-bar');

  // Retrieve the last search result stored in localStorage (if any)
  let searchItem = JSON.parse(localStorage.getItem('searchItem')) || [];

  // Listen for Enter key in the search bar
  searching.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {

      // Create a new URL with the search value as a query parameter
      const url = new URL(window.location.href);
      url.searchParams.set('search', searching.value);

      // Navigate to that new URL
      window.location.href = url;

      // Run search() and save the result
      searchItem = search(searching.value, url);
      console.log(`Everyone knows the ${searchItem}`);

      // Save search results in localStorage
      localStorage.setItem('searchItem', JSON.stringify(searchItem));

      // Rerender products with the new search result
      renderProductsGrid();
    }
  });


  // When user clicks the search icon instead of pressing Enter
  const searchIcon = document.querySelector('.js-search-icon');
  searchIcon.addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('search', searching.value);
    window.location.href = url;

    searchItem = search(searching.value, url);
    console.log(`Everyone knows the ${searchItem}`);

    localStorage.setItem('searchItem', JSON.stringify(searchItem));
    renderProductsGrid();
  });



  // Start building the HTML for products
  let productsHTML = '';

  /* 
  If the search result was 'clear', show "Item not found"
  But make sure we’re not on the home page
  */
  if (searchItem === 'clear' && window.location.href !== 'http://127.0.0.1:5500/amazon.html') {
    productsHTML = 'Item not found';
  }

  /* 
  If no search was made, or if it’s the homepage, show all products.
  */
  else if (!searchItem || searchItem.length === 0 || window.location.href === 'http://127.0.0.1:5500/amazon.html') {
    products.forEach((product) => {

      // Build each product card
      productsHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image" src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars" src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-item-quantity" data-product-id="${product.id}">
              ${Array.from({length: 10}, (_, i) => `<option value="${i+1}" ${i===0 ? 'selected' : ''}>${i+1}</option>`).join('')}
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart" data-product-id="${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      `;
    });
    console.log('Everything is out');
    console.log(`Here is our ${searchItem}`);
  }

  /* 
  If there *is* a search result, show only those products.
  */
  else {
    productsHTML = '';

    products.forEach((product) => {
      searchItem.forEach((search) => {

        if (product.id === search.id) {
          productsHTML += `
            <div class="product-container">
              <div class="product-image-container">
                <img class="product-image" src="${product.image}">
              </div>

              <div class="product-name limit-text-to-2-lines">
                ${product.name}
              </div>

              <div class="product-rating-container">
                <img class="product-rating-stars" src="${product.getStarsUrl()}">
                <div class="product-rating-count link-primary">
                  ${product.rating.count}
                </div>
              </div>

              <div class="product-price">
                ${product.getPrice()}
              </div>

              <div class="product-quantity-container">
                <select class="js-item-quantity" data-product-id="${product.id}">
                  ${Array.from({length: 10}, (_, i) => `<option value="${i+1}" ${i===0 ? 'selected' : ''}>${i+1}</option>`).join('')}
                </select>
              </div>

              ${product.extraInfoHTML()}

              <div class="product-spacer"></div>

              <div class="added-to-cart js-added-to-cart" data-product-id="${product.id}">
                <img src="images/icons/checkmark.png">
                Added
              </div>

              <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                Add to Cart
              </button>
            </div>
          `;
        }

      });
    });
  }


  // Finally, inject the HTML into the page
  document.querySelector('.js-products-grid').innerHTML = productsHTML;



  /*
  -------------------------------------
   UPDATE CART QUANTITY FUNCTION
  -------------------------------------
  Adds up all quantities in the cart array and shows it in the cart icon.
  */
  function updateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((item) => {
      cartQuantity += item.quantity;
      document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
    });

    console.log(cart);
  }

  updateCartQuantity();



  /*
  -------------------------------------
   ADD TO CART FUNCTIONALITY
  -------------------------------------
  For every "Add to Cart" button:
    - Gets product ID
    - Reads selected quantity
    - Adds it to the cart
    - Shows "Added" confirmation briefly
    - Updates cart counter
  */
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;

      // Find the selected quantity for this product
      document.querySelectorAll('.js-item-quantity').forEach((selector) => {
        if (selector.dataset.productId === productId) {
          let value = Number(selector.value);
          addToCart(productId, value);
        }
      });

      // Show "Added" animation for that product
      document.querySelectorAll('.js-added-to-cart').forEach((selector) => {
        if (selector.dataset.productId === productId) {
          console.log(selector.dataset.productId);
          selector.style.opacity = 1;

          // Hide the text again after 1.5 seconds
          setTimeout(() => {
            selector.style.opacity = 0;
          }, 1500);
        }
      });

      // Update the cart counter
      updateCartQuantity();
    });
  });
}
