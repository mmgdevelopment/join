setURL("https://gruppe-354.developerakademie.net/smallest_backend_ever");

let currentDraggedTask;
let doneSubtasks;
let subtaskDone;
let printExtraContactOnes;
let cardWasOpened = false;
let openEdit = false;
let x = window.matchMedia("(max-width: 800px)");
x.addListener(checkWitdh);
let dummysPrinted = false;
let kanbanCategorys = ["todo", "progress", "feedback", "done"];

/**
 * This function is used to start all functions included by visiting the webpage
 *
 */
async function init() {
  await loadData();
  includeHTML();
  startRender();
  checkWitdh(x);
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
}
/**
 * This function saves the Data on the server
 *
 */
async function saveData() {
  let emailUser = localStorage.getItem("user-email");
  const i = users.findIndex((u) => u.email == emailUser);
  users[i] = user;
  await backend.setItem("users", JSON.stringify(users));
}
/**
 * This function starts the rendering process (Its exists just to clearify code)
 *
 */

function startRender() {
  goThroughAllEpics();
}
/**
 * This function will be started when you start dragging a Task.
 *
 *
 */

addEventListener("drag", (event) => {
  if (!dummysPrinted) {
    renderPlaceholder();
    dummysPrinted = true;
  }
});

/**
 * This function will be started when you drop a Task.
 * It will just false the variable to make the previous function work again.
 *
 */

addEventListener("drop", (event) => {
  if (dummysPrinted) {
    dummysPrinted = false;
  }
});

/**
 * This function goes through all epics of the database to start rendering one after the other
 *
 *
 */

function goThroughAllEpics() {
  clearColumns();
  let epics = user["epics"];
  for (let i = 0; i < epics.length; i++) {
    const epic = epics[i];
    goThroughAllTasks(epic);
  }
}

/**
 * This function goes through all tasks of each epic and renders them
 *
 * @param {object} epic The object containing the tasks to be rendered
 */

function goThroughAllTasks(epic) {
  for (let i = 0; i < epic["tasks"].length; i++) {
    const task = epic["tasks"][i];
    getTasksCategory(task, epic);
  }
}

// function readTasksCategory(task, epic) {
//   if (task["category"] == "todo") {
//     renderCategoryTodo(task, epic);
//   }
//   if (task["category"] == "progress") {
//     renderCategoryProgress(task, epic);
//   }
//   if (task["category"] == "feedback") {
//     renderCategoryFeedback(task, epic);
//   }
//   if (task["category"] == "done") {
//     renderCategoryDone(task, epic);
//   }

// }

/**
 * This function checks the category of the task and starts the render process
 *
 * @param {object} task the task to be rendered
 * @param {object} epic the epic is just passed through fot the render process
 */

function getTasksCategory(task, epic) {
  kanbanCategorys.forEach((element) => {
    if (task["category"] == element) {
      document.getElementById(element + "-tasks").innerHTML += renderTask(
        task,
        epic
      );
    }
  });
  getAssignedContact(task);
  checkSubtaskAmount(task);
}

/**
 * This function puts a placeholder in every other coulmn of the kanban
 *
 */
function renderPlaceholder() {
  kanbanCategorys.forEach((category) => {
    if (findTaskById(currentDraggedTask)["category"] != category) {
      document.getElementById(category + "-tasks").innerHTML +=
        placeholderCardHTML(category);
    }
  });
}

/**
 * These following functions render the tasks in the specific kanban column
 *
 * @param {object} task
 * @param {object} epic
 */

// function renderCategoryTodo(task, epic) {
//     document.getElementById("todo-tasks").innerHTML += renderTask(task, epic);
//   }

// function renderCategoryProgress(task, epic) {
//   document.getElementById("progress-tasks").innerHTML += renderTask(task, epic);
// }

// function renderCategoryFeedback(task, epic) {
//   document.getElementById("feedback-tasks").innerHTML += renderTask(task, epic);
// }

// function renderCategoryDone(task, epic) {
//   document.getElementById("done-tasks").innerHTML += renderTask(task, epic);
// }

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
 * @param {string} id to indentify a task
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
 * This function changes the category of the task to the category its dropped in
 *
 * @param {string} category fixed category hardcoded in HTML
 */
function moveTo(category) {
  let draggedTask = findTaskById(currentDraggedTask);
  draggedTask["category"] = category;
  startRender();
  saveData();
}

/**
 * This function finds the task if you give it its ID
 *
 * @returns task
 */

function findTaskById(id) {
  for (let j = 0; j < user["epics"].length; j++) {
    const epic = user["epics"][j];
    for (let i = 0; i < epic["tasks"].length; i++) {
      const task = epic["tasks"][i];
      if (id == task["id"]) {
        return task;
      }
    }
  }
}

