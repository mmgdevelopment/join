let currentDraggedTask;
let tasksDatabase;
let x = window.matchMedia("(max-width: 850px)");
x.addListener(checkWitdh); // Attach listener function on state changes

/**
 * This function is used to start all functions included by visiting the webpage
 *
 */
async function init() {
  includeHTML();
  await readDatabase();
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
 * This function is used to load a Json containing all tasks
 *
 */
async function readDatabase() {
  let url = `./script/tasks.json`;
  let response = await fetch(url);
  tasksDatabase = await response.json();
}

/**
 * This function clears the HTML and goes through all epics of the database.
 *
 *
 */

function getAllEpics() {
  clearColumns();
  let epics = tasksDatabase["epics"];
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
  getAllEpics(tasksDatabase);
}

/**
 * This function gets the array of the task to make the category accessable
 *
 * @returns task array
 */

function findTask() {
  for (let j = 0; j < tasksDatabase["epics"].length; j++) {
    const epic = tasksDatabase["epics"][j];

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
 * This function removes the searchbar and puts it in Mobile view and changes the wording of the Addtask-Button
 *
 *
 */
function renderMobileView() {
  console.log("smal");
  console.log(document.getElementById("mobile-search"));
  document.getElementById("btn-add-task").innerHTML = "";
  document.getElementById("btn-add-task").innerHTML =
    '<img src="assets/plus-white.svg">';
  document.getElementById("desktop-search").innerHTML = "";
  document.getElementById("mobile-search").innerHTML =
    '<input id="search" placeholder="Find task" type="text"></input>';
}

/**
 * This function removes the searchbar and puts it in Desktop view and changes the wording of the Addtask-Button
 *
 *
 */
function renderDesktopView() {
  console.log("big");
  console.log(document.getElementById("desktop-search"));
  document.getElementById("btn-add-task").innerHTML = "";
  document.getElementById("btn-add-task").innerHTML = 'Add Task <img src="assets/plus-white.svg">';
  document.getElementById("mobile-search").innerHTML = "";
  document.getElementById("desktop-search").innerHTML =
    '<input id="search" placeholder="Find task" type="text"></input>';
}

/**
 * This function is used to render the tasks in HTML
 *
 * @param {object} task
 * @param {object} epic
 */

function renderTask(task, epic) {
  return `
    <div draggable="true" ondragstart="startDragging('${task["id"]}')" class="task-card">
    <span class="epic ${epic["color"]}">${epic["name"]}</span>
    <h4 class="task-name">${task["name"]}</h4>
    <p class="task-description">${task["description"]}</p>


    <div class="d-flex-jc-sb w-100">
        <div class="contacts">
            <div class="contact">MC</div>
            <div class="contact">Tt</div>
        </div><img class="priority" src="assets/${task["priority"]}.svg">
    </div>
</div>`;
}

/*
<!-- //// <div class="d-flex-jc-sb w-100">
// <div class="bar"></div><span>1/${task["subTask"].length}</span>
// </div> --> --> */
