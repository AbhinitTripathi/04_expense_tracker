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
    const resetConfirmation = document.querySelector(".reset-confirmation");
    // --------------------------
    // Expense Tracker Elements
    // --------------------------
    const expenseForm = document.getElementById("expense-form");
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseList = document.getElementById("expense-list");
    const totalAmountDisplay = document.getElementById("total-amount");

    // --------------------------
    // Reset Confirmation Elements
    // --------------------------
    const confirmResetBtn = document.getElementById("confirm-reset");
    const cancelResetBtn = document.getElementById("cancel-reset");

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
        if (e.target === resetButton && salary > 0) {
            resetConfirmation.style.display = "block";
            document.querySelector(".main-content").classList.add("blur");
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
    // handle reset
    // --------------------------
    confirmResetBtn.addEventListener("click", () => handleReset("yes"));
    cancelResetBtn.addEventListener("click", () => handleReset("no"));

    function handleReset(choice) {
        console.log(choice);
        if (choice === "yes") {
            removeSalaryFromLocalStorage();
            allocations.innerHTML = "";
            salary = 0;
            expenseList.innerHTML = "";
            expenses = [];
            totalAmountDisplay.textContent = "0.00";
            totalAmount = 0;
            saveExpensesToLocal();
        }
        resetConfirmation.style.display = "none";
        document.querySelector(".main-content").classList.remove("blur");
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
