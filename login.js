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

    users.push({username: username.value, email: email.value, password: password.value});

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
    if(user) {
        window.location.href = 'summary.html?msg=Du hast dich erfolgreich eingeloggt!';
    } else {
        password.value = '';
        alert('Dein Passwort oder deine E-Mail ist nicht korrekt!');
    }
}


/**
 * function should send an email to existing user to resert password
 */
function sendPasswordResetMail() {
    let email = document.getElementById('email');

    let user = users.find(u => u.email == email.value);
    if(user) {
        //send an email with reset password link,,,, dont know how this works yet
    } else {
        email.value = '';
        alert('Es existier kein Account mit dieser E-Mail!');
    }
}