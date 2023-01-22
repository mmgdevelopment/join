setURL('https://marcel-gregor.developerakademie.net/smallest_backend_ever');
let users = [];
let user;
let test;

async function loadData() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    setUser();
}

async function saveData() {
    await backend.setItem('users', JSON.stringify(users));
}

function setUser() {
    let emailUser = localStorage.getItem('user-email');
    user = users.find(u => u.email == emailUser);
}

async function initMain() {
    await loadData();
    includeHTML();
}

