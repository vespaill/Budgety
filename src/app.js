/**
 * BUDGET CONTROLLER
 */
let budgetController = (function () {
    let Expense = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    let Income = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    let data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        expenseContainer: '.expenses__list'
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
                id: `${exp ? 'expense' : 'income'}-${obj.id}`,
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

        clearFields: function() {
            $(DOMstrings['inputContainer'])
                .children('input')
                .val('')
                .first()
                .focus();
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
    };

    let updateBudget = function() {
        /* 1. Calculate the budget */


        /* 2. Return the budget */


        /* 3. Display the budget on the UI */

    };

    let ctrlAddItem = function () {
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
        }
    };

    return {
        init: function () {
            console.log('Application has started.');
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();
