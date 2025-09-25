import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import '../data/cart-class.js' //This runs everything instead of importing
renderOrderSummary();
renderPaymentSummary();