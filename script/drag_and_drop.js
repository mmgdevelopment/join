setURL("https://gruppe-354.developerakademie.net/smallest_backend_ever");

let currentDraggedTask;
let doneSubtasks;
let subtaskDone;
let printExtraContactOnes;
let cardWasOpened = false;
let openEdit = false
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
 * This function will be started when you start dragging a Task.
 *
 *
 */

addEventListener("drag", (event) => {
  if (!dummysPrinted) {
    renderDummys();
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
}

/**
 * This function goes through all epics of the database.
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
    getTasksCategory(task, epic);
    task, epic;
  }
}

/**
 * This function checks the category of the task and starts the render process
 *
 * @param {object} task
 * @param {object} epic
 */

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
 * This function puts a placeholder in every coulmn of the kanban
 *
 */
function renderDummys() {
  kanbanCategorys.forEach((category) => {
    if (findTaskById(currentDraggedTask)["category"] != category) {
      document.getElementById(category + "-tasks").innerHTML +=
        dummyCardHTML(category);
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
  let draggedTask = findTaskById(currentDraggedTask);
  draggedTask["category"] = category;
  getAllEpics(user);
  saveData();
}

/**
 * This function gets the array of the task to make the category accessable
 *
 * @returns task array
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
 * This function returns the epic which contains the given ID
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
 *This function compares the query witdh choosen with the window witdh of the user
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
    const fullContact = task["assignedTo"][i];
    contact = fullContact.split(" ");
    const sureName = contact[0];
    const lastName = contact[1];
    let contactInitials = sureName.slice(0, 1) + lastName.slice(0, 1);
    checkLocationContacts(contactInitials, task, fullContact, i);
  }
}

/**
 * This function checks if the contacts has to be rendered on the open task card,
 * or on the kanban cards
 *
 * @param {string} contactInitials
 * @param {object} task
 * @param {string} contactName
 * @param {number} i
 */
function checkLocationContacts(contactInitials, task, contactName, i) {


  if (cardWasOpened) {
    if (openEdit) {
      renderEditContactsHTML(contactInitials, task)
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
 * @param {string} contactInitials
 * @param {object} task
 * @param {string} contactName
 * @param {number} i
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
 * This function gets all the subtasks out of a task
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
  tickCheckBox(task);
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
 * This function switches the done when the checkbox is used
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
 * This function checks how many subtasks the task has
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
 * This function opens the taskcard you click on
 *
 */
function openCard(id) {
  cardWasOpened = true;
  let task = findTaskById(id);
  let epic = findEpicById(id);
  document.getElementById('opened-card-container').setAttribute('onclick', `closeCard('${id}')`);
  document.getElementById("opened-card-container").classList.remove("d-none");
  document.getElementById("opened-card-container").innerHTML = renderTaskCard(
    task,
    epic
  );
  getAssignedContact(task);
  getAllSubtasks(task);
}

/**
 * This function closes the taskcard.
 *
 */
function closeCard(id) {
  cardWasOpened = false;
  openEdit = false;
  document.getElementById('fullscreen').style.display = 'none'
  document.getElementById("opened-card-container").classList.add("d-none");
  checkSubtaskAmount(findTaskById(id))

}



function openCardEdit(id) {
  openEdit = true
  document.getElementById(`edit-area`).innerHTML = editTaskHTML(id);
  let task = findTaskById(id);
  fillAllInputs(task);
  getAssignedContact(task);
  getAllSubtasks(task);
}

function showAddTask(category) {
  document.getElementById('fullscreen').style.display = 'block';
  document.getElementById('createTask').onclick = () => { createTestTask(category) };
  renderCategorySelector();
  renderContactSelector();
}





function fillAllInputs(task) {
  document.getElementById('edit-title').value = task["title"];
  document.getElementById('edit-description').value = task["description"]
  document.getElementById('edit-dueDate').value = task["dueDate"]


}

function deleteTask(id) {
  let epic = findEpicById(id)
  let cuttedID = id.match(/[0-9]/)[0];
  let task = +cuttedID - 1
  epic.tasks.splice(task, 1)
  saveData();
  closeCard(id);
  startRender();



}

function askDeleteTask(id) {
  document.getElementById(`opened-card-container`).innerHTML = askDeleteHTML(id);
}

function editTask(id) {
  let task = findTaskById(id)
  task.title = document.getElementById('edit-title').value
  task.description = document.getElementById('edit-description').value
  task.dueDate = document.getElementById('edit-dueDate').value
  saveData();
  closeCard(id);
  startRender();

}


















function editTaskHTML(id) {
  return /* html */ `

  <img onclick="closeCard('${id}')" id="close" src="./assets/close.svg" alt="">
  <div>
      <div>

          <div class="inputContainer">
              <label for="edit-title">Title</label>
              <input type="text" placeholder="Enter a title" id="edit-title">
              <div id="titleValidation" class="formValidation">
                  <span>This field is required</span>
              </div>
          </div>
          <div class="inputContainer">
              <label for="edit-description">Description</label>
              <textarea id="edit-description" placeholder="Enter a Description" cols="30" rows="5"></textarea>
              <div id="descriptionValidation" class="formValidation">
                  <span>This field is required</span>
              </div>
          </div>
          <div class="inputContainer">
              <label for="edit-dueDate">Due Date</label>
              <input type="date" placeholder="" id="edit-dueDate">
              <div id="dueDateValidation" class="formValidation">
                  <span>This field is required</span>
              </div>
          </div>
          <div class="inputContainer">
              <label for="customSelect">Assigned</label>
              <div id="assigned" class="customSelect">
                  <!-- Content will be rendered by js-->
              </div>
              <div id="assignedToValidation" class="formValidation">
                  <span>This field is required</span>
              </div>
              <div id="edit-assignedTo">
                  <!-- Content will be rendered by js-->
              </div>
          </div>
      </div>
      <div>
          <div class="inputContainer">
              <label>Prio</label>
              <div class="row">
                  <button id="urgent" class="prioButton" onclick="prioButton('urgent')">
                      Urgent
                      <img src="./assets/urgent.svg" alt="">
                  </button>
                  <button id="medium" class="prioButton" onclick="prioButton('medium')">
                      Medium
                      <img src="./assets/medium.svg" alt="">
                  </button>
                  <button id="low" class="prioButton" onclick="prioButton('low')">
                      Low
                      <img src="./assets/low.svg" alt="">
                  </button>
              </div>
              <div id="prioStateValidation" class="formValidation">
                  <span>This field is required</span>
              </div>
          </div>
          <div class="inputContainer">
              <label for="subtask">Subtasks</label>
              <div id="subtask">
                  <div class="input" onclick="renderSubtaskInput()">
                      Add new subtask
                  </div>
              </div>
              <div id="openCardSubtasks"> </div> 
              <!-- <ul id="subtaskList"> -->
                  <!-- Content will be rendered by js-->
              <!-- </ul> --> -->
          </div>

          <div class="buttonContainer">
              <div onclick="askDeleteTask('${id}');" class="button" id="delete">
                  Delete task
                  <img src="./assets/clear.svg" alt="">
              </div>
              <div onclick="editTask('${id}')" class="button" id="createTask">
                  Save changes
                  <img src="./assets/createTask.svg" alt="">
              </div>
          </div>
      </div>
  </div>
  <div id="addedToBoard">
      <span>Task added to board</span>
      <img src="./assets/board.svg" alt="">
  </div>

  `
}
