let users = [
    {
        'username': 'gigachad420',
        'email': 'max@mustermann.com',
        'password': 'fiffi321'
    }
];


/**
 * function creates a new user and pushes him into users(Array).
 * SU => Sign Up
 */
function signUp() {

    let username = document.getElementById('usernameSU');
    let email = document.getElementById('emailSU');
    let password = document.getElementById('passwordSU');

    users.push({username: username.value, email: email.value, password: password.value});

    //Weiterleitung zur Login-Seite oder direkt zu join?

    document.getElementById('usernameSU').value = '';
    document.getElementById('emailSU').value = '';
    document.getElementById('passwordSU').value = '';

}


/**
 * function logs existing user into page and denies entrance to none existig users.
 * LI => Log In
 */
function login() {

    let email = document.getElementById('emailLI');
    let password = document.getElementById('passwordLI');

    let user = users.find(u => u.email == email.value && u.password == password.value);
    console.log(user);
    if(user) {
        console.log('User gefunden');
    }

}