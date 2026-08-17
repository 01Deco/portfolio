// =========================================
// FINANTRACK - CONTROLE FINANCEIRO
// =========================================


// =========================================
// ELEMENTOS DO HTML
// =========================================

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");
const categoriesElement = document.getElementById("categories");

const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
const cancelTransactionButton = document.getElementById("cancelTransaction");

const transactionModal = document.getElementById("transactionModal");
const transactionForm = document.getElementById("transactionForm");

const monthFilter = document.getElementById("monthFilter");
const typeFilter = document.getElementById("typeFilter");


// =========================================
// CARREGAR TRANSAÇÕES
// =========================================

let transactions = [];

try {
    const savedTransactions = localStorage.getItem(
        "finantrack_transactions"
    );

    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
} catch (error) {
    console.error("Erro ao carregar transações:", error);
    transactions = [];
}


// =========================================
// INICIALIZAÇÃO
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    setCurrentMonth();
    setCurrentDate();
    updateDashboard();

});


// =========================================
// MÊS ATUAL
// =========================================

function setCurrentMonth() {

    if (!monthFilter) {
        return;
    }

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    monthFilter.value = year + "-" + month;
}


// =========================================
// DATA ATUAL
// =========================================

function setCurrentDate() {

    const dateInput = document.getElementById("date");

    if (!dateInput) {
        return;
    }

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    dateInput.value =
        year + "-" + month + "-" + day;
}


// =========================================
// ABRIR MODAL
// =========================================

if (openModalButton) {

    openModalButton.addEventListener(
        "click",
        function () {

            transactionModal.classList.add("active");

            transactionModal.setAttribute(
                "aria-hidden",
                "false"
            );

        }
    );

}


// =========================================
// FECHAR MODAL
// =========================================

function closeModal() {

    if (!transactionModal) {
        return;
    }

    transactionModal.classList.remove("active");

    transactionModal.setAttribute(
        "aria-hidden",
        "true"
    );

    if (transactionForm) {
        transactionForm.reset();
    }

    setCurrentDate();
}


// Botão X

if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeModal
    );

}


// Botão cancelar

if (cancelTransactionButton) {

    cancelTransactionButton.addEventListener(
        "click",
        closeModal
    );

}


// =========================================
// FECHAR CLICANDO FORA
// =========================================

if (transactionModal) {

    transactionModal.addEventListener(
        "click",
        function (event) {

            if (event.target === transactionModal) {
                closeModal();
            }

        }
    );

}


// =========================================
// FECHAR COM ESC
// =========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            transactionModal &&
            transactionModal.classList.contains("active")
        ) {
            closeModal();
        }

    }
);


// =========================================
// ADICIONAR TRANSAÇÃO
// =========================================

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const type = document.getElementById(
                "transactionType"
            ).value;


            const description = document.getElementById(
                "description"
            ).value.trim();


            const amount = Number(
                document.getElementById(
                    "amount"
                ).value
            );


            const category = document.getElementById(
                "category"
            ).value;


            const date = document.getElementById(
                "date"
            ).value;


            // Validação

            if (!type) {
                alert("Selecione o tipo da transação.");
                return;
            }


            if (!description) {
                alert("Digite uma descrição.");
                return;
            }


            if (!amount || amount <= 0) {
                alert("Digite um valor válido.");
                return;
            }


            if (!category) {
                alert("Selecione uma categoria.");
                return;
            }


            if (!date) {
                alert("Selecione uma data.");
                return;
            }


            // Criar objeto da transação

            const transaction = {

                id: Date.now(),

                type: type,

                description: description,

                amount: amount,

                category: category,

                date: date

            };


            // Adicionar

            transactions.push(transaction);


            // Salvar

            saveTransactions();


            // Atualizar tela

            updateDashboard();


            // Fechar modal

            closeModal();

        }
    );

}


// =========================================
// SALVAR
// =========================================

function saveTransactions() {

    localStorage.setItem(
        "finantrack_transactions",
        JSON.stringify(transactions)
    );

}


// =========================================
// ATUALIZAR DASHBOARD
// =========================================

