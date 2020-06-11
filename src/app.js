/**
 * BUDGET CONTROLLER:
 * Stores and evaluates budget data.
 */
var budgetController = (function () {
    /**
     * Constructor function for an Expense object.
     * @param {Number} id Unique identifier for this Expense.
     * @param {String} desc Text describing this Expense.
     * @param {Number} value Value associated with this Expense.
     */
    var Expense = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    };

    /**
     * Calculates the percentage that this Expense contributes to compared to
     * a total income value.
     * @param {Number} totalIncome Value to use to determine what percentage
     * this expense is to compared to it.
     */
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    /**
     * Constructor function for an Income object.
     * @param {Number} id Unique identifier for this Income.
     * @param {String} desc Test describing this Income.
     * @param {Number} value Value associated with this Income.
     */
    var Income = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    /**
     * Evaluates the sum value of all items in either the expenses or incomes
     * array.
     * @param {('exp'|'inc')} type String to decide which items array to
     * calculate the total of.
     */
    var calculateTotal = function (type) {
        data.totals[type] = data.items[type].reduce(function(acc, cur) {
            return acc + cur.value;
        }, 0);
    };

    /**
     * The budget's data.
     */
    var data = {
        items: {
            exp: [],    /* Collection of Expense objects. */
            inc: []     /* Collection of Income objects. */
        },
        totals: {
            exp: 0,     /* Sum total of Expense values. */
            inc: 0      /* Sum total of Income values. */
        },
        budget: 0,      /* Sum of incomes minus sum of expenses. */
        percentage: -1  /* Percentage of total expense over total income. */
    };

    /* Public methods. */
    return {

        /**
         * Creates a new item with the given type, description and value, saves
         * it in this budget's data object, and returns it.
         * @param {('exp'|'inc')} type String to determine whether this is an
         * Expense or an Income item.
         * @param {String} desc Text description for this object.
         * @param {Number} value Value associated with this object.
         */
        addItem: function (type, desc, val) {
            var newItem;
            var ID;
            var length;

            /* Create new unique id. */
            length = data.items[type].length;
            if (length > 0) {
                ID = data.items[type][length - 1].id + 1;
            } else {
                ID = 0;
            }

            /* Create new item based on 'inc' or 'exp' type. */
            if (type === 'exp') {
                newItem = new Expense(ID, desc, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, desc, val);
            }

            /* Push new item into our data structure and return it. */
            data.items[type].push(newItem);
            return newItem;
        },

        /**
         * Deletes an Expense or Income item from the budget.
         * @param {('exp'|'inc')} type String to determine whether the item to
         * delete is an Expense or an Income.
         * @param {Number} id Unique identifier for the item to delete.
         */
        deleteItem: function (type, id) {
            var index = data.items[type].findIndex(function(item) {
                return item.id === id;
            });
            if (index !== -1) {
                data.items[type].splice(index, 1);
            }
        },

        /**
         * Evaluates the totals of Expenses and Incomes, the percentage of
         * Expenses over Income and the available budget value.
         */
        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;

            data.percentage = (data.totals.inc > 0 ?
                Math.round((data.totals.exp / data.totals.inc) * 100) : -1);

            // console.log(data.items);
        },

        /**
         * For each Expense object, evaluate its percentage value (The
         * percentage that an Expense value is compared to the sum total of
         * Income values).
         */
        calculatePercentages: function () {
            data.items.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        /**
         * Returns an array of each Expense's percentage value.
         */
        getPercentages: function () {
            return data.items.exp.map(function(cur) {
                return cur.getPercentage();
            });
        },

        /**
         * Returns an object containing the totals of Expenses and Incomes, the
         * percentage of Expenses over Income and the available budget value.
         */
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }
    };
}());

/**
 * UI CONTROLLER:
 * Gets input from and modifies the UI.
 */
