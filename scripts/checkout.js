import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
//import '../data/cart-class.js' //This runs everything instead of importing
//import '../data/backend-practice.js'
import { loadProductsFetch, loadProducts } from "../data/products.js"; 

loadProductsFetch().then(() => {
    renderOrderSummary();
    renderPaymentSummary();
})

/*
loadProducts(() => {
    renderOrderSummary();
    renderPaymentSummary();
});

*/