export const deliveryOptions = [
    {
        id: '1',
        deliveryDays: 7,
        priceCents: 0
    },
    {
        id: '2',
        deliveryDays: 3,
        priceCents: 499
    },
    {
        id: '3',
        deliveryDays: 1,
        priceCents: 999
    }

];

export function getDeliveryOption(deliveryOptionId){
     let deliveryOption;

      //Using the delivery option ID we can search for the delivery option in the deliveryOptions.js
      deliveryOptions.forEach((option) => {
        if(option.id === deliveryOptionId){
        deliveryOption = option;
          }
        });

      return deliveryOption || deliveryOptions[0];
}