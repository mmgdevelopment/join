setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');


let users = [];
let email;
let username;

let epicsArray = [
    {
        "name": "Backoffice",
        "color": "blue",
        "tasks": []
    },
    {
        "name": 'Marketing',
        "color": 'red',
        "tasks": []
    },
    {
        "name": 'Development',
        "color": 'orange',
        "tasks": []
    }
]


/**
 * function renders summary page and loads array with users form backend
 */
async function init() {
    loadUser();
    renderGreeting();
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    checkForGuestUser();
    renderPage();
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
    users.unshift({ username: 'Guest', email: 'guest@mail.com', password: 'guest1234', epics: epicsArray });
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


let workingStages = [];
let urgency = [];
let allDueDates = [];

let inBoard;
let inProgress;
let awaitingFeedback;

let year;
let day;
let month;

let toDo;
let done;


/**
 * function renders the whole summary page
 * init
 */
function x() {
    renderPage();
}


/**
 * function renders whole page
 */
function renderPage() {
    getAllInfoFromUsers();
    renderAllWorkingStages();
    renderHighestPrio();
}


/**
 * This function goes through all epics of the database.
 */

function getAllInfoFromUsers() {
    let indexOfUser = users.findIndex(u => u.email == email);
    let epics = users[indexOfUser]['epics'];
    for (let i = 0; i < epics.length; i++) {
        const epic = epics[i];
        getAllTasks(epic);
    }
}

/**
   * This function goes through all tasks of each epic
   * @param {object} epic
   */

function getAllTasks(epic) {
    for (let i = 0; i < epic["tasks"].length; i++) {
        const task = epic["tasks"][i];
        pushPrioAndDate(task);
        pushAllWorkingStages(task);
    }
}


/**
 * function pushes the prio of all tasks and their due date into urgency json
 * @param {array} task 
 */
 function pushPrioAndDate(task) {
    urgency.push({ 'prio': task['prio'], 'date': task['dueDate'] });
}


/**
 * function pushes all categories into array
 * @param {array} task 
 */
function pushAllWorkingStages(task) {
    workingStages.push(task['category']);
}


/**
 * function rendersall amounts of tasks in diffrent working stages
 */
function renderAllWorkingStages() {
    getAllTasksNumbers();
    displayAllTaksNumbers();
}


/**
 * function gets all amounts of tasks in diffrent working stages and puts them into variables
 */
function getAllTasksNumbers() {
    toDo = (workingStages.filter(x => x === 'todo').length);
    inProgress = (workingStages.filter(x => x === 'progress').length);
    awaitingFeedback = (workingStages.filter(x => x === 'feedback').length);
    done = (workingStages.filter(x => x === 'done').length);
    inBoard = (toDo + inProgress + awaitingFeedback);
}


/**
 * function displays all amounts of tasks in diffrent working stages
 */
function displayAllTaksNumbers() {
    document.getElementById('inBoard').innerHTML = inBoard;
    document.getElementById('inProgress').innerHTML = inProgress;
    document.getElementById('awaitingFeedback').innerHTML = awaitingFeedback;
    document.getElementById('toDo').innerHTML = toDo;
    document.getElementById('done').innerHTML = done;
}


/**
 * function renders the task with the highest priority
 */
function renderHighestPrio() {
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


/**
 * function checks if and how often a certain urgency is given in epics
 * @param {string} value 
 * @returns number
 */
function urgencyContains(value) {
    return urgency.filter((v) => (v.prio === value)).length;
}


/**
 * function displays the task with the highest priority in middle card
 * @param {string} value 
 */
function displayHighestPrioTask(value) {
    let prio = value.charAt(0).toUpperCase() + value.slice(1);
    let prioAmount = urgencyContains(value);

    document.getElementById('prio').innerHTML = prio;
    document.getElementById('prio-amount').innerHTML = prioAmount;
    document.getElementById('prio-img').src = `./assets/${value}.svg`;
    document.getElementById('prio-img-container').classList.add(value);

    displayDueDate(value);
}


/**
 * function displays the due date with the highest priority in middle card
 * @param {string} value 
 */
function displayDueDate(value) {
    pushAllDueDatesInArray(value);
    getNearestDueDate();
    let nearestDeadline = `${month} ${day}, ${year}`
    document.getElementById('deadline').innerHTML = nearestDeadline;
    document.getElementById('deadlineText').innerHTML = 'Upcoming Deadline';
}


/**
 * function pushes all due dates with highest urgency into array
 * @param {string} value 
 * @param {array} allDueDates 
 */
function pushAllDueDatesInArray(value) {
    let allHighestPrio = urgency.filter((v) => (v.prio === value));
    for (let i = 0; i < urgencyContains(value); i++) {
        const element = allHighestPrio[i]['date'];
        allDueDates.push(element);
    }
}


/**
 * function finds the nearest due date from all dates with highest urgency
 */
function getNearestDueDate() {
    allDueDates = allDueDates.sort();
    let dateInNumbers = allDueDates[0];
    year = dateInNumbers.substr(0, 4);
    day = dateInNumbers.substr(8, 2);
    getMonthInLetters(dateInNumbers);
}


/**
 * function changes month number into month written
 * @param {number} dateInNumbers 
 */
function getMonthInLetters(dateInNumbers) {
    let monthNumber = + (dateInNumbers.substr(5, 2) - 1);
    let allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (let i = 0; i < 12; i++) {
        if (monthNumber == i) {
            month = allMonths[i];
        }
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


function displayNoTasks() {
    console.log('will be designed later');
}