var username = "ADMIN";
var password = "password";
window.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("login-form");

    document.getElementById("login-button").addEventListener("click", function() {
        login(document.getElementById("user").value, document.getElementById("pass").value, form);
    })
})

function login(username, password, form) {
    if (username.toUpperCase() == "ADMIN" && password == "password") {
        // form.submit();
        window.location.href = "./portal.html";
        console.log("Logged in")
    } else {
        console.log("Error")
        console.log(username + " " + password);
    }

}
