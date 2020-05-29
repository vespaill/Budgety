/**
 * BUDGET CONTROLLER
 */
let budgetController = (function () {
    let Expense = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0)
            this.percentage = Math.round(this.value / totalIncome * 100);
        else
            this.percentage = -1;
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    let Income = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    let calculateTotal = function(type) {
        data.totals[type] = data.items[type].reduce((acc, cur) => acc + cur.value, 0);
    }

    let data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, desc, val) {
            let newItem, ID, length;

            /* Create new unique id. */
            length = data.items[type].length;
            if (length > 0) {
                ID = data.items[type][length - 1].id + 1;
            } else {
                ID = 0;
            }

            /* Create new item based on 'inc' or 'exp' type */
            if (type === 'exp') {
                newItem = new Expense(ID, desc, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, desc, val);
            }

            /* Push new item into our data structure and return it */
            data.items[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id) {
            let index = data.items[type].findIndex(item => item.id === id);
            if (index !== -1 ) data.items[type].splice(index, 1);
        },

        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;

            data.percentage = data.totals.inc > 0
                ? Math.round(data.totals.exp / data.totals.inc * 100)
                : -1;

            console.log(data.items);
        },

        calculatePercentages: function() {
            data.items.exp.forEach(cur => {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            return data.items.exp.map(cur => cur.getPercentage());
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function () {
            console.log(data);
        }
    };
})();

/**
 * UI CONTROLLER
 */
let UIController = (function () {
    let DOMstrings = {
        inputContainer: '.add__container',
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputVal: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        getInput: function () {
            return {
                type: $(DOMstrings['inputType']).val(), /* 'inc' or 'exp' */
                desc: $(DOMstrings['inputDesc']).val(),
                value: parseFloat($(DOMstrings['inputVal']).val())
            };
        },

        addListItem: function (obj, type) {
            let exp = false;
            if (type === 'exp') exp = true;
            let $itemDiv, $descDiv, $rightDiv, $valDiv, $deleteDiv, $percentageDiv;

            /* Create item div to display obj in. */
            $itemDiv = $('<div>', {
                id: `${exp ? 'exp' : 'inc'}-${obj.id}`,
                class: 'item clearfix'
            });
            $descDiv = $('<div>', { class: 'item__description' });
            $rightDiv = $('<div>', { class: 'right clearfix' });

            $valDiv = $('<div>', { class: 'item__value' });
            if (exp) $percentageDiv = $('<div>', { class: 'item__percentage', text: '22%' });
            $deleteDiv = $('<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>');

            /* Populate with obj's data */
            $descDiv.text(obj.desc);
            $valDiv.text(obj.value);

            let $rightDivs = [$valDiv];
            if (exp) $rightDivs.push($percentageDiv)
            $rightDivs.push($deleteDiv);

            /* Append sub elements into item */
            $rightDiv.append($rightDivs);
            $itemDiv.append($descDiv, $rightDiv);

            /* Insert new item div into the DOM */
            $(
                exp
                    ? DOMstrings['expenseContainer']
                    : DOMstrings['incomeContainer']
            ).append($itemDiv);
        },

        deleteListItem: function(selectorID) {
            $(`#${selectorID}`).remove();
        },

        clearFields: function() {
            $(DOMstrings['inputContainer'])
                .children('input')
                .val('')
                .first()
                .focus();
        },

        displayBudget: function(obj) {
            $(DOMstrings['budgetLabel']).text(obj.budget);
            $(DOMstrings['incomeLabel']).text(obj.totalInc);
            $(DOMstrings['expensesLabel']).text(obj.totalExp);

            if(obj.percentage > 0) {
                $(DOMstrings['percentageLabel']).text(obj.percentage + '%');
            } else {
                $(DOMstrings['percentageLabel']).text('---');
            }
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

/**
 * GLOBAL APP CONTROLLER
 */
let controller = (function (budgetCtrl, UICtrl) {
    let setupEventListeners = function () {
        let DOM = UICtrl.getDOMstrings();

        $(DOM['inputBtn']).on('click', ctrlAddItem);

        $(document).keypress(event => {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        $(DOM['container']).on('click', ctrlDeleteItem);
    };

    let updateBudget = function() {
        /* 1. Calculate the budget */
        budgetCtrl.calculateBudget();

        /* 2. Return the budget */
        let budget = budgetCtrl.getBudget();

        /* 3. Display the budget on the UI */
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = function() {
        /* 1. Calculate the percentages */
        budgetCtrl.calculatePercentages();

        /* 2. Read percentages from budget controller */
        let percentages = budgetCtrl.getPercentages();

        /* 3. Update the UI with the new percentages */
        console.log(percentages);

    };

    let ctrlAddItem = function() {
        let input, newItem;

        /* 1. Get the field input data */
        input = UICtrl.getInput();

        if (input.desc !== '' && !isNaN(input.value) && input.value > 0) {
            /* 2. Add the item to the budget controller */
            newItem = budgetCtrl.addItem(input.type, input.desc, input.value);

            /* 3 Add the item to the UI */
            UICtrl.addListItem(newItem, input.type);

            /* 4. Clear the fields */
            UICtrl.clearFields();

            /* 5. Calculate abd update budget */
            updateBudget();

            /* 6. Calculate and uupdate percentages */
            updatePercentages();
        }
    };

    let ctrlDeleteItem = function(event) {
        let itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            let splitID = itemID.split('-');
            let type = splitID[0];
            let ID = parseInt(splitID[1]);

            /* 1. Delete the item from the data structure */
            budgetCtrl.deleteItem(type, ID);

            /* 2. Delete the item from the UI */
            UICtrl.deleteListItem(itemID);

            /* 3. Update and show the new budget */
            updateBudget();

            /* 4. Calculate and uupdate percentages */
            updatePercentages();
        }
    }

    return {
        init: function () {
            console.log('Application has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();
