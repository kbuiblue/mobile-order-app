import { menuArray } from "/data.js"

const foodList = document.getElementById("food-list")
const orderSummary = document.getElementById("order-summary")
const orderDetails = document.getElementById("order-details")
const orderTotal = document.getElementById("order-total")
const paymentDetails = document.getElementById("payment-details")
const inputForm = document.getElementById("input-form")
const orderCompleted = document.getElementById("order-completed")
const completedMsg = document.getElementById("completed-msg")

const subtotalsAndAmounts = new Map()
const itemsCart = []

let totalPrice = 0

function renderFood(food) {
    const foodItem = `<div class="food-container">
                        <div class="food-option">
                        <img class="food-img" src="${food.src}">
                        <div class="food-info">
                            <h3>${food.name}</h3>
                            <p class="food-ingredients">${food.ingredients.join(', ')}</p>
                            <p>\$${food.price}</p>
                      </div>
                      <button class="add-btn" data-id="${food.id}">+</button>
                      </div>`
                      
    foodList.innerHTML += foodItem
}

function renderOrderItem(food, amount) {
  return `<div class="order-item" data-id="${food.id}">
            <div class="name-and-amount">
              <h3>${food.name}</h3>
              <div class="adjust-amount">
                <button class="plus-btn" data-id="${food.id}">+</button>
                <h4 class="food-amount" data-id="${food.id}">${amount}</h4>
                <button class="minus-btn" data-id="${food.id}">-</button>
              </div>
            </div>
            <p class="subtotal" data-id="${food.id}">\$${food.price * amount}</p>
          </div>`;
}

function renderTotalPrice(totalPrice) {
  return `<div id="total-container">
            <h3>Total price: </h3>
            <p class="total-price">\$${totalPrice}</p>
          </div>`;
}

function renderFoodBaseOnAmount(food) {
    const orderItemEl = document.querySelector(`.order-item[data-id="${food.id}"]`);
        
        //render food type when amount is > 0 and vice versa
        if (subtotalsAndAmounts.get(food.id).amount > 0) {
        orderItemEl.style.display = "flex"; // Set display to 'flex' when amount is greater than 0

        // Update the food amount
        const foodAmountEl = orderItemEl.querySelector(`.food-amount[data-id="${food.id}"]`);
        foodAmountEl.textContent = subtotalsAndAmounts.get(food.id).amount;
        
        // Update the subtotal
        const subtotalEl = orderItemEl.querySelector(`.subtotal[data-id="${food.id}"]`);
        subtotalEl.textContent = `$${food.price * subtotalsAndAmounts.get(food.id).amount}`;
        } else {
          orderItemEl.style.display = "none";
        }
}

function renderCart(addClick) {
  //iterate through menuArray to find food with matching Id
  menuArray.forEach(function (food) {
    if (food.id === Number(addClick.dataset.id)) {
      //check if the cart already has a type of food in it
      if (!subtotalsAndAmounts.has(food.id)) {
        //adding new food type into hashmap to keep track
        const subtotalAndAmount = {
          subtotal: `${food.price}`,
          amount: 1
        };

        subtotalsAndAmounts.set(food.id, subtotalAndAmount);
        totalPrice += food.price;

        orderDetails.innerHTML += renderOrderItem(food, subtotalAndAmount.amount);
        orderTotal.innerHTML = renderTotalPrice(totalPrice);
        orderSummary.style.visibility = "visible";
      } else {
        //the type of food has already been added
        let newSubtotal;
        
        //check if button click is adding or subtracting items
        if (
          addClick.classList.contains("plus-btn") ||
          addClick.classList.contains("add-btn")
        ) {
          newSubtotal = Number(subtotalsAndAmounts.get(food.id).subtotal) + food.price;
          subtotalsAndAmounts.get(food.id).amount++;
          totalPrice += food.price;
        } else if (addClick.classList.contains("minus-btn")) {
          newSubtotal = Number(subtotalsAndAmounts.get(food.id).subtotal) - food.price;
          subtotalsAndAmounts.get(food.id).amount--;
          totalPrice -= food.price;
        }
        //update subtotal according to button click
        subtotalsAndAmounts.get(food.id).subtotal = newSubtotal;
        renderFoodBaseOnAmount(food)
        
        //update order total
        orderTotal.innerHTML = renderTotalPrice(totalPrice);
        hideCartWhenAmountIsZero()
      }
      return;
    }
  });
}

function hideCartWhenAmountIsZero() {
    const itemsInCart = [...subtotalsAndAmounts.values()].some(
          (item) => item.amount > 0
        );

    if (itemsInCart) {
        orderSummary.style.visibility = "visible";
    } else {
        orderSummary.style.visibility = "hidden";
    }
}

document.addEventListener("click", function(e){
    if(e.target.dataset.id) {
        renderCart(e.target)
    } else if (e.target.id === "order-btn") {
        paymentDetails.style.display = "flex"
        // paymentDetails.style.position = "fixed"
    }
})

inputForm.addEventListener('submit', function(e){
    e.preventDefault()
    const inputFormData = new FormData(inputForm)
    const customerName = inputFormData.get("name")
    
    paymentDetails.style.display = "none"
    orderSummary.style.display = "none"
    orderCompleted.style.display = "flex"
    completedMsg.textContent = `Thanks, ${customerName}! Your order is on its way!`
    
})

menuArray.forEach(function(food){
    renderFood(food)
})