const balance = document.getElementById('balance');
const money_plus = document.getElementById('income');
const money_minus = document.getElementById('expense');
const list = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
// NEW: Select the category input and the chart
const categorySelect = document.getElementById('category');
const donutChart = document.querySelector('.donut-chart');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a description and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
            category: categorySelect.value // NEW: Save the category
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();
        updateChart(); // NEW: Update chart when data changes
        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const itemClass = transaction.amount < 0 ? 'expense-item' : 'income-item';

    const item = document.createElement('li');
    item.classList.add(itemClass);

    // NEW: Add the category name in the list item (small text)
    item.innerHTML = `
        <div style="display:flex; flex-direction:column;">
            <span>${transaction.text}</span>
            <small style="color:#888; font-size:12px;">${transaction.category}</small>
        </div>
        <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${expense}`;
}


function updateChart() {

    const expenses = transactions.filter(t => t.amount < 0);
    

    const totalExpense = expenses.reduce((acc, t) => acc + Math.abs(t.amount), 0);

    if (totalExpense === 0) {

        donutChart.style.background = `conic-gradient(#333 0% 100%)`;
        return;
    }


    const categories = {};
    expenses.forEach(t => {
        if (!categories[t.category]) categories[t.category] = 0;
        categories[t.category] += Math.abs(t.amount);
    });


    const colors = {
        'Food': '#e74c3c',       
        'Transport': '#3498db',  
        'Utilities': '#9b59b6',  
        'Shopping': '#f1c40f',   
        'Entertainment': '#e67e22', 
        'Other': '#95a5a6'       
    };


    let gradientStr = '';
    let currentDeg = 0;

    for (let cat in categories) {
        const percent = (categories[cat] / totalExpense) * 100;
        const color = colors[cat] || '#777';
        

        gradientStr += `${color} ${currentDeg}% ${currentDeg + percent}%, `;
        currentDeg += percent;
    }


    gradientStr = gradientStr.slice(0, -2);


    donutChart.style.background = `conic-gradient(${gradientStr})`;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
    updateChart(); 
}

form.addEventListener('submit', addTransaction);

init();

const legendContainer = document.querySelector('.chart-legend ul');

function updateLegend() {
    const expenses = transactions.filter(t => t.amount < 0);
    const categories = {};
    expenses.forEach(t => {
        if (!categories[t.category]) categories[t.category] = 0;
        categories[t.category] += Math.abs(t.amount);
    });

    const colors = {
        'Food': '#e74c3c', 'Transport': '#3498db', 'Utilities': '#9b59b6',
        'Shopping': '#f1c40f', 'Entertainment': '#e67e22', 'Other': '#95a5a6'
    };

    legendContainer.innerHTML = ''; 

    for (let cat in categories) {
        const color = colors[cat] || '#777';
        const li = document.createElement('li');
        li.innerHTML = `<span style="display:inline-block; width:12px; height:12px; background:${color}; border-radius:50%; margin-right:10px;"></span> ${cat}`;
        li.style.color = '#b0b0b0';
        li.style.marginBottom = '5px';
        legendContainer.appendChild(li);
    }
}
