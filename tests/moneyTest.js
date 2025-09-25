import { formatCurrency } from "../scripts/utils/money.js";

if (formatCurrency(2095) === "20.95") {
    console.log("Money test passed");
}
else{
    console.log("Money test failed");
}