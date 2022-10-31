setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');

let users = [];
let username;
let email;
let password;


/**
 * function loads all saved users and defines user variables to inputfields
 */
async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    defineInputVariables();
}


/**
 * function defines user variables to inputfields
 */
function defineInputVariables() {
    username = document.getElementById('username');
    email = document.getElementById('email');
    password = document.getElementById('password');
}


/**
 * function checks if auto log in is wanted and loggs previous user in or leads to login.html
 */
async function checkForAutoLogIn() {
    let autoLogIn = localStorage.getItem('autoLogIn');
    if (autoLogIn == 'false' || autoLogIn == null) {
        goToLoginPageDelay();
    } else {
        window.location.href = 'summary.html?msg=Du hast dich erfolgreich eingeloggt!';
    }
}


/**
 * function leads to login page with delay
 */
function goToLoginPageDelay() {
    setTimeout(goToLoginPage, 500);
}


/**
 * function leads to login page
 */
function goToLoginPage() {
    window.location.href = 'login.html';
}


/**
 * function logs existing user into page and denies entrance to none existig users.
 */
function logIn() {
    let user = users.find(emailAndPasswordMatch());
    if (user) {
        userGetsLoggdIn(user);
    } else {
        userDoesntGetLoggedIn();
    }
}


/**
 * @returns is email and password matching?
 */
function emailAndPasswordMatch() {
    return u => u.email == email.value && u.password == password.value
}


/**
 * after correct email and passwor function loggs user into join
 */
function userGetsLoggdIn(user) {
    setAutoLogIn();
    saveLoggedInUser(user);
    goToSummary();
}


/**
 * function ckecks the checkbox and saves a value to the local storage, if user wants to be auto logged in next time or not
 */
function setAutoLogIn() {
    let rememberMe = document.getElementById('remember-me');
    if (rememberMe.checked == true) {
        localStorage.setItem('autoLogIn', true)
    } else {
        localStorage.setItem('autoLogIn', false)
    }
}


/**
 * function saves logged in user information to local storage
 * @param {JSON} user 
 */
function saveLoggedInUser(user) {
    localStorage.setItem('user-username', user['username']);
    localStorage.setItem('user-email', user['email']);
    localStorage.setItem('Go to summary from LogIn', true);
}


/**
 * function sends the user to summary.html
 */
function goToSummary() {
    window.location.href = 'summary.html?msg=Du hast dich erfolgreich eingeloggt!';
}


/**
 * after incorrect email and password the entrance to join will be denied and the inputs will be cleared
 */
function userDoesntGetLoggedIn() {
    clearAllInput();
    document.getElementById('remember-me').checked = false;
    turnInputRed();
}


/**
 * function creates a new user and pushes him into users(Array).
 */
async function signUp() {
    if (usernameAlreadyExists() || emailAlreadyExists()) {
        deniedSignUp();
    } else {
        createNewUser();
    }
}


/**
 * @returns looks in array for username
 */
function usernameAlreadyExists() {
    return users.find(u => u.username == username.value)
}


/**
 * @returns looks in array for email
 */
function emailAlreadyExists() {
    return users.find(u => u.email == email.value)
}


/**
 * function deletes all inpust from sign up 
 */
function deniedSignUp() {
    clearAllInput();
    turnInputRed();
}


/**
 * function creats a new user with input from sin_up.html and saves him on backend 
 */
async function createNewUser() {
    users.push({ username: username.value, email: email.value, password: password.value, tasks: '' });
    await backend.setItem('users', JSON.stringify(users));
    window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert!';
}


/**
 * function checks the email and leads the user to reset.html
 */
function goToResetPage() {
    let user = emailAlreadyExists();
    if (user) {
        saveUserInLocalStorage(user);
    } else {
        clearAllInput();
        turnInputRed();
    }
}


/**
 * funciton leads to reset.html and stores the user in local storage to change exactly his password
 * @param {JSON} user 
 */
function saveUserInLocalStorage(user) {
    let userJSON = JSON.stringify(user);
    localStorage.setItem('NoPasswordUser', userJSON);
    window.location.href = 'reset.html?msg=Bitte gib ein neues Passwort ein!';
}


/**
 * function takes all information needed for confirming and creating a new password and then does so
 */
async function createNewPassword() {

    let userJSON = localStorage.getItem('NoPasswordUser');
    let user = JSON.parse(userJSON);
    let firstPassword = document.getElementById('firstPassword').value;
    let secondPassword = document.getElementById('secondPassword').value;

    confirmTheNewPassword(user, firstPassword, secondPassword);

}


/**
 * function checks if the passwords written are identical and if so the function changes the password
 * @param {JSON} user 
 * @param {any} firstPassword 
 * @param {any} secondPassword 
 */
function confirmTheNewPassword(user, firstPassword, secondPassword) {
    if (firstPassword == secondPassword) {
        switchOldWithNewPassword(user);
    } else {
        clearAllInput();
        turnInputRed();
    }
}


/**
 * function takes the old password and changes it with the new one (also in backend)
 * @param {JSON} user 
 */
async function switchOldWithNewPassword(user) {
    let userIndex = users.findIndex(u => u.email == user['email']);
    users[userIndex]['password'] = firstPassword;
    deleteUsers();
    await backend.setItem('users', JSON.stringify(users));
    localStorage.removeItem("NoPasswordUser");
    goToSuccessReset();
}


/**
 * function leads to forgot page
 */
function goToForgotPage() {
    window.location.href = 'forgot_password.html';
}


/**
 * function leads to success_reset.html
 */
function goToSuccessReset() {
    window.location.href = 'success_reset.html';
}


/**
 * function turns inputborder red for a short duration
 */
function turnInputRed() {
    let elements = document.getElementsByClassName('login-single-input-container');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style = 'border: 1px solid #ff0000;';
    }
    setTimeout(turnInputGray, 1500);
}


/**
 * function turns inputborder gray
 */
function turnInputGray() {
    let elements = document.getElementsByClassName('login-single-input-container');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style = 'border: 1px solid #D1D1D1;';
    }
}


/**
 * function clears all input values
 */
function clearAllInput() {
    let elements = document.getElementsByClassName('login-input');
    for (let i = 0; i < elements.length; i++) {
        elements[i].value = '';
    }
}


/**
 * function deletes all user
 */
async function deleteUsers() {
    await backend.deleteItem('users');
}