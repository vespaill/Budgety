### Modules

-   Important aspect of any robust application's architecture.
-   Keep the units of code for aproject both cleanly separated and organized.
-   Encapsulate some data into privary and expose other data publicly.

### Implementing the module pattern

-   Using the module pattern—closures and IIFEs.
-   Private and public data, encapsulation, and separation of concerns.

### Setting up the event listeners

-   Setting up event listeners for keypress events.
-   Using the event object.

### Reading input data

-   Reading data from different HTML input fields.

### Creating an initialization function

-   How and why.

### Creating income and expense function constructors

-   Choosing function constructors that meet our application's needs.
-   Setting up a proper data structure for our budget controller.

### Adding a new item to our budget controller

-   Avoiding conflicts in our data structures.
-   How and why to pass data from one module to another.

### Adding a new item to the UI

-   Techniques for adding big chunks of HTML into the DOM.
-   Replacing parts of strings.
-   Manipulating the DOM using the jQuery's `append` method.

### Clearing out input fields

-   Clearing HTML input fields with jQuery's `val` method.
-   Using jQuery to select multiple elements.
-   Using jQuery's `children`, `first` and `focus` methods.

### Updating the budget controller

-   Converting field inputs to numbers.
-   Preventing false inputs.

### Updating the budget controller #2

-   Creating simple, resuable functions with a single purpose.
-   Summing up all elements of an array using `forEach`.

### Updating the UI controller to display budget.

-   Practicing DOM manipulation by updating the budget and total values.

### When to use event delegation

1. We have an element with lots of child elements that we are interested in

2. We want an event hanndler attached to an element that is not yet in the DOM when our page is loaded.

### Setting up the delete Event Listener using Event Delegation

-   Using event delegation in practice.
-   Using IDs in HTML to connect the UI with the data model.
-   Using `parentNode` property for DOM traversal.

### Deleteing an item from our budget controller

-   Looping over an array using the `map` method.
-   Using the `findIndex` method in order to find the index of the first element in an array where a condition is true.
-   Removing elements from an array using the `splice` method.

### Updating the percentages controller

-   Making our budget controller interact with the Expense prototype.