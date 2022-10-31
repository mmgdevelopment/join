setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');

let users = [];

let user;
let email;
let username;





async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];

    loadUser();
    renderName();
}


function loadUser() {
    email = localStorage.getItem('Logged in user-email');
    user = users.find(u => u.email == email)
    username = user['username'];
}


function renderName() {
    document.getElementById('name').innerHTML = username;
}