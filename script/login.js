let users = [];
setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');

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
    console.log(autoLogIn);
    if(autoLogIn == 'false' || autoLogIn == 'null'){
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

    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {

        setAutoLogIn();

        localStorage.setItem('Logged in user-email ', user['email']);

        window.location.href = 'summary.html?msg=Du hast dich erfolgreich eingeloggt!';
    } else {
        clearAllInput();
        turnInputRed();
    }
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
 * function creates a new user and pushes him into users(Array).
 */
async function signUp() {

    if (users.find(u => u.username == username.value)) {

        clearAllInput();
        turnInputRed();

    } else {

        if (users.find(u => u.email == email.value)) {

            clearAllInput();
            turnInputRed();

        } else {

            users.push({ username: username.value, email: email.value, password: password.value, tasks: '' });
            await backend.setItem('users', JSON.stringify(users));
            window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert!';

        }
    }
}


/**
 * function deletes all user
 */
async function deleteUser() {
    await backend.deleteItem('users');
}


/**
 * function turns inputborder red for a short duration
 */
function turnInputRed() {
    let elements = document.getElementsByClassName('login-single-input-container');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style = 'border: 1px solid #ff0000;';
    }
    setTimeout(turnInputGray, 2000);
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
    document.getElementById('remember-me').checked = false;
    let elements = document.getElementsByClassName('login-input');
    for (let i = 0; i < elements.length; i++) {
        elements[i].value = '';
    }
}

















/**
 * function checks the email and leads the user to reset.html
 */
function goToResetPage() {


    let user = users.find(u => u.email == email.value);
    console.log(user);

    if (user) {

        let userJSON = JSON.stringify(user);
        localStorage.setItem('NoPasswordUser', userJSON);

        window.location.href = 'reset.html?msg=Bitte gib ein neues Passwort ein!';

    } else {
        clearAllInput();
        turnInputRed();
    }
}



async function createNewPassword() {

    let userJSON = localStorage.getItem('NoPasswordUser');
    let user = JSON.parse(userJSON);

    let firstPassword = document.getElementById('firstPassword').value;
    let secondPassword = document.getElementById('secondPassword').value;

    if (firstPassword == secondPassword) {

        let userEntrie = users.find(u => u.email == user['email']);
        userEntrie['password'] = firstPassword;


        deleteUser();

        await backend.setItem('users', JSON.stringify(users));

        goToLoginPage();



    } else {
        firstPassword = '';
        secondPassword = '';
        clearAllInput();
        turnInputRed();
    }

}