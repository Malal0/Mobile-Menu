import { foodData } from '/data.js'
const menuitemsContainer = document.querySelector('#menu-items');
const menuOrders = [];
const ordersContainer = document.querySelector('#orders-container');
const orderTotalPriceEl = document.querySelector('#order-total-price');
const orderDetails = document.querySelector('#order-details');
const modal = document.querySelector('#modal');
const cardForm = document.querySelector('#card-form')
const thankYouMessage = document.querySelector('#thank-you-message');

menuitemsContainer.innerHTML = foodData.map(food => `
<div class='menu-item container'>
    <p class="item-emoji">${food.emoji}</p>
    <div class="item-info">
        <h3 class="item-title">${food.title}</h3>
        <p class="item-ingredients">${food.ingredients}</p>
        <p class="item-price">$${food.price}</p>
    </div>
    <div class='increment-container'>
        <button class="increment-btn" data-id=${food.emoji} data-action='subtract'>-</button>
        <input type="number" class="increment-input" id="${food.title}-input" data-action="input"  data-id=${food.emoji} placeholder='0' />
        <button class="increment-btn" data-id=${food.emoji} data-action='add'>+</button>
    </div>
</div>
`).join(' ');

document.addEventListener('click', documentClick);

cardForm.addEventListener('submit', handlePay);

const allInputs = document.querySelectorAll('input[type="number"]');
allInputs.forEach(input => input.addEventListener('input', changeObjQuantity))

function documentClick(e) {
    if (e.target.dataset.action) {
        handleIncrementBtn(e)
    } else if (e.target.id === 'completeOrderBtn') {
        handleCompleteOrder()
    } else if (e.target.id === 'payBtn') {
        handlePay()
    }
}

function handleIncrementBtn(e) {
    const action = e.target.dataset.action;
    if (action === 'add') {
        addFood(e)
    } else if (action === 'subtract') {
        subtractFood(e)
    } else if (action === 'remove') {
        removeOrder(e)
    }

    menuOrders.length ? orderDetails.classList.remove('hidden') : orderDetails.classList.add('hidden');
    renderOrders();
}

function addFood(e) {
    const item = getItem(e, foodData);
    if (!menuOrders.includes(item)) {
        menuOrders.unshift(item);
        item.quantity++
        changeInputValue(item)
    } else {
        menuOrders.map(order => {
            if (order.emoji === e.target.dataset.id) {
                order.quantity++
                changeInputValue(order)
            }
        })
    }

    if (!thankYouMessage.classList.contains('hidden')) {
        thankYouMessage.classList.add('hidden');
    }
}

function subtractFood(e) {
    const item = getItem(e, menuOrders);
    if (item) {
        item.quantity--;
        if (item.quantity === 0) {
            removeOrder(e)
        }
    }
    changeInputValue(item);
}

function removeOrder(e) {
    const item = getItem(e, menuOrders);
    item.quantity = 0;
    document.querySelector(`#${item.title}-input`).value = ''
    menuOrders.splice(menuOrders.indexOf(item), 1);
}

function changeObjQuantity(e) {
    const item = getItem(e, foodData);
    if (Number(e.target.value) > 0) {
        if (!menuOrders.includes(item)) {
            menuOrders.unshift(item);
            item.quantity = e.target.value;
        } else {
            item.quantity = e.target.value;
        }
    } else {
        e.target.value = ''
        if (menuOrders.includes(item)) {
            menuOrders.splice(menuOrders.indexOf(item), 1);
            item.quantity = 0;
        }
    }

    menuOrders.length ? orderDetails.classList.remove('hidden') : orderDetails.classList.add('hidden');
    if (!thankYouMessage.classList.contains('hidden')) {
        thankYouMessage.classList.add('hidden');
    }
    renderOrders();
}

function changeInputValue(obj) {
    document.querySelector(`#${obj.title}-input`).value = obj.quantity
}

function renderOrders() {
    ordersContainer.innerHTML = menuOrders.map(item =>
        `
        <div class="order">
            <h2 class="order-title">${item.title}</h2>
            <p>x ${item.quantity}</p>
            <button class="order-remove-btn" data-id=${item.emoji} data-action="remove">remove</button>
            <p class="order-price">$${item.price * item.quantity}</p>
        </div>
    `).join(' ');

    orderTotalPriceEl.innerHTML = getTotalPrice();
}

function getTotalPrice() {
    return menuOrders.reduce((total, item) =>
        total + (item.price * item.quantity)
        , 0);
}

function handleCompleteOrder() {
    modal.classList.remove('hidden')
}

function handlePay(e) {
    e.preventDefault();
    modal.classList.add('hidden');
    orderDetails.classList.add('hidden');
    thankYouMessage.classList.remove('hidden');

    //reset section
    document.querySelectorAll('input').forEach(input => input.value = '');
    menuOrders.map(order => order.quantity = 0);
    menuOrders.splice(0);
}

function getItem(event, arr) {
    return arr.filter(food => food.emoji === event.target.dataset.id)[0];
}