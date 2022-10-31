setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');


let users = [];
let email;
let username;


/**
 * function renders summary page and loads array with users form backend
 */
async function init() {
    loadUser();
    renderGreeting();
    renderName();

    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
}


/**
 * function loads email and username into variables
 */
function loadUser() {
    email = localStorage.getItem('user-email');
    username = localStorage.getItem('user-username');
}


/**
 * function renders greetings depending on login and device width
 */
function renderGreeting() {

    if (userComesFromLogin() && userHasMobileDevice()) {
        renderMobileGreeting();
    } else {
        renderSummary();
    }

}


/**
 * @returns if user comes from login or not
 */
function userComesFromLogin() {
    return localStorage.getItem('Go to summary from LogIn') == 'true'
}


/**
 * @returns if user has mobile device or not
 */
function userHasMobileDevice() {
    return screen.width <= 1100
}


/**
 * function renders the mobile greeting screen and transitions to summary afterwards
 */
function renderMobileGreeting() {
    document.getElementById('mobile-greeting').style.display = "block";
    document.getElementById('body').classList.add("mobile-good-morning-body");
    document.getElementById('mobileGreeting-title').style="font-size: 36px;";
    document.getElementById('name').style="font-size: 47px;";
    localStorage.setItem('Go to summary from LogIn', false);
    setTimeout(renderSummary, 2000);
}


/**
 * function renders summary
 */
function renderSummary() {
    document.getElementById('mobile-greeting').style.display = "none";
    document.getElementById('container').style.display = "block";
}


/**
 * function renders username 
 */
function renderName() {
    document.getElementById('name').innerHTML = username;
}