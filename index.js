import { foodData } from '/data.js'

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
<button class="increment-btn" data-id=${food.emoji} data-action='add'>+</button>
</div>
`).join(' ');

const ordersContainer = document.querySelector('#orders-container');
const orderTotalPriceEl = document.querySelector('#order-total-price');
const orderDetails = document.querySelector('#order-details');

document.addEventListener('click', documentClick);

function documentClick(e) {
    console.log(e.target)
    if (e.target.dataset.action) {
        handleIncrementBtn(e)
    }
}

function handleIncrementBtn(e) {
    const action = e.target.dataset.action;
    if (action === 'add') {
        addFood(e)
    } else if (action === 'remove') {
        subtractFood(e)
    }
    menuOrders.length ? orderDetails.classList.remove('hidden') : orderDetails.classList.add('hidden');
    renderOrders();
    console.log(orderDetails.classList)
}

function addFood(e) {
    const item = foodData.filter(food => food.emoji === e.target.dataset.id)[0];
    menuOrders.push(item);
}

function subtractFood(e) {
    const item = foodData.filter(food => food.emoji === e.target.dataset.id)[0];
    menuOrders.splice(menuOrders.indexOf(item), 1);
    console.log(menuOrders);
}

function renderOrders() {
    ordersContainer.innerHTML = menuOrders.map(item =>
        `
        <div class="order">
            <h2 class="order-title">${item.title}</h2>
            <button class="order-remove-btn" data-id=${item.emoji} data-action="remove">remove</button>
            <p class="order-price">$${item.price}</p>
        </div>
    `).join(' ');

    orderTotalPriceEl.innerHTML = getTotalPrice();
}

function getTotalPrice() {
    return menuOrders.reduce((total, item) =>
        total + item.price
        , 0);
}