import { foodData } from '/data.js'
console.log(foodData);
const menuitemsContainer = document.querySelector('#menu-items');

menuitemsContainer.innerHTML = foodData.map(food => `
    <div class='menu-item'>
        <p class="item-emoji">${food.emoji}</p>
        <div class="item-info">
            <h3 class="item-title">${food.title}</h3>
            <p class="item-ingredients">${food.ingredients}</p>
            <p class="item-price">$${food.price}</p>
        </div>
        <button class="increment-btn">+</button>
    </div>
`).join(' ');