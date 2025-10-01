import { loadProductsFetch } from "../data/products.js";
import { ordering } from './orderPage/ordering.js'

async function loadPage(){
    try{
        await loadProductsFetch()
    }
    catch(error){
        console.log('Unexpected eror')
    }

    ordering();
}

loadPage();

