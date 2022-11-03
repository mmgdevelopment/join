setURL("https://gruppe-354.developerakademie.net/smallest_backend_ever");

let currentDraggedTask;
let doneSubtasks;
let user;
let users = [];
let x = window.matchMedia("(max-width: 850px)");
x.addListener(checkWitdh); // Attach listener function on state changes

/**
 * This function is used to start all functions included by visiting the webpage
 *
 */
async function init() {
  await loadData();
  includeHTML();
  //   await readDatabase();
  startRender();
  checkWitdh(x);
}

/**
 * This function starts the rendering process
 *
 */
function startRender() {
  getAllEpics();
}

/**
 * This function is used to load a Json containing all users and the tasks of the user
 *
 */
async function loadData() {
  await downloadFromServer();
  users = JSON.parse(backend.getItem("users")) || [];
  let emailUser = localStorage.getItem("user-email");
  user = users.find((u) => u.email == emailUser);
  // setInitialCategorysIfNotExist();
}

/**
 * This function clears the HTML and goes through all epics of the database.
 *
 *
 */

function getAllEpics() {
  clearColumns();
  let epics = user["epics"];
  for (let i = 0; i < epics.length; i++) {
    const epic = epics[i];
    getAllTasks(epic);
  }
}

/**
 * This function goes through all tasks of each epic
 *
 * @param {object} epic
 */

function getAllTasks(epic) {
  for (let i = 0; i < epic["tasks"].length; i++) {
    const task = epic["tasks"][i];
    readTasksCategory(task, epic);
  }
}

/**
 * This function checks the category of the task and starts the render process
 *
 * @param {object} task
 * @param {object} epic
 */

function readTasksCategory(task, epic) {
  if (task["category"] == "todo") {
    renderCategoryTodo(task, epic);
  }
  if (task["category"] == "progress") {
    renderCategoryProgress(task, epic);
  }
  if (task["category"] == "feedback") {
    renderCategoryFeedback(task, epic);
  }
  if (task["category"] == "done") {
    renderCategoryDone(task, epic);
  }
  getAssignedContact(task);
  checkSubtaskAmount(task);
}


/**
 * These following functions render the tasks in the specific kanban column
 *
 * @param {object} task
 * @param {object} epic
 */
function renderCategoryTodo(task, epic) {
  document.getElementById("todo-tasks").innerHTML += renderTask(task, epic);
}

function renderCategoryProgress(task, epic) {
  document.getElementById("progress-tasks").innerHTML += renderTask(task, epic);
}

function renderCategoryFeedback(task, epic) {
  document.getElementById("feedback-tasks").innerHTML += renderTask(task, epic);
}

function renderCategoryDone(task, epic) {
  document.getElementById("done-tasks").innerHTML += renderTask(task, epic);
}

/**
 * This function clears the content of every column of the kanban
 *
 */

function clearColumns() {
  document.getElementById("todo-tasks").innerHTML = "";
  document.getElementById("progress-tasks").innerHTML = "";
  document.getElementById("feedback-tasks").innerHTML = "";
  document.getElementById("done-tasks").innerHTML = "";
}

/**
 * This function changes the ID of the currentDraggedTaske to the dragged item ones
 *
 * @param {string} id
 */

function startDragging(id) {
  currentDraggedTask = id;
}

/**
 * This function change the behaivior to be able to drop an item
 *
 * @param {event} ev
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * This function changes the category to the one its dropped in
 *
 * @param {string} category
 */
function moveTo(category) {
  let draggedTask = findTask();
  draggedTask["category"] = category;
  getAllEpics(user);
}

/**
 * This function gets the array of the task to make the category accessable
 *
 * @returns task array
 */

function findTask() {
  for (let j = 0; j < user["epics"].length; j++) {
    const epic = user["epics"][j];

    for (let i = 0; i < epic["tasks"].length; i++) {
      const task = epic["tasks"][i];
      if (currentDraggedTask == task["id"]) {
        return task;
      }
    }
  }
}

/**
 * This function adds a css class as highlight for the kanban column which is dragged over
 *
 * @param {string} id
 */

function highlight(id) {
  document.getElementById(id).classList.add("area-highlight");
}

/**
 * This function removes a css class of the kanban column which was used to higlight while dragged over
 *
 * @param {string} id
 */

function removeHighlight(id) {
  document.getElementById(id).classList.remove("area-highlight");
}

/**
 *This function compares the query witdh choosen with the window witdh of the user
 *
 * @param {mediaquery} x
 */
function checkWitdh(x) {
  if (x.matches) {
    // If media query matches
    renderMobileView();
  } else {
    renderDesktopView();
  }
}

/**
 * This function takes the username and gives out the initials e.g. Kevin Lentz = KL
 * 
 * @param {object} task 
 */

function getAssignedContact(task) {
    console.log(task['subtasks']);
  for (let i = 0; i < task["assignedTo"].length; i++) {
    const fullContact = task["assignedTo"][i];
    contact = fullContact.split(" ");
    const sureName = contact[0];
    const lastName = contact[1];
    let contactInitials = sureName.slice(0, 1) + lastName.slice(0, 1);
    renderAssignedContactsHTML(contactInitials, task);
  }
}


function checkSubtaskAmount(task){
    if(task['subtasks'].length){
        checkSubtasksDone(task);
        renderSubtaskHTML(task['id'], task, doneSubtasks);}
}

function checkSubtasksDone(task){
    doneSubtasks = 0
 for (let i = 0; i < task['subtasks'].length; i++) {
    const subtask =  task['subtasks'][i];
    if(subtask['checked']){
        doneSubtasks++
    
    }
    
 }

}
