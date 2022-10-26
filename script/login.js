let users = [];
setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');


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
async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
}


/**
 * function creates a new user and pushes him into users(Array).
 */
async function signUp() {
    let username = document.getElementById('username');
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    if (users.find(u => u.username == username.value)) {

        alert('Dieser Benutzername ist bereits vergeben!');
        clearAllInput();
        turnInputRed();

    } else {

        if (users.find(u => u.email == email.value)) {

            alert('Diese Email ist bereits vergeben!');
            clearAllInput();
            turnInputRed();

        } else {

            users.push({username: username.value, email: email.value, password: password.value, tasks: ''});
            await backend.setItem('users', JSON.stringify(users));
            window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert!';

        }
    }
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
        clearAllInput();
        turnInputRed();
    }
}


/**
 * function turns inputborder red for a short duration
 */
function turnInputRed() {
    let elements = document.getElementsByClassName('login-single-input-container');
    console.log(elements);
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
    let elements = document.getElementsByClassName('login-input');
    for (let i = 0; i < elements.length; i++) {
        elements[i].value = '';
    }
}

















/**
 * function checks the email and leads the user to reset.html
 */
function goToResetPage() {

    localStorage.removeItem('NoPasswordUser')
    let email = document.getElementById('email');
    let user = users.find(u => u.email == email.value);
    console.log(user);

    if (user) {

        userJSON = JSON.stringify(user);
        localStorage.setItem('NoPasswordUser', userJSON);

        window.location.href = 'reset.html?msg=Bitte gib ein neues Passwort ein!';


    } else {
        email.value = '';
        alert('Es existier kein Account mit dieser E-Mail!');
    }
}



function saveNewPassword() {

    let NoPasswordUser = localStorage.getItem('NoPasswordUser');
    let user = JSON.parse(NoPasswordUser);
    console.log(user);

    let firstPassword = document.getElementById('firstPassword').value;
    let secondPassword = document.getElementById('secondPassword').value;

    if (firstPassword == secondPassword) {

        let userEntrie = users.find(u => u.email == user['email']);
        userEntrie['password'] = firstPassword;

        const id = users.map(e => e.email).indexOf(userEntrie['email']);
        deleteUser(id);


        let NewUsername = userEntrie['username'];
        let NewEmail = userEntrie['email'];
        let newPassword = userEntrie['password'];




        saveNewPasswordFor(NewUsername, NewEmail, newPassword);






    } else {
        firstPassword = '';
        secondPassword = '';
        alert('Dein neues Passwort stimmt nicht überein, oder ist bereits dein altes Passwort!');
    }

}

async function saveNewPasswordFor(NewUsername, NewEmail, newPassword) {
    users.push({ username: NewUsername, email: NewEmail, password: newPassword});
    await backend.setItem('users', JSON.stringify(users));
}














/**
 * function deletes all user (only available in console)
 */
async function deleteUser() {
    await backend.deleteItem('users');
  }