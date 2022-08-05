
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
const frozenButton = document.querySelector('.frozenBtn');

const veggiesSection = document.querySelector('.veggies');
const meatsSection = document.querySelector('.meats');
const grainsSection = document.querySelector('.grains');
const dairySection = document.querySelector('.dairy');
const miscSection = document.querySelector('.misc');
const pharmacySection = document.querySelector('.pharmacy');
const frozenSection = document.querySelector('.frozen');

const inputElement = document.getElementById("inputElement");

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
        inputElement.hidden = true;
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
                    case 'frozen':
                        frozenSection.appendChild(item);
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
        footer.innerHTML = `Total Items is ${myItemList.length} with ${this.getNumberNotChecked('any')} unchecked`;

        // Add Number of Items in Each section
        veggiesButton.innerHTML = `<b>Fruits & Veggies</b> - ${this.getNumberOfItems('veggies')} Items - ${this.getNumberNotChecked('veggies')} not checked`;
        meatsButton.innerHTML = `<b>Meats</b> - ${this.getNumberOfItems('meats')} Items - ${this.getNumberNotChecked('meats')} not checked`;
        frozenButton.innerHTML = `<b>Frozen</b> - ${this.getNumberOfItems('frozen')} Items - ${this.getNumberNotChecked('frozen')} not checked`;
        grainsButton.innerHTML = `<b>Grains</b> - ${this.getNumberOfItems('grains')} Items - ${this.getNumberNotChecked('grains')} not checked`;
        dairyButton.innerHTML = `<b>Dairy</b> - ${this.getNumberOfItems('dairy')} Items - ${this.getNumberNotChecked('dairy')} not checked`;
        miscButton.innerHTML = `<b>Misc</b> - ${this.getNumberOfItems('misc')} Items - ${this.getNumberNotChecked('misc')} not checked`;
        pharmacyButton.innerHTML = `<b>Pharmacy</b> - ${this.getNumberOfItems('pharmacy')} Items - ${this.getNumberNotChecked('pharmacy')} not checked`;

    },

    clearLists(){
        veggiesSection.innerHTML = '';
        meatsSection.innerHTML = '';
        frozenSection.innerHTML = '';
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
        myLinks.style.display === "block" ? myLinks.style.display = "none" : myLinks.style.display = "block";
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
                    tools.deleteAllLocalStorageItems(myItemList);
                    //myItemList = tools.getAllLocalStorageItems();
                    myItemList = app.getItems();
                    app.updateList();
                }
                break;
            case "download":
                // Get contents of the local storage
                let arr = app.getItems();
                let itemsString = "";

                for (let i = 0; i < arr.length; i++){
                    itemsString = itemsString + "\n" + arr[i].key + "|" + arr[i].value;
                }

                // (A) CREATE BLOB OBJECT
                var myBlob = new Blob([itemsString], {type: "text/plain"});

                // (B) CREATE DOWNLOAD LINK
                var url = window.URL.createObjectURL(myBlob);
                var anchor = document.createElement("a");
                anchor.href = url;

                anchor.download = "grocerylist" + tools.getDate() + ".txt";

                // (C) "FORCE DOWNLOAD"
                // NOTE: MAY NOT ALWAYS WORK DUE TO BROWSER SECURITY
                // BETTER TO LET USERS CLICK ON THEIR OWN
                anchor.click();
                window.URL.revokeObjectURL(url);
                //document.removeChild(anchor);  // Causing issues....
                break;
            case "upload":
                inputElement.hidden === true ? inputElement.hidden = false : inputElement.hidden = true;
                break;
            case "about":
                alert("Made By Me - This is version 3.5")
                break;
            default:
                // do nothing
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

    uploadFile(event) {
        const file = inputElement.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            if (confirm('this will delete all current items. Are you sure?') === true) {
                tools.deleteAllLocalStorageItems(myItemList);

                // e.target points to the reader
                const textContent = e.target.result;

                const itemArr = textContent.split("\n");

                for (let i = 0; i < itemArr.length; i++) {
                    const item = itemArr[i].split('|');
                    if (item.length === 3) {
                        const x = {key: item[0], value: item[1] + '|' + item[2]};
                        myItemList.push(x);
                    }  
                }
                app.updateList(); 
                app.addDeleteButton();  
                tools.saveAllLocalStorageItems(myItemList);
                addTextItem.value = "";
                addTextItem.focus();  
                sectionSelect.selectedIndex = 0;
                sectionSelect.disabled = true;
            }
        }
        reader.onerror = (e) => {
            const error = e.target.error;
            console.error(`Error occured while reading ${file.name}`, error);
        }
        reader.readAsText(file);

        // Clean up th interface
        inputElement.hidden = true;
        myLinks.style.display === "block" ? myLinks.style.display = "none" : myLinks.style.display = "block";
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
        frozenSection.addEventListener('click', this.addCheckMark);
        grainsSection.addEventListener('click', this.addCheckMark);
        dairySection.addEventListener('click', this.addCheckMark);
        miscSection.addEventListener('click', this.addCheckMark);
        pharmacySection.addEventListener('click', this.addCheckMark);

        veggiesButton.addEventListener('click', this.expandPanel);
        meatsButton.addEventListener('click', this.expandPanel);
        frozenButton.addEventListener('click', this.expandPanel);
        grainsButton.addEventListener('click', this.expandPanel);
        dairyButton.addEventListener('click', this.expandPanel);
        miscButton.addEventListener('click', this.expandPanel);
        pharmacyButton.addEventListener('click', this.expandPanel);

        inputElement.addEventListener('change', this.uploadFile);
        
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
    },

    deleteAllLocalStorageItems(myArray){
        for (let i =0; i < myArray.length; i++) {
            localStorage.removeItem(myArray[i].key);
        }
    },

    getDate() {
        const date = new Date();
        return [
            this.padTo2Digits(date.getMonth() + 1), 
            this.padTo2Digits(date.getDate()),
        ].join('-');
    },

    padTo2Digits(num) {
        return num.toString().padStart(2, 0);
    },
}

app.init();



