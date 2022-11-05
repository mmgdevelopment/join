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


    console.log(users);
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
        if (userHasMobileDevice()) {
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
    document.getElementById('mobileGreeting-title').style = "font-size: 36px;";
    document.getElementById('name-mobile').style = "font-size: 47px;";
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
    users.unshift({ username: 'Guest', email: 'guest@mail.com', password: 'guest1234', epics: Array(7) });
}


/**
 * function leads to board
 */
function goToBorad() {
    window.location.href = "board.html";
}


/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


let taskInBoard;
let taskInProgress;
let awaitingFeedback;

let urgency = [];

let toDo;
let done;







function renderMidCard() {
    let indexOfUser = users.findIndex(u => u.email == email);
    let epics = users[indexOfUser]['epics'];

    for (let i = 0; i < epics.length; i++) {
        const epic = epics[i];
        // getAllTasks(epic);
        for (let i = 0; i < epic["tasks"].length; i++) {
            const task = epic["tasks"][i];
            urgency.push({ 'prio': task['prio'], 'date': task['dueDate'] });
        }
    }
    showHighestPrio();
}



function showHighestPrio() {
    if (urgencyContains('urgent') > 0) {
        displayHighestPrioTask('urgent');
    } else {
        if (urgencyContains('medium') > 0) {
            displayHighestPrioTask('medium');
        } else {
            if (urgencyContains('low') > 0) {
                displayHighestPrioTask('low');
            } else {
                displayNoTasks();
            }
        }
    }
}

function urgencyContains(value) {
    return urgency.filter((v) => (v.prio === value)).length;
}


function displayHighestPrioTask(value) {

    let prio = value.charAt(0).toUpperCase() + value.slice(1);
    let prioAmount = urgencyContains(value);

    document.getElementById('prio').innerHTML = prio;
    document.getElementById('prio-amount').innerHTML = prioAmount;
    document.getElementById('prio-img').src = `./assets/${value}.svg`;
    document.getElementById('prio-img-container').classList.add(value);




    let d = urgency.filter((v) => (v.prio === value));
    let dates = [];

    for (let i = 0; i < urgencyContains(value); i++) {
        const element = d[i]['date'];
        dates.push(element);
    }
    dates = dates.sort();

    let dateInNumbers = dates[0];

    let year = dateInNumbers.substr(0, 4);


    let day = dateInNumbers.substr(8, 2);


    let monthNumber = + (dateInNumbers.substr(5, 2) - 1);
    let allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let month;

    for (let i = 0; i < 12; i++) {
        if (monthNumber == i) {
            month = allMonths[i];
        }

    }


    let nearestDeadline = `${month} ${day}, ${year}`

    document.getElementById('deadline').innerHTML = nearestDeadline;

}













































































function displayNoTasks() {
    console.log('will be designed later');
}