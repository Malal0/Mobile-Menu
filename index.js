import { foodData } from '/data.js'

const menuitemsContainer = document.querySelector('#menu-items');

const menuOrders = [];

const ordersContainer = document.querySelector('#orders-container');
const orderTotalPriceEl = document.querySelector('#order-total-price');
const orderDetails = document.querySelector('#order-details');
const modal = document.querySelector('#modal');
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
    const item = foodData.filter(food => food.emoji === e.target.dataset.id)[0];

    // add object only if the menuOrders array doesn't include or contain the object
    if (!menuOrders.includes(item)) {
        menuOrders.unshift(item);
        item.quantity++
        changeInputValue(item)
    } else {
        // increase the the object quantity by 1
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
    const item = menuOrders.filter(food => food.emoji === e.target.dataset.id)[0];
    if (item) {
        item.quantity--;
        if (item.quantity === 0) {
            removeOrder(e)
        }
    }
    changeInputValue(item);
}

function removeOrder(e) {
    const item = menuOrders.filter(food => food.emoji === e.target.dataset.id)[0];
    item.quantity = 0;
    changeInputValue(item);
    menuOrders.splice(menuOrders.indexOf(item), 1);
}

function changeObjQuantity(e) {
    const item = foodData.filter(food => food.emoji === e.target.dataset.id)[0];

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

    /*
    if the e.target.value is greater than 0
        if the item doesn't exist in the menuOrder
            then add the item to the menuOrder array
            then update the item.quantity to the e.target.value
        else
            then update the item.quantity to the e.target.value
    else
        then make the value of the input an empty string ""
        if the item doesn't exist in the menuOrder
            return
        else
            then the item is to be removed
            it's quantity is set to 0
    */
    menuOrders.length ? orderDetails.classList.remove('hidden') : orderDetails.classList.add('hidden');
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

function handlePay() {
    modal.classList.add('hidden');
    orderDetails.classList.add('hidden');
    thankYouMessage.classList.remove('hidden');

    menuOrders = [];
    renderOrders();
}