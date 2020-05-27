/**
 * BUDGET CONTROLLER
 */
let budgetController = (function () {

    /* Some code */

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

    let DOM = UICtrl.getDOMstrings();

    let ctrlAddItem = function () {

        /* 1. Get the field input data */
        let input = UICtrl.getInput();
        console.log(input);


        /* 2. Add the item to the budget controller */

        /* 3 Add the item to the UI */

        /* 4. Calculate the budget */

        /* 5. Display the budget on the UI */
        console.log('It works.');

    };

    $(DOM['inputBtn']).on('click', ctrlAddItem);

    $(document).keypress(event => {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);
