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
 * function loads all saved users
 */
function loadUsers() {
    let usersAsString = localStorage.getItem('allUsers');
    users = JSON.parse(usersAsString);
    console.log('Loaded Users ', users);
}


/**
 * function creates a new user and pushes him into users(Array).
 */
function signUp() {
    let username = document.getElementById('username');
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    users.push({ username: username.value, email: email.value, password: password.value });

    saveNewUser();

    window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert!';
}


/**
 * function saves new created user
 */
function saveNewUser() {
    let usersAsString = JSON.stringify(users);
    localStorage.setItem('allUsers', usersAsString);
}


/**
 * function logs existing user into page and denies entrance to none existig users.
 */
function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    let user = users.find(u => u.email == email.value && u.password == password.value);
    console.log(user);
    if (user) {
        window.location.href = 'summary.html?msg=Du hast dich erfolgreich eingeloggt!';
    } else {
        turnInputRed();
        password.value = '';
    }
}


/**
 * function turns inputborder red for a short duration
 */
function turnInputRed() {
    document.getElementById('email-container').style = 'border: 1px solid #ff0000;';
    document.getElementById('password-container').style = 'border: 1px solid #ff0000;';
    setTimeout(turnInputGray, 2500);
}


/**
 * function turns inputborder gray
 */
function turnInputGray() {
    document.getElementById('email-container').style = 'border: 1px solid #D1D1D1;';
    document.getElementById('password-container').style = 'border: 1px solid #D1D1D1;';
}



let noPassword = [];

/**
 * function checks the email and leads the user to reset.html
 */
function goToResetPage() {
    let email = document.getElementById('email');

    let user = users.find(u => u.email == email.value);
    if (user) {
        noPassword.push(user);
        window.location.href = 'reset.html?msg=Bitte gib ein neues Passwort ein!';
        createANewPassword();
    } else {
        email.value = '';
        alert('Es existier kein Account mit dieser E-Mail!');
    }
}




function createANewPassword() {
    let user = noPassword[0];
    console.log(user);
}