//Grab from local storage b/c can't write to JSON
let users = JSON.parse(localStorage.getItem("users")) || {};

//Check if user is already logged in
function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    //Check if username already exists
    if (users[username]) {
        message.textContent = "User already exists";
        return;
    };

    //Create new user
    users[username] = {
        password: password,
        trips:[]
    };

    //Store to local storage b/c can't write to JSON
    localStorage.setItem("users", JSON.stringify(users));
    message.textContent = "Account Registered."
    //Login and Redirect to mytrips page after short delay
    setTimeout(() => {localStorage.setItem("currentUser", username); window.location.href = "mytrips.html";}, 500);
}

//Check if user is already logged in
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    //Check if username exists and password matches
    if (users[username] && users[username].password === password) {
        localStorage.setItem("currentUser", username);
        window.location.href = "mytrips.html";
    }
    //If not, show error message
    else{
        message.textContent = "Incorrect Username or Password.";
        return;
    }
}