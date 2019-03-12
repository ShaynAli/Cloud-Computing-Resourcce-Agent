var true_username = "ADMIN";
var true_password = "password";

function init() {
    var form = document.getElementById("login-form");

    document.getElementById("login-button").addEventListener("click", function() {
        login(document.getElementById("user").value, document.getElementById("pass").value, form);
    });
}

function login(username, password, form) {
    if (username.toUpperCase() === true_username && password === true_password) {
        window.location.href = "./portal.html";
        console.log("Logged in");
    } else {
        console.log("Error");
        console.log(username + " " + password);
    }

}
