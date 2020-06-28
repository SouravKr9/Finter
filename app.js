var budgetController = (function (){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems : {
            exp : [],
            inc : []
        },
        totals : {
            exp : 0,
            inc : 0
        }
    };

    return {
        addItem : function(type, description, value) {
            var newItem ,ID;

            if(data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else
                ID = 0; 

            if(type === "exp"){
                newItem = new Expense(ID, description, value);
            }
            else if(type === "inc"){
                newItem = new Income(ID, description, value);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget : function(){

        },

        test : function(){
            console.log(data);
        }
    }

})();

var uiController = (function (){
    var DOMstrings = {
        inputType : ".add__type",
        inputDescription : ".add__description",
        inputValue : ".add__value",
        inputBtn : ".add__btn",
        incomeContainer : ".income__list",
        expenseContainer : ".expenses__list"
    };

    return {
        getInput : function (){
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)            
            };
        },

        addListItem : function (obj, type){
            var html, newHtml, element;

            if(type === "inc"){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%item__description%</div>\
                <div class="right clearfix"> <div class="item__value">%item__value%</div>\
                <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                </div> </div> </div>';
            }
            else if(type === "exp"){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%item__description%</div>\
                <div class="right clearfix"> <div class="item__value">%item__value%</div>\
                <div class="item__percentage">21%</div> <div class="item__delete">\
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                </div> </div> </div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%item__description%', obj.description);
            newHtml = newHtml.replace('%item__value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields : function (){
            fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, array){
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        getDOMstrings : function (){
            return DOMstrings;
        }
    }
})();

var appController = (function(budgetController, uiController) {
    var setUpEventListeners = function () {
        var DOMstrings = uiController.getDOMstrings();
        document.querySelector(DOMstrings.inputBtn).addEventListener("click", addItemController);
        document.addEventListener("keypress", function(event) {
            if(event.keyCode === 13 || event.which === 13)
                addItemController();
        });

    }

    var updateBudget = function (){

    };

    var addItemController = function() {
        var input = uiController.getInput();
        if(input.description != "" && !isNaN(input.value)){
            var newItem = budgetController.addItem(input.type, input.description, input.value);
            uiController.addListItem(newItem, input.type);
            uiController.clearFields();
            updateBudget();
        }
    };

    return {
        init : function() {
            console.log("Application initalized");
            setUpEventListeners();
        }
    }
})(budgetController, uiController);

appController.init();
