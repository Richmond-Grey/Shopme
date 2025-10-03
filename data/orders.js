import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'; // Date formatting library
export const orders = JSON.parse(localStorage.getItem('orders')) || [];



export function addOrder(order) {
    //Add the new order to the beginning of the array
    orders.unshift(order);
    saveToStorage();
    
}

export function pd(){
    console.log(5555);
}



export function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}