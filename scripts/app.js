const PATH = location.pathname;

const PASSWORD = localStorage.getItem("code") === null ? "0000" : JSON.parse(localStorage.getItem('code'));

if (localStorage.getItem('auth') === null) {
    localStorage.setItem('auth', JSON.stringify(false));
}

if (PATH.match('index.html')) {

    if (JSON.parse(localStorage.getItem('auth')) === true) {
        location.href = location.origin + "/wsr-wallet/wallet.html";
    }

    const page = document.getElementById("auth");

    const passwordInput = page.querySelector("#authInput");

    passwordInput.addEventListener('input', (e) => {
        if (e.target.value.trim() === PASSWORD) {
            localStorage.setItem('auth', JSON.stringify(true));
            location.href = location.origin + "/wsr-wallet/wallet.html";
        }
    })
}

if (PATH.match('wallet.html')) {
    if (JSON.parse(localStorage.getItem('auth')) === false) {
        location.href = location.origin + "/wsr-wallet/index.html";
    }

    // const wallet = getWallet();


    const wallet = {
        history: [
            {
                type: {
                    display: "Доход",
                    value: "income"
                },
                category: {
                    display: "Еда",
                    value: 'food'
                },
                amount: 25000,
                date: new Date().setDate(new Date().getDate() - 3)
            }
        ],
        categories: [
            {display: "Еда", value: 'food'},
            {display: 'Автомобиль', value: 'car'}
        ]
    };

    function getWallet() {
        if (localStorage.getItem("wallet") === null) {
            localStorage.setItem('wallet', JSON.stringify({
                history: [],
                categories: [
                    {display: "Еда", value: 'food'},
                    {display: 'Автомобиль', value: 'car'}
                ]
            }));
            return JSON.parse(localStorage.getItem('wallet'));
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

    function getBalance() {
        return getIncomeBalance() - getExpensesBalance();
    }

    function getIncomeBalance() {
        return getIncome().reduce((prev, current) => prev += current.amount, 0)
    }

    function getExpensesBalance() {
        return getExpenses().reduce((prev, current) => prev += current.amount, 0)
    }

    function sortByDay(dataset) {
        const day = new Date().setDate(new Date().getDate() - 1);
        return dataset.filter((data) => data.date >= day);
    }

    function sortByWeek(dataset) {
        const week = new Date().setDate(new Date().getDate() - 7);
        return dataset.filter((data) => data.date >= week);
    }

    function sortByMonth(dataset) {
        const month = new Date().setMonth(new Date().getMonth() - 1);
        return dataset.filter((data) => data.date >= month);
    }

    function sortByCategory(category, dataset) {
        return dataset.filter((data) => data.category.value === category);
    };

    function setIncome(amount, category) {

        console.log(parseInt(amount));
        console.log(typeof parseInt(amount));



        // if ( === NaN) {
        //     alert("Введите число, а не символы!!!");
        //     return false;
        // }

        const data = {
            type: {
                display: "Доход",
                value: 'income'
            },
            category: {
                display: category.display,
                value: category.value
            },
            amount: Number(amount),
            date: new Date().setDate(Date.now())
        };

        console.log(data);
    }

    function income() {
        const parent = document.getElementById('income');

        const input = parent.querySelector('input');
        const selector = parent.querySelector('select');
        const button = parent.querySelector('button');

        button.addEventListener('click', () => {
            setIncome(input.value.trim(), {
                display: selector.options[selector.selectedIndex].textContent,
                value: selector.options[selector.selectedIndex].value,
            })
        });
    }

    function renderHistory(dataset = wallet.history) {
        const history = document.getElementById('history');
        history.innerHTML = '';

        dataset.map((data) => {
            history.insertAdjacentHTML('beforeend', `
                <li class="list ${data.type.value}">${data.category.display} - ${data.amount} рублей [${data.date.toLocaleString()}]</li>
            `);
        })
    }

    function renderSummary() {
        document.getElementById('balance_span').textContent = getBalance();
        document.getElementById('income_span').textContent = getIncomeBalance();
        document.getElementById('expenses_span').textContent = getExpensesBalance();
    }

    function filter() {
        const parent = document.getElementById('stats-settings');

        const buttons = parent.querySelectorAll('button');
        console.log(buttons);

        for (const button of buttons) {
            console.log(button);
            button.addEventListener('click', (e) => {
                switch (e.target.getAttribute('data-type')) {
                    case "day":
                        renderHistory(sortByDay(wallet.history));
                        break;
                    case "week":
                        renderHistory(sortByWeek(wallet.history));
                        break;
                    case "month":
                        renderHistory(sortByMonth(wallet.history));
                        break;
                    case "clear":
                        renderHistory(wallet.history);
                        break;
                }
            })
        }

        const selector = parent.querySelector("select");
        selector.addEventListener("change", (e) => {
            renderHistory(sortByCategory(e.target.options[e.target.selectedIndex].value, wallet.history));
        })
    }


    income();
    filter();
    renderSummary();
    renderHistory();
}