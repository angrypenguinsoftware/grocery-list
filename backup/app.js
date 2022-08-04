
const root = document.documentElement;

const btnAddItem = document.querySelector('.addBtn');
//const groceryList = document.querySelector('.grocery-list');
const addTextItem = document.querySelector('#myInput');
const hamburgerIcon = document.querySelector('#icon');
const myLinks = document.querySelector('.myLinks');
const sectionSelect = document.querySelector('.sections');
const footer = document.querySelector('.footer');

// Decision to use a variable per section for better control and uglier code -- D'oh! big mistake...will need to refactor
const veggiesButton = document.querySelector('.veggiesBtn');
const meatsButton = document.querySelector('.meatsBtn');
const grainsButton = document.querySelector('.grainsBtn');
const dairyButton = document.querySelector('.dairyBtn');
const miscButton = document.querySelector('.miscBtn');
const pharmacyButton = document.querySelector('.pharmacyBtn');

const veggiesSection = document.querySelector('.veggies');
const meatsSection = document.querySelector('.meats');
const grainsSection = document.querySelector('.grains');
const dairySection = document.querySelector('.dairy');
const miscSection = document.querySelector('.misc');
const pharmacySection = document.querySelector('.pharmacy');

// Most impoetant item in the app
let myItemList = [];


const app = {
    //initializes app
    init(){    
        // set the dropdown disabled until someone enters text into the Add Item box
        sectionSelect.disabled = true;

        this.clearLists();
        myItemList = this.getItems();
        this.updateList();
        this.addDeleteButton();

        handlers.setupEventListeners();
    },

    updateList(){
        this.clearLists();
        
        for (let i = 0; i < myItemList.length; i++){
            let item = tools.createElement('li', myItemList[i].key);

            const myArray = myItemList[i].value.split('|');
            if (myArray.length > 0) {
                if (myArray[0] === 'checked'){
                    item.classList.add('checked');
                } else {
                    item.classList.add('notchecked');
                }
            }

            // assisgn item to proper list
            if (myArray.length > 0) {
                switch(myArray[1]) {
                    case 'veggies':
                        veggiesSection.appendChild(item);
                        break;
                    case 'meats':
                        meatsSection.appendChild(item);
                        break;
                    case 'grains':
                        grainsSection.appendChild(item);
                        break;
                    case 'dairy':
                        dairySection.appendChild(item);
                        break;
                    case 'misc':
                        miscSection.appendChild(item);
                        break;
                    case 'pharmacy':
                        pharmacySection.appendChild(item);
                        break;
                    default:
                        // No Default - other apps may have values stored in the localstorage area that could cause issues
                        // Default to misc
                        //miscSection.appendChild(item);
                }
            }

            
        }

        // Populate thefooter with the number of items and how many are notchecked
        //console.log(myItemList);
        footer.innerHTML = `Total Items is ${myItemList.length} with ${this.getNumberNotChecked('any')} unchecked`;

        // Add Number of Items in Each section
        veggiesButton.innerHTML = `<b>Fruits & Veggies</b> - ${this.getNumberOfItems('veggies')} Items with ${this.getNumberNotChecked('veggies')} not checked`;
        meatsButton.innerHTML = `<b>Meats</b> - ${this.getNumberOfItems('meats')} Items with ${this.getNumberNotChecked('meats')} not checked`;
        grainsButton.innerHTML = `<b>Grains</b> - ${this.getNumberOfItems('grains')} Items with ${this.getNumberNotChecked('grains')} not checked`;
        dairyButton.innerHTML = `<b>Dairy</b> - ${this.getNumberOfItems('dairy')} Items with ${this.getNumberNotChecked('dairy')} not checked`;
        miscButton.innerHTML = `<b>Misc</b> - ${this.getNumberOfItems('misc')} Items with ${this.getNumberNotChecked('misc')} not checked`;
        pharmacyButton.innerHTML = `<b>Pharmacy</b> - ${this.getNumberOfItems('pharmacy')} Items with ${this.getNumberNotChecked('pharmacy')} not checked`;

    },

    clearLists(){
        veggiesSection.innerHTML = '';
        meatsSection.innerHTML = '';
        grainsSection.innerHTML = '';
        dairySection.innerHTML = '';
        miscSection.innerHTML = '';
        pharmacySection.innerHTML = '';
    },

    getNumberOfItems(strSection){
        let cnt = 0;
        for (let i = 0; i < myItemList.length; i++) {
            let myArray = myItemList[i].value.split("|");
            if (myArray[1] === strSection) {
                cnt++;
            }
        }
        return cnt;   
    },

    getNumberNotChecked(strSection) {
        let cnt = 0;
        for (let i = 0; i < myItemList.length; i++) {
            let myArray = myItemList[i].value.split("|");

            if (strSection === 'any') {
                if (myArray[0] === 'notchecked') {
                    cnt++;
                }
            } else {
                if (myArray[1] === strSection && myArray[0] === 'notchecked') {
                    cnt++;
                }
            }
        }
        return cnt;
    },

    // Create a "close" button and append it to each list item
    addDeleteButton(){
        let x = document.querySelectorAll("li");

        for (let i = 0; i < x.length; i++){
            let item = tools.createElement('span', "\u00D7");
            item.className = "close";
            x[i].appendChild(item);

            // Add the edit button
            let itemEdit = tools.createElement('span', "\u270E");
            itemEdit.className = "edit";
            x[i].appendChild(itemEdit);
        }
    },

    // get the innerHTML text of the passed in item
    getText(str) {
        if ((typeof str) === "string") {
            const y = str.split("<span")
            return y[0];
        } else {
            return "nostr";
        }   
    },

    addNewItem(strText) {
        if (strText === '') {
            alert("You must write something!");
            sectionSelect.disabled = true;
        } else {
            const x = {key: addTextItem.value, value: 'notchecked|' + sectionSelect.value};

            myItemList.push(x);
        }

        app.updateList(); 
        app.addDeleteButton();  
        tools.saveAllLocalStorageItems(myItemList);
        addTextItem.value = "";
        addTextItem.focus();  
        sectionSelect.selectedIndex = 0;
        sectionSelect.disabled = true;
    },

    deleteItem(strParent) {  
        // Remove item from myItemList array
        for (let i = 0; i < myItemList.length; i++){
            if (myItemList[i].key === strParent){
                localStorage.removeItem(strParent);
                myItemList = this.getItems();
            }
        }
        app.updateList();
        app.addDeleteButton();
    },

   
    // filters out array elements that are not intended for this app
    getItems() {
        let arr = tools.getAllLocalStorageItems();

        // use a reversing loop 
        for (let i = arr.length - 1; i>= 0; i--) {
             const myArray = arr[i].value.split('|');
             if (myArray.length !== 2) {
                 arr.splice(i, 1);
             }
        }
        return arr;
    },

    forceKeyPressUppercase(e) {
        var charInput = e.keyCode;
        if((charInput >= 97) && (charInput <= 122)) { // lowercase
            if(!e.ctrlKey && !e.metaKey && !e.altKey) { // no modifier key
                var newChar = charInput - 32;
                var start = e.target.selectionStart;
                var end = e.target.selectionEnd;
                e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
                e.target.setSelectionRange(start+1, start+1);
                e.preventDefault();
            }
        }
    },

    splitText(strText, strSplit, toReturn){
       const arr = strText.split(strSplit)
       return arr[toReturn];
    },
}