function updateDashboard() {

    const filteredTransactions =
        getFilteredTransactions();


    let totalIncome = 0;

    let totalExpense = 0;


    filteredTransactions.forEach(
        function (transaction) {

            const amount = Number(
                transaction.amount
            );


            if (transaction.type === "income") {

                totalIncome += amount;

            } else {

                totalExpense += amount;

            }

        }
    );


    const balance =
        totalIncome - totalExpense;


    // Atualizar saldo

    if (balanceElement) {

        balanceElement.textContent =
            formatCurrency(balance);

    }


    // Atualizar receitas

    if (incomeElement) {

        incomeElement.textContent =
            formatCurrency(totalIncome);

    }


    // Atualizar despesas

    if (expenseElement) {

        expenseElement.textContent =
            formatCurrency(totalExpense);

    }


    // Atualizar lista

    renderTransactions(
        filteredTransactions
    );


    // Atualizar categorias

    renderCategories(
        filteredTransactions
    );

}


// =========================================
// FILTROS
// =========================================

if (monthFilter) {

    monthFilter.addEventListener(
        "change",
        updateDashboard
    );

}


if (typeFilter) {

    typeFilter.addEventListener(
        "change",
        updateDashboard
    );

}


// =========================================
// OBTER TRANSAÇÕES FILTRADAS
// =========================================

function getFilteredTransactions() {

    const selectedMonth =
        monthFilter ? monthFilter.value : "";


    const selectedType =
        typeFilter ? typeFilter.value : "all";


    return transactions.filter(
        function (transaction) {

            const matchesMonth =
                !selectedMonth ||
                transaction.date.startsWith(
                    selectedMonth
                );


            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;


            return (
                matchesMonth &&
                matchesType
            );

        }
    );

}


// =========================================
// RENDERIZAR TRANSAÇÕES
// =========================================

function renderTransactions(data) {

    if (!transactionList) {
        return;
    }


    transactionList.innerHTML = "";


    // Nenhuma transação

    if (data.length === 0) {

        const emptyState =
            document.createElement("div");

        emptyState.className =
            "empty-state";


        const icon =
            document.createElement("div");

        icon.className =
            "empty-icon";

        icon.textContent = "💸";


        const title =
            document.createElement("h3");

        title.textContent =
            "Nenhuma transação encontrada";


        const message =
            document.createElement("p");

        message.textContent =
            "Adicione uma nova transação para começar.";


        emptyState.appendChild(icon);

        emptyState.appendChild(title);

        emptyState.appendChild(message);


        transactionList.appendChild(
            emptyState
        );


        return;
    }


    // Ordenar por data

    const sortedTransactions =
        data.slice().sort(
            function (a, b) {

                return new Date(b.date) -
                    new Date(a.date);

            }
        );


    sortedTransactions.forEach(
        function (transaction) {

            createTransactionElement(
                transaction
            );

        }
    );

}


// =========================================
// CRIAR ELEMENTO DA TRANSAÇÃO
// =========================================

function createTransactionElement(transaction) {

    const row =
        document.createElement("div");

    row.className =
        "transaction-row";


    // Descrição

    const description =
        document.createElement("div");

    description.className =
        "transaction-description";


    const descriptionStrong =
        document.createElement("strong");

    descriptionStrong.textContent =
        transaction.description;


    description.appendChild(
        descriptionStrong
    );


    // Categoria

    const category =
        document.createElement("div");

    category.className =
        "transaction-category";

    category.textContent =
        getCategoryName(
            transaction.category
        );


    // Data

    const date =
        document.createElement("div");

    date.className =
        "transaction-date";

    date.textContent =
        formatDate(
            transaction.date
        );


    // Valor

    const amount =
        document.createElement("div");

    amount.className =
        "transaction-amount";


    if (transaction.type === "income") {

        amount.classList.add(
            "income-value"
        );

        amount.textContent =
            "+ " +
            formatCurrency(
                transaction.amount
            );

    } else {

        amount.classList.add(
            "expense-value"
        );

        amount.textContent =
            "- " +
            formatCurrency(
                transaction.amount
            );

    }


    // Botão excluir

    const action =
        document.createElement("div");

    action.className =
        "transaction-action";


    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.className =
        "delete-button";

    deleteButton.textContent =
        "🗑️";

    deleteButton.title =
        "Excluir transação";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTransaction(
                transaction.id
            );

        }
    );


    action.appendChild(
        deleteButton
    );


    // Montar linha

    row.appendChild(
        description
    );

    row.appendChild(
        category
    );

    row.appendChild(
        date
    );

    row.appendChild(
        amount
    );

    row.appendChild(
        action
    );


    transactionList.appendChild(
        row
    );

}


