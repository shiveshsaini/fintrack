const tableBody = document.getElementById('history-table-body');
const searchInput = document.querySelector('.search-container input');
const filterBtns = document.querySelectorAll('.btn-filter');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function init() {
    renderTable(transactions);
    setupEventListeners();
}

function renderTable(data) {
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#888;">No transactions found</td></tr>';
        return;
    }

    data.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const type = transaction.amount < 0 ? 'Expense' : 'Income';
        const typeClass = transaction.amount < 0 ? 'type-expense' : 'type-income';
        const amountClass = transaction.amount < 0 ? 'amount-expense' : 'amount-income';
        
        // Using current date as placeholder since we haven't saved dates yet
        const date = new Date().toLocaleDateString(); 

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
            <td>${transaction.text}</td>
            <td class="${typeClass}">${type}</td>
            <td class="${amountClass}">${sign}$${Math.abs(transaction.amount).toFixed(2)}</td>
        `;

        tableBody.appendChild(row);
    });
}

function setupEventListeners() {
    // Search Functionality
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = transactions.filter(item => 
            item.text.toLowerCase().includes(term)
        );
        renderTable(filtered);
    });

    // Filter Buttons Functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterType = btn.innerText;

            if (filterType === 'All') {
                renderTable(transactions);
            } else if (filterType === 'Income') {
                const incomeOnly = transactions.filter(item => item.amount > 0);
                renderTable(incomeOnly);
            } else if (filterType === 'Expense') {
                const expenseOnly = transactions.filter(item => item.amount < 0);
                renderTable(expenseOnly);
            }
        });
    });
}

init();