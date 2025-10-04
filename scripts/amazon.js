
import { formatCurrency } from './utils/money.js';
import {cart, addToCart, permanentCart} from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { orders } from '../data/orders.js';
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.esm.js";


loadProducts(renderProductsGrid);

export function search(item, url){
  let results;

  //Checking if the item is empty so we can return the main page and if product isn't found we return another page
  
        //Checking if we are in the new page

      if(!(window.location.href === url)){
          if(item === ''){
                //Configuring fuse
              const options = {
                keys: ["name", "keywords"],
                threshold: 0.4
              };

              const fuse = new Fuse(products, options);

              //Searching
              const result = fuse.search(item);

              console.log(result)

              //Extract items
              const matches = result.map(r => r.item);
              console.log(matches);
              results = matches
          }
           
      
  

          else{
              //Configuring fuse
                    const options = {
                      keys: ["name", "keywords"],
                      threshold: 0.4
                    };

                    const fuse = new Fuse(products, options);

                    //Searching
                    const result = fuse.search(item);

                    console.log(result)

                    //Extract items
                    const matches = result.map(r => r.item);
                    console.log(matches);
                    if(matches.length === 0){
                      results = 'clear'
                    }
                    else{
                      results = matches
                    }
                    
            }

}
 

  return results
  
}
function renderProductsGrid(){
  //Working on search function 
  const searching = document.querySelector('.js-search-bar')

  let searchItem = JSON.parse(localStorage.getItem('searchItem')) || [];

  searching.addEventListener('keydown', (event) => {
    if(event.key === "Enter"){
      
      //Now placing item in the url as a param
      const url = new URL(window.location.href);
      url.searchParams.set('search', searching.value);
      window.location.href = url;
      searchItem = search(searching.value, url);
      console.log(`Everyone knows the ${searchItem}`);

      //Saving searchitem in localstorage

      localStorage.setItem('searchItem', JSON.stringify(searchItem));
      renderProductsGrid()
    }
  })

  //Making the search icon work as well

  const searchIcon = document.querySelector('.js-search-icon');
  searchIcon.addEventListener('click', () => {
    //Now placing item in the url as a param
      const url = new URL(window.location.href);
      url.searchParams.set('search', searching.value);
      window.location.href = url;
      searchItem = search(searching.value, url);
      console.log(`Everyone knows the ${searchItem}`);

      //Saving searchitem in localstorage

      localStorage.setItem('searchItem', JSON.stringify(searchItem));
      renderProductsGrid()
  })
  
  
  // Storing the details of the products in an array
  let productsHTML = '';
  // Creating HTML for each product

  //Adding second condition because when item is not found and we return to the main page, item not found still pops up
  if(searchItem === 'clear' && window.location.href !== 'http://127.0.0.1:5500/amazon.html'){
    productsHTML = 'Item not found'
  }
  //Now for all the products to load the site first have to follow all these rules
  else if(!searchItem || searchItem.length === 0 || window.location.href === 'http://127.0.0.1:5500/amazon.html'){
      products.forEach((product) => {
        productsHTML += `<div class="product-container">
              <div class="product-image-container">
                <img class="product-image"
                  src="${product.image}">
              </div>

              <div class="product-name limit-text-to-2-lines">
                ${product.name}
              </div>

              <div class="product-rating-container">
                <img class="product-rating-stars"
                  src="${product.getStarsUrl()}">
                <div class="product-rating-count link-primary">
                  ${product.rating.count}
                </div>
              </div>

              <div class="product-price">
                ${product.getPrice()}
              </div>

              <div class="product-quantity-container">
                <select class="js-item-quantity"
                data-product-id= ${product.id}>
                  <option selected value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>
              ${product.extraInfoHTML()}
              <div class="product-spacer"></div>

              <div class="added-to-cart js-added-to-cart"
              data-product-id = "${product.id}">
                <img src="images/icons/checkmark.png">
                Added
              </div>

              <button class="add-to-cart-button button-primary js-add-to-cart"
              data-product-id = "${product.id}">
                Add to Cart
              </button>
            </div>
    `;

    })
    console.log('Everything is out')
    console.log(`Here is our ${searchItem}`)
  }
  
  else{
    productsHTML = ''
    products.forEach((product) => {
      searchItem.forEach((search) => {
        if(product.id === search.id){
            productsHTML += `<div class="product-container">
                <div class="product-image-container">
                  <img class="product-image"
                    src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                  ${product.name}
                </div>

                <div class="product-rating-container">
                  <img class="product-rating-stars"
                    src="${product.getStarsUrl()}">
                  <div class="product-rating-count link-primary">
                    ${product.rating.count}
                  </div>
                </div>

                <div class="product-price">
                  ${product.getPrice()}
                </div>

                <div class="product-quantity-container">
                  <select class="js-item-quantity"
                  data-product-id= ${product.id}>
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>
                ${product.extraInfoHTML()}
                <div class="product-spacer"></div>

                <div class="added-to-cart js-added-to-cart"
                data-product-id = "${product.id}">
                  <img src="images/icons/checkmark.png">
                  Added
                </div>

                <button class="add-to-cart-button button-primary js-add-to-cart"
                data-product-id = "${product.id}">
                  Add to Cart
                </button>
              </div>
      `;
        }
      })
    })
  }
  // Adding the HTML to the page
  document.querySelector('.js-products-grid').innerHTML = productsHTML

//Updating the cart
  function updateCartQuantity(){
    let cartQuantity = 0;

      // Calculate the total quantity of items in the cart
      cart.forEach((item) => {
          cartQuantity += item.quantity;
          document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
          
      });

      console.log(cart);
  }

  updateCartQuantity();

  //Adding stuff to the cart
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      
      document.querySelectorAll('.js-item-quantity').forEach((selector) => {
        //Getting the quantity of the item
        if(selector.dataset.productId === productId){
          let value = Number(selector.value)
          addToCart(productId, value);
        }
      });
      
      document.querySelectorAll('.js-added-to-cart').forEach((selector) => {
        
        if(selector.dataset.productId === productId){
          console.log(selector.dataset.productId);
          //changing the css
          selector.style.opacity = 1;

          setTimeout(() => {
            selector.style.opacity = 0;
          }, 1500);
        }
      })

     
      updateCartQuantity();

      
    });
  });


}