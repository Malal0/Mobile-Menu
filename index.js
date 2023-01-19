import { foodData } from '/data.js'
console.log(foodData); // delete soon
const menuitemsContainer = document.querySelector('#menu-items');

const menuOrders = [];

menuitemsContainer.innerHTML = foodData.map(food => `
<div class='menu-item container'>
<p class="item-emoji">${food.emoji}</p>
<div class="item-info">
<h3 class="item-title">${food.title}</h3>
<p class="item-ingredients">${food.ingredients}</p>
<p class="item-price">$${food.price}</p>
</div>
<button class="increment-btn" data-id=${food.emoji}>+</button>
</div>
`).join(' ');

const ordersContainer = document.querySelector('#orders-container');
const addFoodBtns = document.querySelectorAll('button[class="increment-btn"]');

addFoodBtns.forEach(btn => {
    btn.addEventListener("click", addFood)
})

function addFood(e) {
    // console.log(e.target.dataset.id)
    const item = foodData.filter(food => food.emoji === e.target.dataset.id)[0];
    menuOrders.push(item);
    console.log(menuOrders)
    renderOrders();
}

function renderOrders() {
    ordersContainer.innerHTML = menuOrders.map(item =>
        `
        <div class="order">
            <h2 class="order-title">${item.title}</h2>
            <button class="order-remove-btn">remove</button>
            <p class="order-price">$${item.price}</p>
        </div>
    `).join(' ');
}