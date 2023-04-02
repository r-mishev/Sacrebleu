/*
    This file will contain the logic behind saving the states and preferences of the user. This will be done by saving them in the localStorage (HashMap) and then retrieving them on the start up of the pop up. 
    TODO(): FINISH
*/

const items = [{"enabled" : 0, "type" : ""}];
const itemsStr = JSON.stringify(items);

function fetchItems() {
    try {
        var items = localStorage.getItem('properties');
        var itemsArr = JSON.parse(items);
        for (let i = 0; i < itemsArr.length; i++) {
            itemsArr[i]
        }
    } catch(e) {
        // Create a default item list
    }
}

function saveItems(obj) {
    var string = JSON.stringify(obj);
    localStorage.setItem('properties', string);
}