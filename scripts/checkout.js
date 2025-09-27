import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
//import '../data/cart-class.js' //This runs everything instead of importing
//import '../data/backend-practice.js'
import { loadProductsFetch, loadProducts } from "../data/products.js"; 

async function loadPage(){
    try{
        await loadProductsFetch();
    } catch (error) {
        console.log('Unexpected error. Please try again later');
    }
    
    renderOrderSummary();
    renderPaymentSummary();
}
loadPage();
/*
loadProductsFetch().then(() => {
    renderOrderSummary();
    renderPaymentSummary();
})
*/
/*
loadProducts(() => {
    renderOrderSummary();
    renderPaymentSummary();
});

*/