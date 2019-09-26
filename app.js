/********** Module Pattern **********

var budgetController = (function(){
    
    var x = 23;
    
    var add = function(a) {
        return x + a;
    }
    
    return {
        publicTest: function(b) {
            return add(b);
        }
    }
})();

**************************************/

//Budget Controller
var budgetController = (function(){
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {  
        if(totalIncome>0){
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
        
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
        
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        persentage: -1
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            // Create new ID
            if (data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },
        
        deleteItem: function(type, id) {
            var ids, index;
            
            // getting array of id, in existina array index may be different to ID, while at the start they were equall
            ids = data.allItems[type].map(function(current){
                return current.id; 
            });
            
            index = ids.indexOf(id);
            
            if (index !== -1) {
                data.allItems[type].splice(index, 1); // delete element from array
            }
        },
        
        calculateBudget: function() {
            
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // Calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
            data.persentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            } else {
                data.persentage = -1;
            }
        },
        
        calculatePercentages: function(cur) {
          
            data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.totals.inc); 
            });
            
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.persentage
            }
        },
        
        testing: function() {
            console.log(data);
        }
    }
    
})();


//UI Controller
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDesctiption: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expencesPercLable: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
     var formatNumber = function(num, type) {
            var numSplit, int, dec, sign;
            /***
            * 2315.2564 -> + 2,315.26
            ***/
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
            }
            
            dec = numSplit[1];
            
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        };   
    
        var nodeListForEach = function(list, callback){
            for(var i = 0; i < list.length; i++) {
                callback(list[i], i);
            }
        };
            
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDesctiption).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // Convert String into Integer
            }
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace the placeholder with some actual data
            newHtml = html.replace('%id%', obj.id); // Creates new object where %id% from the previous HTML is replaced
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert the HTML into the DOM
           document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDesctiption + ', ' + DOMstrings.inputValue); // Returnes a List of nodes. All DOM blocks are called node elements
            
            fieldsArr = Array.prototype.slice.call(fields); // Turn List into Array
            
            // Clearing the input fields
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            
            // Set input caret to the first field (description)
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, type);
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expencesPercLable); // Returnes a node list   
       
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        
        displayMonth: function() {
            
            var now, year, month, months;
            now = new Date();
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            
        },
        
        changeType: function() {
            var fields = document.querySelectorAll(
            DOMstrings.inputType + ',' +
                DOMstrings.inputDesctiption + ',' +
                DOMstrings.inputValue
            );
            
            nodeListForEach(fields, function(cur) {
             cur.classList.toggle('red-focus');   
            });
            
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },
        
       getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();


//Global app cotroller
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
         
    var DOM = UICtrl.getDOMstrings();
            
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
    document.addEventListener('keypress', function(event) {
        
        if (event.keyCode === 13 || event.which === 13){
           ctrlAddItem();
            
        }
    });
        
        // Event delegation. Listening to the container lets us get all the events inside it, because of event bubbling (transfering from inner elements to outer)
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
        
    };
   
    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    
    var updatePersentages = function(){
        
        // 1. Calculate persentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read persentages from the controller
        var percentages = budgetCtrl.getPercentages();
        
        console.log(percentages);
        
        // 3. Update the UI with the new persentages
        UICtrl.displayPercentages(percentages);
    }
    
    var ctrlAddItem = function(){
        var input, newItem;
       
        // 1.Get the field input data
        input = UICtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
           
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update the budget
            updateBudget();

            // 6. Calculate and update persentages
            updatePersentages();

        }      
    };
    
    var ctrlDeleteItem = function(event) {
        var itemId, splitId, type, ID;
        
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemId) {
            
            // inc-1
            splitId = itemId.split('-'); // split id into array
            
            type = splitId[0];
            ID = parseInt(splitId[1]);
            
            // 1. Delete item from the datastructure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete item from the user interface
            UICtrl.deleteListItem(itemId);
            
            // 3. Update and show the new budget
            updateBudget();
        }
        
        
    };
    
    return {
        init: function() {
            console.log('App started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

    
    
})(budgetController, UIController);


controller.init();