// =========================================
// EXCLUIR TRANSAÇÃO
// =========================================

function deleteTransaction(id) {

    const confirmed =
        confirm(
            "Deseja realmente excluir esta transação?"
        );


    if (!confirmed) {
        return;
    }


    transactions =
        transactions.filter(
            function (transaction) {

                return transaction.id !== id;

            }
        );


    saveTransactions();

    updateDashboard();

}


// =========================================
// CATEGORIAS
// =========================================

function renderCategories(data) {

    if (!categoriesElement) {
        return;
    }


    categoriesElement.innerHTML = "";


    const expenses =
        data.filter(
            function (transaction) {

                return transaction.type === "expense";

            }
        );


    if (expenses.length === 0) {

        const message =
            document.createElement("p");

        message.className =
            "empty-message";

        message.textContent =
            "Nenhuma despesa cadastrada.";


        categoriesElement.appendChild(
            message
        );


        return;
    }


    const categoryTotals = {};


    expenses.forEach(
        function (transaction) {

            const category =
                transaction.category;


            if (!categoryTotals[category]) {

                categoryTotals[category] = 0;

            }


            categoryTotals[category] +=
                Number(transaction.amount);

        }
    );


    let totalExpenses = 0;


    expenses.forEach(
        function (transaction) {

            totalExpenses +=
                Number(transaction.amount);

        }
    );


    const sortedCategories =
        Object.entries(
            categoryTotals
        ).sort(
            function (a, b) {

                return b[1] - a[1];

            }
        );


    sortedCategories.forEach(
        function (item) {

            const category =
                item[0];

            const amount =
                item[1];


            const percentage =
                totalExpenses > 0
                    ? (amount / totalExpenses) * 100
                    : 0;


            createCategoryElement(
                category,
                amount,
                percentage
            );

        }
    );

}


// =========================================
// CRIAR ELEMENTO DA CATEGORIA
// =========================================

function createCategoryElement(
    category,
    amount,
    percentage
) {

    const item =
        document.createElement("div");

    item.className =
        "category-item";


    // Informações

    const info =
        document.createElement("div");

    info.className =
        "category-info";


    const name =
        document.createElement("span");

    name.textContent =
        getCategoryName(category);


    const value =
        document.createElement("strong");

    value.textContent =
        formatCurrency(amount);


    info.appendChild(name);

    info.appendChild(value);


    // Barra

    const bar =
        document.createElement("div");

    bar.className =
        "category-bar";


    const progress =
        document.createElement("div");

    progress.className =
        "category-progress";

    progress.style.width =
        percentage + "%";


    bar.appendChild(progress);


    // Montar

    item.appendChild(info);

    item.appendChild(bar);


    categoriesElement.appendChild(
        item
    );

}


// =========================================
// NOMES DAS CATEGORIAS
// =========================================

function getCategoryName(category) {

    const categories = {

        salario: "💼 Salário",

        alimentacao: "🍔 Alimentação",

        transporte: "🚗 Transporte",

        moradia: "🏠 Moradia",

        lazer: "🎮 Lazer",

        saude: "❤️ Saúde",

        educacao: "📚 Educação",

        compras: "🛒 Compras",

        outros: "📦 Outros"

    };


    return categories[category] ||
        "📦 Outros";

}


// =========================================
// FORMATAR DINHEIRO
// =========================================

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    ).format(
        Number(value) || 0
    );

}


// =========================================
// FORMATAR DATA
// =========================================

function formatDate(date) {

    if (!date) {
        return "";
    }


    const parts =
        date.split("-");


    if (parts.length !== 3) {
        return date;
    }


    const year = parts[0];

    const month = parts[1];

    const day = parts[2];


    return day +
        "/" +
        month +
        "/" +
        year;

}