const handlers = {

    addItem(event){
        app.addNewItem(addTextItem.value);
    },
    
    checkKey(event){
        // check if the key pressed is the enter key
        if (event.key === 'Enter'){
           app.addNewItem(addTextItem.value);
        }
    },

    // Add a check mark
    addCheckMark(event){
        // If the close button clicked then delete item
        if (event.target.className === 'close'){     
            app.deleteItem(app.getText(event.target.parentElement.innerHTML));
            return 0;
        }

        // if the edit button is pressed 
        if (event.target.className === 'edit'){
            addTextItem.value = app.splitText(event.target.parentElement.innerHTML, '<span', 0);
            sectionSelect.disabled = false;
            sectionSelect.value = app.splitText(event.target.parentElement.parentElement.className, ' ', 1);
            app.deleteItem(app.getText(event.target.parentElement.innerHTML));
            return 0;
        }

        let checkedValue;

        if (event.target.tagName === 'LI' && event.target.className === 'checked'){
            event.target.classList.toggle('notchecked');
            checkedValue = 'notchecked';
        } else {
            event.target.classList.toggle('checked');
            checkedValue = 'checked';
        }

        // Persist the checked/unchecked state
        for (let i = 0; i < myItemList.length; i++) {
            let myArray = myItemList[i].value.split('|');
            if (myItemList[i].key === app.getText(event.target.innerHTML)) {
                myItemList[i].value = checkedValue + "|" + myArray[1];
            }
        }

        app.updateList();
        app.addDeleteButton();
        tools.saveAllLocalStorageItems(myItemList);
    },

    toggleHamburgerMenu(event){
        var x = document.getElementById("myLinks");
        if (x.style.display === "block") {
          x.style.display = "none";
        } else {
          x.style.display = "block";
        }
    },

    myLinksPress(event){
        let x = event.target.className;

        switch(x) {
            case "reset":
                for (let i =0; i < myItemList.length; i++){
                    let myArray = myItemList[i].value.split("|");
                    myItemList[i].value = 'notchecked|' + myArray[1];
                    //console.log(myItemList[i].value);
                }
                tools.saveAllLocalStorageItems(myItemList);
                myItemList = app.getItems();
                app.updateList();
                app.addDeleteButton();
                break;
            case "delete":
                if (confirm('Are you sure?') === true) {
                    for (let i =0; i < myItemList.length; i++) {
                        localStorage.removeItem(myItemList[i].key);
                    }
                    //myItemList = tools.getAllLocalStorageItems();
                    myItemList = app.getItems();
                    app.updateList();
                }
                break;
            case "download":
                // Get contents of the local storage
                let arr = app.getItems();
                let itemsString = "";

                console.log(arr);

                for (let i = 0; i < arr.length; i++){
                    itemsString = itemsString + "\n" + arr[i].key + "|" + arr[i].value;
                }

                console.log(itemsString);

                // (A) CREATE BLOB OBJECT
                var myBlob = new Blob([itemsString], {type: "text/plain"});

                // (B) CREATE DOWNLOAD LINK
                var url = window.URL.createObjectURL(myBlob);
                var anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = "grocery.txt";

                // (C) "FORCE DOWNLOAD"
                // NOTE: MAY NOT ALWAYS WORK DUE TO BROWSER SECURITY
                // BETTER TO LET USERS CLICK ON THEIR OWN
                anchor.click();
                window.URL.revokeObjectURL(url);
                //document.removeChild(anchor);
                break;
            case "upload":
                // Do nothing 
                break;
            case "about":
                alert("Made By Me - This is version 3.4")
                break;
            default:
                console.log('default');
        }
    },

    expandPanel(event) {
        let panel = event.target.nextElementSibling;
        event.target.classList.toggle('activePanel');

        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
    },

    activateSectionSelect(event) {
        sectionSelect.disabled = false;
    },

    makeFirstLetterUpperCase(event){
        // console.log(event);
        if (this.selectionStart == 0) {
            // uppercase first letter
            app.forceKeyPressUppercase(event);
        } else {
            // lowercase other letters
            // no need, just have all other letters be what they are
            //app.forceKeyPressLowercase(event);
        }
    },

    setupEventListeners() {
        btnAddItem.addEventListener('click', this.addItem);
        btnAddItem.addEventListener('keydown', this.checkKey);

        hamburgerIcon.addEventListener('click', this.toggleHamburgerMenu);
        myLinks.addEventListener('click', this.myLinksPress);

        addTextItem.addEventListener('input', this.activateSectionSelect);
        addTextItem.addEventListener('keypress', this.makeFirstLetterUpperCase);

        veggiesSection.addEventListener('click', this.addCheckMark);
        meatsSection.addEventListener('click', this.addCheckMark);
        grainsSection.addEventListener('click', this.addCheckMark);
        dairySection.addEventListener('click', this.addCheckMark);
        miscSection.addEventListener('click', this.addCheckMark);
        pharmacySection.addEventListener('click', this.addCheckMark);

        veggiesButton.addEventListener('click', this.expandPanel);
        meatsButton.addEventListener('click', this.expandPanel);
        grainsButton.addEventListener('click', this.expandPanel);
        dairyButton.addEventListener('click', this.expandPanel);
        miscButton.addEventListener('click', this.expandPanel);
        pharmacyButton.addEventListener('click', this.expandPanel);
        
    },
}


const tools = {
    // Add elements to the HTML page
    createElement(element, content) {
        element = document.createElement(element);
        if(arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    },


    // @Param arr - the array that we wish to remove an element
    // @Param value - the value to remove
    arrayRemove(arr, value) { 
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    },

    // Simple event tester so I don't have to write console.log a 1000 times...
    testEvent(event){
        console.log('pressed');
    },

    // Gets all items from localstorage
    getAllLocalStorageItems(){
        const myArray = [];
        for (let i = 0; i < localStorage.length; i++){
           myArray[i] = {key: localStorage.key(i), value: localStorage.getItem(localStorage.key(i))}
        }
        return myArray;
    },
  
    // saves all items to localstorage
    saveAllLocalStorageItems(myArray){
        for (let i = 0; i < myArray.length; i++) {
            let key = myArray[i].key;
            let value = myArray[i].value;

            localStorage.setItem(key, value);
        }
    }
}

app.init();