var UIController = (function () {
    var DOMstrings = {
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
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

   /**
    * Formats and returns the given number as an Expense or Income value string.
    * A value string must be preceded by either a '+' or '-',
    * must contain exactly 2 decimal places,
    * and the thousands place must be separated by a comma.
    * ex:
    *     2310.4567 -> + 2,310.46
    *     2000      -> + 2,000.00
    * @param {Number} num Value to format.
    * @param {('exp'|'inc')} type String to determine whether num is an Expense
    * or an Income value.
    */
    var formatNumber = function (num, type) {
        var numSplit;
        var int;
        var dec;

        num = Math.abs(num).toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    /* Public methods. */
    return {

        /**
         * Returns an object consisting of input values gathered from the UI.
         */
        getInput: function () {
            return {
                type: $(DOMstrings.inputType).val(), /* 'inc' or 'exp' */
                desc: $(DOMstrings.inputDesc).val(),
                value: parseFloat($(DOMstrings.inputVal).val())
            };
        },

        /**
         * Creates a 'list item' HTML element, populates it with the given
         * object data, and appends it to either the expense or the income
         * container depending on the given type.
         * @param {Object} obj An Expense or Income object.
         * @param {Number} obj.id Unique identifier for this list item.
         * @param {String} obj.desc Text describing this list item.
         * @param {Number} obj.value Value associated with this list item.
         * @param {('exp'|'inc')} type String to determine whether the list item
         * to add is an Expense or an Income.
         */
        addListItem: function (obj, type) {
            var exp = (type === 'exp' ? true : false);
            var itemID = (exp ? 'exp' : 'inc') + '-' + obj.id;

            /* Create HTML elements to display object in. */
            var $itemDiv = $('<div>', { id: itemID, class: 'item clearfix' });
            var $descDiv = $('<div>', { class: 'item__description' });
            var $rightDiv = $('<div>', { class: 'right clearfix' });
            var $valDiv = $('<div>', { class: 'item__value' });
            var $percentDiv;
            if (exp) {
                $percentDiv = $('<div>', { class: 'item__percentage', text: '22%' });
            }
            var $deleteDiv = $('<div class="item__delete"><button class="item__delete--btn"><i class="iconify" data-icon="ion-ios-close-circle-outline" -inline="false"></i></button></div>');

            /* Populate with object data. */
            $descDiv.text(obj.desc);
            $valDiv.text(formatNumber(obj.value, type));

            /* Append sub-elements of list item. */
            $rightDiv.append($valDiv);
            if (exp) {
                $rightDiv.append($percentDiv);
            }
            $rightDiv.append($deleteDiv);
            $itemDiv.append($descDiv, $rightDiv);

            /* Insert new list item into its corresponding container in the DOM. */
            $(exp? DOMstrings.expenseContainer : DOMstrings.incomeContainer)
                .append($itemDiv);
        },

        /**
         * Removes from the UI a list item HTML element having the given id.
         * @param {String} id
         */
        deleteListItem: function (id) {
            $('#' + id).remove();
        },

        /**
         * Delete the current value in the input and then focus it.
         */
        clearFields: function () {
            $(DOMstrings.inputContainer)
                .children('input')
                .val('')
                .first()
                .focus();
        },

        /**
         * Renders a budget object to the UI.
         * @param {Object} obj Budget object.
         * @param {Number} obj.budget Available budget (Income minus Expenses).
         * @param {String} obj.totalInc Sum total of Income values.
         * @param {Number} obj.totalExp Sum total of Expense values.
         * @param {Number} obj.percentage Percentage of total expense over total
         * income.
         */
        displayBudget: function (obj) {
            /* Positive values are incomes and negative values are expenses. */
            var type = (obj.budget > 0 ? 'inc' : 'exp');

            $(DOMstrings.budgetLabel).text(formatNumber(obj.budget, type));
            $(DOMstrings.incomeLabel).text(formatNumber(obj.totalInc), 'inc');
            $(DOMstrings.expensesLabel).text(formatNumber(obj.totalExp), 'exp');

            if (obj.percentage > 0) {
                $(DOMstrings.percentageLabel).text(obj.percentage + '%');
            } else {
                $(DOMstrings.percentageLabel).text('---');
            }
        },

        /**
         * Sets the percentage label value of each Expense list item in the UI
         * according to the given array.
         * @param {Number[]} percentages A map from all Expense objects to their
         * value property.
         */
        displayPercentages: function (percentages) {
            var index = 0;
            $(DOMstrings.expensesPercLabel).each(function () {
                if (percentages[index] > 0) {
                    $(this).text(percentages[index] + '%');
                } else {
                    $(this).text('---');
                }

                index++;
            });
        },

        /**
         * Renders the current date in the UI.
         */
        displayDate: function () {
            var today = new Date();
            var months = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ];
            var month = today.getMonth();   /* A number from 0 to 11. */
            var year = today.getFullYear(); /* A number like 2020. */

            $(DOMstrings.dateLabel).text(months[month] + ' ' + year);
        },

        /**
         * Toggles the outline color of the input fields in the UI.
         */
        changedType: function () {
            $(
                [
                    DOMstrings.inputType,
                    DOMstrings.inputDesc,
                    DOMstrings.inputVal
                ].join(', ')
            ).toggleClass('red-focus');
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };
}());

/**
 * GLOBAL APP CONTROLLER:
 * Sets up event listeners and uses the budget and UI controllers to allow users
 * to create a budget which they can modify by adding and removing incomes or
 * expenses.
 */
var controller = (function (budgetCtrl, UICtrl) {

    /**
     * Sets up event listeners for adding and remove list items.
     */
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        $(DOM.inputBtn).on('click', ctrlAddItem);
        $(document).keypress(function(event) {
            /* 'Enter' keypress */
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        $(DOM.container).on('click', ctrlDeleteItem);
        $(DOM.inputType).on('change', UICtrl.changedType);
    };

    /**
     * Calculates and renders the budget.
     */
    var updateBudget = function () {
        /* 1. Calculate the budget. */
        budgetCtrl.calculateBudget();

        /* 2. Return the budget. */
        var budget = budgetCtrl.getBudget();

        /* 3. Display the budget on the UI. */
        UICtrl.displayBudget(budget);
    };

    /**
     * Calculates and renders the percentage of each individual Expense item
     * compared to the total income value.
     */
    var updatePercentages = function () {
        /* 1. Calculate the percentages. */
        budgetCtrl.calculatePercentages();

        /* 2. Read percentages from budget controller. */
        var percentages = budgetCtrl.getPercentages();

        /* 3. Update the UI with the new percentages. */
        UICtrl.displayPercentages(percentages);
    };

    /**
     * Collects input data from UI and uses it to create and store a new list
     * item and then renders it on the UI.
     */
    var ctrlAddItem = function () {
        /* 1. Get the field input data. */
        var input = UICtrl.getInput();

        if (input.desc !== '' && !Number.isNaN(input.value) && input.value > 0) {
            /* 2. Add the item to the budget controller. */
            var newItem = budgetCtrl.addItem(input.type, input.desc, input.value);

            /* 3 Add the item to the UI. */
            UICtrl.addListItem(newItem, input.type);

            /* 4. Clear the fields. */
            UICtrl.clearFields();

            /* 5. Calculate and update budget. */
            updateBudget();

            /* 6. Calculate and update percentages. */
            updatePercentages();
        }
    };


    /**
     * Deletes a list item from the budget data structure and removes it from
     * the UI.
     * @param {Event} event The event that triggered this handler.
     */
    var ctrlDeleteItem = function (event) {
        /* Traverse the DOM to get at the item id.
           The event target is an SVG element displaying an X mark.
           We want to remove the entire list item that this element sits on. */
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            /* id prop has form "type-id" */
            var splitID = itemID.split('-');
            var type = splitID[0];
            var ID = parseInt(splitID[1]);

            /* 1. Delete the item from the data structure */
            budgetCtrl.deleteItem(type, ID);

            /* 2. Delete the item from the UI */
            UICtrl.deleteListItem(itemID);

            /* 3. Update and show the new budget */
            updateBudget();

            /* 4. Calculate and update percentages */
            updatePercentages();
        }
    };

    /* Public methods. */
    return {
        /**
         * Initializes the app. Displays the current data, the budget and sets
         * up event listeners.
         */
        init: function () {
            // console.log('Application has started.');
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
        }
    };
}(budgetController, UIController));

controller.init();
