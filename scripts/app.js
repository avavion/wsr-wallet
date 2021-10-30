const PATH = location.pathname;
const PASSWORD = localStorage.getItem("code") === null ? "0000" : localStorage.getItem('code');

if (localStorage.getItem('isAuth') === null) {
    localStorage.setItem('isAuth', JSON.stringify(false));
}

if (PATH.match("index.html")) {
    if (JSON.parse(localStorage.getItem("isAuth")) === true) {
        location.href = location.origin + '/wsr-wallet/wallet.html';
    }

    const input = document.querySelector("#authInput");

    input.addEventListener("input", (e) => {
        const self = e.target;

        if (PASSWORD === self.value) {
            location.href = '/wsr-wallet/wallet.html';
            localStorage.setItem('isAuth', JSON.stringify(true));
        }
    })
}

if (PATH.match('wallet.html')) {
    if (JSON.parse(localStorage.getItem("isAuth")) === false) {
        location.href = location.origin + '/wsr-wallet/index.html';
    }

    const wallet = {
        history: [
            {
                type: {
                    display: "Доход",
                    value: "income"
                },
                name: "Заробатная плата",
                amount: 30000,
                timestamp: Date.now()
            },
            {
                type: {
                    display: "Расход",
                    value: "expenses"
                },
                name: "Налоги",
                amount: (30000 * 0.13),
                timestamp: Date.now()
            }
        ],
        categories: [
            {display: "Еда", value: 'food'},
            {display: "Автомобиль", value: 'car'},
            {display: "Продукты", value: 'products'},
            {display: "Топливо", value: 'fuel'}
        ]
    }

    // const wallet = getWallet();
    const income = getIncome();

    console.log(getBalance());

    function getWallet() {
        if (localStorage.getItem("wallet") === null) {
            localStorage.setItem('wallet', JSON.stringify({
                history: [],
                categories: [
                    {display: "Еда", value: 'food'},
                    {display: "Автомобиль", value: 'car'},
                    {display: "Продукты", value: 'products'},
                    {display: "Топливо", value: 'fuel'}
                ]
            }));

            return JSON.parse(localStorage.getItem("wallet"));
        } else {
            return JSON.parse(localStorage.getItem('wallet'));
        }
    }

    function getIncome() {
        if (wallet.history.length === 0) {
            return [];
        }

        return wallet.history.filter((_) => _.type.value === 'income');
    }

    function getExpenses() {
        if (wallet.history.length === 0) {
            return [];
        }

        return wallet.history.filter((_) => _.type.value === 'expenses');
    }

    function getIncomeBalance() {
        return getIncome().reduce((prev, current) => prev += current.amount, 0);
    }

    function getExpensesBalance() {
        return getExpenses().reduce((prev, current) => prev += current.amount, 0);
    }

    function getBalance() {
        return getIncomeBalance() - getExpensesBalance();
    }

    function getCategoryByValue(category) {
        return getCategories().filter((_) => _.value === category.toLowerCase())
    }

    function getCategoryByName(category) {
        return getCategories().filter((_) => _.display.toLowerCase() === category.toLowerCase())
    }

    function getCategories() {
        return wallet.categories;
    }

    function getHistory() {
        return wallet.history;
    }

    function changePassword() {

    }

    function resetPassword() {

    }

    function logout() {
        if (localStorage.getItem('isAuth') !== null) {
            localStorage.setItem('isAuth', JSON.stringify(false));
            location.href = location.origin + '/wsr-wallet/index.html';
        }
    }


    function displayHistory() {
        const dataset = getHistory();
        const el = document.getElementById('stats');
        const list = el.querySelector('ul.list');

        dataset.map((data, index) => {
            list.insertAdjacentHTML(`beforeend`, `
                <li class="list-item ${data.type.value}">[${data.type.display}] ${data.name} - ${data.amount} рублей. (${new Date(data.timestamp).toLocaleDateString()})</li>
            `);
        });
    }

    function displaySummary() {
        const el = document.getElementById('summary');

        if (el) {
            el.querySelector('#balance_span').textContent = getBalance();
            el.querySelector('#income_span').textContent = getIncomeBalance();
            el.querySelector('#expenses_span').textContent = getExpensesBalance();
        }
    }

    displayHistory();

    document.querySelector('.button--logout').addEventListener('click', logout);
    displaySummary();
}