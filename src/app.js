/**
 * BUDGET CONTROLLER
 */
let budgetController = (function () {

    let Expense = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    }

    let Income = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    }

    let data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

})();


/**
 * UI CONTROLLER
 */
let UIController = (function () {
    let DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputVal: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function() {
            return {
                type: $(DOMstrings['inputType']).val(),     /* 'inc' or 'exp' */
                desc: $(DOMstrings['inputDesc']).val(),
                value: $(DOMstrings['inputVal']).val()
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();


/**
 * GLOBAL APP CONTROLLER
 */
let controller = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings();

        $(DOM['inputBtn']).on('click', ctrlAddItem);

        $(document).keypress(event => {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }


    let ctrlAddItem = function () {

        /* 1. Get the field input data */
        let input = UICtrl.getInput();

        /* 2. Add the item to the budget controller */

        /* 3 Add the item to the UI */

        /* 4. Calculate the budget */

        /* 5. Display the budget on the UI */

    };

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
