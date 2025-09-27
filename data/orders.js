export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
    //Add the new order to the beginning of the array
    orders.unshift(order);
    saveToStorage();
    
}

export function pd(){
    console.log(5555);
}



function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}