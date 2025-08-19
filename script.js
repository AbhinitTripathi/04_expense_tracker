document.addEventListener("DOMContentLoaded", () => {
    // Sallary Allocation Form
    const salaryForm = document.getElementById("salary-form");
    const salaryInput = document.getElementById("salary-input");
    const setButton = document.querySelector(
        "#salary-form button[type='submit']"
    );
    const resetButton = document.querySelector(
        "#salary-form button[type='button']"
    );
    const allocations = document.getElementById("allocations");

    // Load saved salary if available
    let salary = JSON.parse(localStorage.getItem("salary")) || 0;
    if (salary) {
        renderAllocations(salary);
    }

    // Add event listener to the salary form and reset
    salaryForm.addEventListener("click", (e) => {
        if (e.target === setButton) {
            e.preventDefault();
            salary = salaryInput.value.trim();

            if (salary > 0) {
                saveSalaryToLocalStorage(salary);
                renderAllocations(salary);
            }

            salaryForm.reset();
        } else if (e.target === resetButton) {
            removeSalaryFromLocalStorage();
            allocations.innerHTML = "";
            salary = null;
        }
    });

    // Functions for Salary Alocation
    function saveSalaryToLocalStorage(newSalary) {
        localStorage.setItem("salary", JSON.stringify(newSalary));
    }

    function removeSalaryFromLocalStorage() {
        localStorage.removeItem("salary");
    }

    function renderAllocations(salary) {
        const needs = salary * 0.5;
        const wants = salary * 0.3;
        const investments = salary * 0.2;

        allocations.innerHTML = `
            <div class="card">Needs: ₹${needs.toFixed(2)}</div>
            <div class="card">Wants: ₹${wants.toFixed(2)}</div>
            <div class="card">Investments: ₹${investments.toFixed(2)}</div>
        `;
    }

    // Expense Tracker Form
    const expenseForm = document.getElementById("expense-form");
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseList = document.getElementById("expense-list");
    const totalAmountDisplay = document.getElementById("total-amount");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let totalAmount = calculateTotal();
    renderExpenses();
    updateTotal();

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim());
        const type = document.querySelector(
            'input[name="expense-type"]:checked'
        ).id;

        if (name !== "" && !isNaN(amount) && amount > 0) {
            const newExpense = {
                id: Date.now(),
                name: name,
                amount: amount,
                type: type,
            };
            expenses.push(newExpense);
            saveExpensesTolocal();
            updateTotal();
            renderExpenses();

            //clear input
            expenseForm.reset();
        }
    });

    function renderExpenses() {
        expenseList.innerHTML = "";
        expenses.forEach((data) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>
                    <img src="./arrow-red.png">
                    ${data.name} - ₹${data.amount}
                </span>
                <button data-id="${data.id}">Delete</button>
            `;
            expenseList.appendChild(li);
        });
    }

    function calculateTotal() {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    function saveExpensesTolocal() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function updateTotal() {
        totalAmount = calculateTotal();
        totalAmountDisplay.textContent = totalAmount.toFixed(2);
    }

    // Delete item
    expenseList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const expenseId = parseInt(e.target.getAttribute("data-id"));
            expenses = expenses.filter((expense) => expense.id !== expenseId);

            saveExpensesTolocal();
            renderExpenses();
            updateTotal();
        }
    });
});
