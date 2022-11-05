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
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    checkForGuestUser();
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

    if (userComesFromLogin()) {
        if(userHasMobileDevice()) {
            renderMobileGreeting();
        } else {
            renderDesktopGreeting();
        }
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
    return screen.width <= 1080
}


/**
 * function renders the mobile greeting screen and transitions to summary afterwards
 */
function renderMobileGreeting() {
    document.getElementById('mobile-greeting').style.display = "block";
    document.getElementById('body').classList.add("mobile-good-morning-body");
    document.getElementById('mobileGreeting-title').style="font-size: 36px;";
    document.getElementById('name-mobile').style="font-size: 47px;";
    renderName();
    localStorage.setItem('Go to summary from LogIn', false);
    setTimeout(renderSummary, 2000);
}


function renderDesktopGreeting() {
    document.getElementById('container').style.display = "block";
    renderName();
    localStorage.setItem('Go to summary from LogIn', false);
}


/**
 * function renders summary
 */
function renderSummary() {
    document.getElementById('body').classList.remove("mobile-good-morning-body");
    document.getElementById('mobile-greeting').style.display = "none";
    document.getElementById('greeting').style.display = "none";
    document.getElementById('container').style.display = "block";
}


/**
 * function renders username 
 */
function renderName() {
    if (username == 'Guest') {
        document.getElementById('greeting-title').innerHTML = 'Good morning';
        document.getElementById('mobileGreeting-title').innerHTML = 'Good morning';
    } else {
        document.getElementById('name-desktop').innerHTML = username;
        document.getElementById('name-mobile').innerHTML = username;
    }
}


/**
 * if guest is logged in, a guest account is pushed into users
 */
function checkForGuestUser() {
    if (username == 'Guest') {
        addGuestToUsers();
    }
}


/**
 * function adds guest account on first place in users JSON
 */
 function addGuestToUsers() {
    users.unshift({username: 'Guest', email: 'guest@mail.com', password: 'guest1234', epics: Array(7)});
}






/**
 * function leads to board
 */
function goToBorad() {
    window.location.href = "board.html";
}