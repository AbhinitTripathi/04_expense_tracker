// ==========================
// Expense Tracker + Budget Allocation
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    // --------------------------
    // Salary Allocation Elements
    // --------------------------
    const salaryForm = document.getElementById("salary-form");
    const salaryInput = document.getElementById("salary-input");
    const setButton = document.querySelector(
        "#salary-form button[type='submit']"
    );
    const resetButton = document.querySelector(
        "#salary-form button[type='button']"
    );
    const allocations = document.getElementById("allocations");

    // --------------------------
    // Expense Tracker Elements
    // --------------------------
    const expenseForm = document.getElementById("expense-form");
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseList = document.getElementById("expense-list");
    const totalAmountDisplay = document.getElementById("total-amount");

    // --------------------------
    // State (from localStorage)
    // --------------------------
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let salary = Number(JSON.parse(localStorage.getItem("salary"))) || 0;

    let totalAmount = calculateTotal();
    renderExpenses();
    updateTotal();
    if (salary > 0) renderAllocations();

    // --------------------------
    // Salary Form Events
    // --------------------------
    salaryForm.addEventListener("click", (e) => {
        // SET salary
        if (e.target === setButton) {
            e.preventDefault();

            salary = Number(salaryInput.value.trim());
            if (salary > 0) {
                saveSalaryToLocalStorage(salary);
                renderAllocations();
            }

            salaryForm.reset();
        }

        // RESET salary
        if (e.target === resetButton) {
            removeSalaryFromLocalStorage();
            allocations.innerHTML = "";
            salary = 0;
        }
    });

    // --------------------------
    // Expense Form Events
    // --------------------------
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
                name,
                amount,
                type,
            };

            expenses.push(newExpense);
            saveExpensesToLocal();
            renderExpenses();
            updateTotal();
            if (salary > 0) renderAllocations();

            expenseForm.reset(); // clear form
        }
    });

    // --------------------------
    // Render Functions
    // --------------------------
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

    function renderAllocations() {
        const baseNeeds = salary * 0.5;
        const baseWants = salary * 0.3;
        const baseInvestments = salary * 0.2;

        let needs = baseNeeds;
        let wants = baseWants;
        let investments = baseInvestments;

        // Deduct expenses from respective categories
        if (expenses.length > 0) {
            expenses.forEach((expense) => {
                if (expense.type === "need") needs -= expense.amount;
                else if (expense.type === "want") wants -= expense.amount;
                else if (expense.type === "investment")
                    investments -= expense.amount;
            });
        }

        allocations.innerHTML = `
            <div class="card ${needs < baseNeeds * 0.1 ? "warning" : ""}">
                Needs: ₹${needs.toFixed(2)}
            </div>
            <div class="card ${wants < baseWants * 0.1 ? "warning" : ""}">
                Wants: ₹${wants.toFixed(2)}
            </div>
            <div class="card ${
                investments < baseInvestments * 0.1 ? "warning" : ""
            }">
                Investments: ₹${investments.toFixed(2)}
            </div>
        `;
    }

    // --------------------------
    // Utility Functions
    // --------------------------
    function calculateTotal() {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    function updateTotal() {
        totalAmount = calculateTotal();
        totalAmountDisplay.textContent = totalAmount.toFixed(2);
    }

    function saveExpensesToLocal() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function saveSalaryToLocalStorage(newSalary) {
        localStorage.setItem("salary", JSON.stringify(newSalary));
    }

    function removeSalaryFromLocalStorage() {
        localStorage.removeItem("salary");
    }

    // --------------------------
    // Delete Expense Item
    // --------------------------
    expenseList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const expenseId = parseInt(e.target.getAttribute("data-id"));
            expenses = expenses.filter((expense) => expense.id !== expenseId);

            saveExpensesToLocal();
            renderExpenses();
            updateTotal();
            if (salary > 0) renderAllocations();
        }
    });
});