/**
 * This function finds the epic of an task give it its ID
 *
 * @returns epic
 */

function findEpicById(id) {
  for (let j = 0; j < user["epics"].length; j++) {
    const epic = user["epics"][j];
    for (let i = 0; i < epic["tasks"].length; i++) {
      const task = epic["tasks"][i];
      if (id == task["id"]) {
        return epic;
      }
    }
  }
}

/**
 *This function compares the query witdh choosen with the window witdh of the user and relocates the searchbar as needed
 *
 * @param {mediaquery} x
 */
function checkWitdh(x) {
  if (x.matches) {
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
  printExtraContactOnes = true;
  for (let i = 0; i < task["assignedTo"].length; i++) {
    const fullContact = task["assignedTo"][i]["name"];
    contact = fullContact.split(" ");
    const sureName = contact[0];
    const lastName = contact[1];
    let contactInitials = sureName.slice(0, 1) + lastName.slice(0, 1);
    checkLocationContacts(contactInitials, task, fullContact, i);
  }
}

/**
 * This function checks if the contacts has to be rendered on the open task card,
 * or on the kanban cards, or the edit card
 *
 * @param {string} contactInitials
 * @param {object} task
 * @param {string} contactName
 * @param {number} i
 */
function checkLocationContacts(contactInitials, task, contactName, i) {
  if (cardWasOpened) {
    if (openEdit) {
      renderEditContactsHTML(contactInitials, task);
    } else {
      renderCardContactsHTML(contactInitials, task, contactName);
    }
  }
  if (!cardWasOpened && printExtraContactOnes) {
    checkContactsToRender(contactInitials, task, contactName, i);
  }
}

/**
 * This function renders a max of 3 contacts. If there is more, it will print 2 and a number for how many are left.
 *
 * @param {string} contactInitials This is just given to the next function, it will be needed for rendering
 * @param {object} task
 * @param {string} contactName This isnt used here, the function is used for many other functions
 * @param {number} i to check the amount of printed items
 * @return just ends the loop
 */

function checkContactsToRender(contactInitials, task, contactName, i) {
  if (i <= 2 && task["assignedTo"].length <= 3) {
    renderAssignedContactsHTML(contactInitials, task);
    return;
  }
  if (i == 2 && task["assignedTo"].length >= 2) {
    printExtraContact(task);
  } else {
    renderAssignedContactsHTML(contactInitials, task);
  }
}

/**
 * This function renders the amount of extra contacts, which has to be shown.
 *
 * @param {object} task
 */

function printExtraContact(task) {
  let extraContacts = "+" + (task["assignedTo"].length - 2);
  document.getElementById("assigned" + task["id"]).innerHTML += `
    <div class="extra-contact contact">${extraContacts}</div>`;
  printExtraContactOnes = false;
}

/**
 * This function gets all the subtasks out of a task and puts its to an render
 *
 * @param {object} task
 */

function getAllSubtasks(task) {
  let i = 0;
  task["subtasks"].forEach((element) => {
    document.getElementById(`openCardSubtasks`).innerHTML += renderSubtaskHTML(
      element.name,
      i,
      task["id"]
    );
    i++;
  });
}

/**
 * This function ticks the checkboxs of the done tasks.
 *
 * @param {object} task
 */

function tickCheckBox(task) {
  let i = 0;
  task["subtasks"].forEach((element) => {
    if (element.checked) {
      subtaskDone = true;
      document.getElementById("subtaskCheckbox" + i).checked = true;
    } else {
      subtaskDone = false;
      document.getElementById("subtaskCheckbox" + i).checked = false;
    }
    i++;
  });
}

/**
 * This function switches the subtaskprocess to done when the checkbox is used,
 * or in progress depending of the state
 *
 * @param {string} id
 */

function taskIsDone(id) {
  let task = findTaskById(id.toString().slice(1));
  let subtaskNumber = id.toString().slice(0, 1);
  if (task["subtasks"][subtaskNumber].checked) {
    task["subtasks"][subtaskNumber].checked = false;
  } else {
    task["subtasks"][subtaskNumber].checked = true;
  }
  saveData();
}

/**
 * This function puts together the total subtasks and the done subtask, so it can be rendered
 *
 * @param {object} task
 */
function checkSubtaskAmount(task) {
  if (task["subtasks"].length) {
    checkSubtasksDone(task);
    renderSubtaskBarHTML(task["id"], task, doneSubtasks, calcBarProgress(task));
  }
}

/**
 * This function checks how many subtasks are done
 *
 * @param {object} task
 */

function checkSubtasksDone(task) {
  doneSubtasks = 0;
  for (let i = 0; i < task["subtasks"].length; i++) {
    const subtask = task["subtasks"][i];
    if (subtask["checked"]) {
      doneSubtasks++;
    }
  }
}

/**
 * This function calc the progress in percent
 *
 * @param {object} task
 * @returns {number} how long the progressbar is
 */

function calcBarProgress(task) {
  let barProgress = (doneSubtasks / task["subtasks"].length) * 100;
  return barProgress;
}

/**
 * This function opens the taskcard you click on
 *
 *@param {string} id
 */
function openCard(id) {
  cardWasOpened = true;
  let task = findTaskById(id);
  let epic = findEpicById(id);
  openCardHTML(id, epic, task);
  getAssignedContact(task);
  getAllSubtasks(task);
  tickCheckBox(task);
}

/**
 * This function closes the taskcard.
 *
 *@param {string} id
 */
function closeCard(id) {
  cardWasOpened = false;
  openEdit = false;
  closeCardHTML();
  checkSubtaskAmount(findTaskById(id));
}

/**
 * This function changes the Opencard so it can be edited
 *
 * @param {sting} id
 */
function openCardEdit(id) {
  closeCard(id);
  document.getElementById('fullscreen').style.display = 'block';
  document.getElementById('headline').innerHTML = 'Edit Task';
  document.getElementById("createTask").onclick = () => {
    editTask(id);
  };
  document.getElementById("createTask").innerText = 'save'
  document.getElementById("clear").innerText = 'delete'
  document.getElementById("clear").onclick = () => {
    deleteTask(id);
  }
  renderCategorySelector();
  renderContactSelector();
  let task = findTaskById(id);
  fillAllInputs(task, id);
  // document.getElementById(`edit-area`).innerHTML = editTaskHTML(id);
}

/**
 * This function shows the addtatask template
 *
 * @param {string} category if given the task will be generated in this category. Default is todo
 */
function showAddTask(category) {
  document.getElementById("fullscreen").style.display = "block";
  document.getElementById('headline').innerHTML = 'Add Task';
  document.getElementById("createTask").onclick = () => {
    createTaskButtonTouched(category);
  };
  renderCategorySelector();
  renderContactSelector();
}

/**
 * This function fills the input of the editCard with the information of the task which is to be edit
 *
 * @param {object} task
 */

function fillAllInputs(task, id) {
  document.getElementById("title").value = task["title"];
  document.getElementById("description").value = task["description"];
  showCategoryInEditTasks(id);
  showAssignedContactsInEditTasks(task);
  document.getElementById("dueDate").value = task["dueDate"];
  prioButton(task.prio); // rename to showActivePrioButton?
  showSubtasksInEditTasks(task);
}

function showCategoryInEditTasks(id) {
  let category = findEpicById(id);
  let firstValue = document.getElementById('firstValue')
  firstValue.innerHTML = `
    ${category.name}
    <div class="color ${category.color}"></div> 
    `
}

function showAssignedContactsInEditTasks(task) {
  assignedTo = task.assignedTo;
  renderContactsFromArray(); // checkbox need to be checked
}

function showSubtasksInEditTasks(task) {
  let subtasks = task.subtasks;
  if (subtasks.length) {
    for (let i = 0; i < subtasks.length; i++) {
      const subtask = subtasks[i];
      console.log(subtask);
      document.getElementById('subtaskList').innerHTML += subtasklistTemplate(subtask.name, i);
    }
  }
}

/**
 * This function deletes the task
 *
 * @param {string} id
 */

function deleteTask(id) {
  let epic = findEpicById(id);
  index = epic.tasks.findIndex((x) => x.id === id);
  epic.tasks.splice(index, 1);
  saveData();
  cardWasOpened = false;
  openEdit = false;
  document.getElementById("fullscreen").style.display = "none";
  document.getElementById("opened-card-container").classList.add("d-none");
  startRender();
}

/**
 * This function ask if you really want to delete a task to prevent missclicks
 *
 * @param {string} id
 */
function askDeleteTask(id) {
  document.getElementById(`opened-card-container`).innerHTML =
    askDeleteHTML(id);
}

/**
 * This function saves the inputs of the edited task
 *
 * @param {string} id
 */
function editTask(id) {
  let task = findTaskById(id);
  if (allInputsFilled()) {
    task.title = document.getElementById("title").value;
    task.description = document.getElementById("description").value;
    task.dueDate = document.getElementById("dueDate").value;
    // task.assignedTo = assignedTo;
    task.prio = returnPrioState();
    // task.subtasks = getSubtasks();
  }
  document.getElementById("fullscreen").style.display = "none";
  document.getElementById("opened-card-container").classList.add("d-none");
  startRender();
  saveData();
  goThroughAllEpics();
}

/**
 * This function prevents the windows from closing if pressed on
 *
 * @param {event} event
 */
function dontClose(event) {
  event.stopPropagation();
}
