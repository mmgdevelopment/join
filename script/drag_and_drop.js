let currentDraggedTask;
let tasksDatabase;

/**
 * This function is used to start all functions included by visiting the webpage
 *
 */
function init() {
  includeHTML();
  readDatabase();
}

/**
 * This function is used to load a Json containing all tasks
 *
 */
async function readDatabase() {
  let url = `./script/tasks.json`;
  let response = await fetch(url);
  tasksDatabase = await response.json();
  getAllEpics(tasksDatabase);
}

/**
 * This function gets all epics of the database
 *
 * @param {object} allTasks
 */

function getAllEpics(allTasks) {
  clearColumns();
  let epics = allTasks["epics"];
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

function clearColumns() {
  document.getElementById("todo-tasks").innerHTML = "";
  document.getElementById("progress-tasks").innerHTML = "";
  document.getElementById("feedback-tasks").innerHTML = "";
  document.getElementById("done-tasks").innerHTML = "";
}

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

function startDragging(id) {
  currentDraggedTask = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  let draggedTask = findTask();
  draggedTask["category"] = category;
  console.log(draggedTask["category"]);
  getAllEpics(tasksDatabase);
}

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

function highlight(id) {
  document.getElementById(id).classList.add("area-highlight");
}
function removeHighlight(id) {
  document.getElementById(id).classList.remove("area-highlight");
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
