var xhr = new XMLHttpRequest(); // Create a new XHR object
var configFile = "./config.json"; // Path to the config file
xhr.open("GET", configFile, true); // opens the request 
xhr.responseType = "json"; // Set the response type to JSON


// When the request loads, parse the JSON response into an object
xhr.onload = function() {
  if (xhr.status === 200) {
    var config = xhr.response["config"];
    config.forEach(option => {
        var newElement = document.createElement("option"); // Create a new button element
        newElement.id = option["id"]; // Set the id of the button to the id in the config file
        newElement.classList.add("dropdown-button"); // Add the class "dropdown-button" to the button
        newElement.innerHTML = option["innerHTML"]; // Set the inner HTML of the button to the innerHTML in the config file
        if (option["type"] == "func") {
            console.log("true");
            newElement.setAttribute("onclick", option["value"]); // Set the onclick attribute of the button to the value in the config file
        }
        else if (option["type"] == "url") {
            newElement.onclick = function() {
                window.location.href = option["value"];
            }
        }

        var parentElement = document.getElementById("main-dropdown"); // Get the parent element
        parentElement.appendChild(newElement); // Append the button to the parent element
    });
    }
}
xhr.send(); // Send the request

function myAlert() {
    alert("Hello World!");
}

