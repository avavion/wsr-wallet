const PATH = location.pathname;
const PASSWORD = localStorage.getItem("code") === null ? "0000" : JSON.parse(localStorage.getItem('code'));

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
    //
    // const wallet = {
    //     history: [
    //         {
    //             type: {
    //                 display: "Доход",
    //                 value: "income"
    //             },
    //             name: "Заробатная плата",
    //             amount: 30000,
    //             date: Date.now()
    //         },
    //         {
    //             type: {
    //                 display: "Расход",
    //                 value: "expenses"
    //             },
    //             name: "Налоги",
    //             amount: (30000 * 0.13),
    //             date: new Date().setDate(new Date().getDate() - 14)
    //         },
    //         {
    //             type: {
    //                 display: "Доход",
    //                 value: "income"
    //             },
    //             name: "Заробатная плата",
    //             amount: 30000,
    //             date: new Date().setDate(new Date().getDate() - 3)
    //         },
    //         {
    //             type: {
    //                 display: "Расход",
    //                 value: "expenses"
    //             },
    //             name: "Налоги",
    //             amount: (30000 * 0.13),
    //             date: new Date().setDate(new Date().getDate() - 22)
    //         },
    //         {
    //             type: {
    //                 display: "Доход",
    //                 value: "income"
    //             },
    //             name: "Заробатная плата",
    //             amount: 30000,
    //             date: new Date().setDate(new Date().getDate() - 5)
    //         },
    //         {
    //             type: {
    //                 display: "Расход",
    //                 value: "expenses"
    //             },
    //             name: "Налоги",
    //             amount: (30000 * 0.13),
    //             date: new Date().setMonth(new Date().getMonth() - 2)
    //         }
    //     ],
    //     categories: [
    //         {display: "Еда", value: 'food'},
    //         {display: "Автомобиль", value: 'car'},
    //         {display: "Продукты", value: 'products'},
    //         {display: "Топливо", value: 'fuel'}
    //     ]
    // }

    const wallet = getWallet();

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

    function changePassword(password) {
        if (password.length >= 4) {
            localStorage.setItem('code', JSON.stringify(password));
            return true;
        }

        return false;
    }

    function resetPassword() {
        localStorage.removeItem('code');
        return true;
    }

    function sortByDay(dataset) {
        const day = new Date().setDate(new Date().getDate() - 1);
        return dataset.filter((data) => data.date >= day)
    }

    function sortByWeek(dataset) {
        const week = new Date().setDate(new Date().getDate() - 7);
        return dataset.filter((data) => data.date >= week)
    }

    function sortByMonth(dataset) {
        const month = new Date().setMonth(new Date().getMonth() - 1);
        return dataset.filter((data) => data.date >= month);
    }

    function logout() {
        if (localStorage.getItem('isAuth') !== null) {
            localStorage.setItem('isAuth', JSON.stringify(false));
            location.href = location.origin + '/wsr-wallet/index.html';
        }
    }


    function displayHistory(dataset) {
        const el = document.getElementById('stats');
        const list = el.querySelector('ul.list');

        list.innerHTML = '';

        dataset.map((data, index) => {
            list.insertAdjacentHTML(`beforeend`, `
                <li class="list-item ${data.type.value}">[${data.type.display}] ${data.name} - ${data.amount} рублей. (${new Date(data.date).toLocaleDateString()})</li>
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

    // displayHistory(wallet.history);

    displayHistory(sortByDay(wallet.history));

    document.querySelector('.button--logout').addEventListener('click', logout);
    displaySummary();

    const settings = document.getElementById('settings');
    const passwordField = settings.querySelector('.form__input');
    const passwordButtons = settings.querySelectorAll('button');

    console.log(passwordField);

    for (const button of passwordButtons) {
        if (button.classList.contains('button--danger')) {
            button.addEventListener('click', resetPassword);
        } else {
            button.addEventListener('click', () => changePassword(passwordField.value.trim()));
        }
    }

    const logoutButton = settings.querySelector(".button.button--logout");
    logoutButton.addEventListener("click", logout);

    const filter = document.querySelector(".filter");

    filter.addEventListener("click", (e) => {
        const type = e.target.getAttribute('data-type');

        switch (type) {
            case "day":
                displayHistory(sortByDay(wallet.history));
                break;

            case "week":
                displayHistory(sortByWeek(wallet.history));
                break;

            case "month":
                displayHistory(sortByMonth(wallet.history));
                break;

            case "clear":
                displayHistory(wallet.history);
                break;

            default:
                return;
                break;
        }
    })
}