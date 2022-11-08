setURL("https://gruppe-354.developerakademie.net/smallest_backend_ever");

let currentDraggedTask;
let doneSubtasks;
let subtaskDone;
let printExtraContactOnes;
let user;
let users = [];
let cardWasOpened = false;
let x = window.matchMedia("(max-width: 800px)");
x.addListener(checkWitdh);
let dummysPrinted = false
let kanbanCategorys = ["todo", "progress", "feedback", "done"]



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

addEventListener('drag', (event) => {
    if(!dummysPrinted){
        renderDummys();
    dummysPrinted = true
  }

});

addEventListener('drop', (event) => {

    if(dummysPrinted){
        dummysPrinted = false}
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


function renderDummys(){
  

kanbanCategorys.forEach(category => {
    if (findTaskId(currentDraggedTask)['category'] != category) {
        let peter = document.getElementById(category +"-tasks")
        peter.innerHTML += dummyCardHTML(category);
    }

  
});

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
  let draggedTask = findTaskId(currentDraggedTask);
  draggedTask["category"] = category;
  getAllEpics(user);
  saveData();
}

/**
 * This function gets the array of the task to make the category accessable
 *
 * @returns task array
 */

function findTaskId(id) {
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

 function findTaskEpic(id) {
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

function checkLocationContacts(contactInitials, task, contactName, i){
    if (cardWasOpened) {
        renderCardContactsHTML(contactInitials, task, contactName);
    }

    if(!cardWasOpened && printExtraContactOnes){
        if(i == 2){
            let extraContacts = '+' + (task["assignedTo"].length - 2)
           console.log(typeof extraContacts);
           document.getElementById('assigned'+ task['id']).innerHTML += `
           <div class="contact">${extraContacts}</div>`
          
            
            printExtraContactOnes = false;
    }else{
   
        renderAssignedContactsHTML(contactInitials, task);
    }}

}

function getAllSubtasks(task){

  let i = 0

    task["subtasks"].forEach(element => {
        document.getElementById(`openCardSubtasks`).innerHTML += renderSubtaskHTML(element.name, i, task["id"])
        i++ 
  });
  tickCheckBox(task)

}

function tickCheckBox(task){


    let i = 0

    task["subtasks"].forEach(element => {
        if (element.checked) {
            subtaskDone = true
            document.getElementById("subtaskCheckbox" + i).checked = true;
        }else{
            subtaskDone = false
            document.getElementById("subtaskCheckbox" + i).checked = false;
        }
        i++
  });
    
}

function taskIsDone(id){
    let task = findTaskId(id.toString().slice(1));
    let subtaskNumber = id.toString().slice(0,1);
   console.log(task["subtasks"][subtaskNumber].checked); 
    if(task["subtasks"][subtaskNumber].checked){
        task["subtasks"][subtaskNumber].checked = false
    }
    else{
        task["subtasks"][subtaskNumber].checked = true
        }
       
    saveData();
}

function checkSubtaskAmount(task){
    if(task['subtasks'].length){
        checkSubtasksDone(task);
        
        renderSubtaskBarHTML(task['id'], task, doneSubtasks, calcBarProgress(task))
    }
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

function calcBarProgress(task){
    let barProgress = doneSubtasks / task['subtasks'].length * 100
    return barProgress
}

async function saveData() {
    let emailUser = localStorage.getItem('user-email');
    const i = users.findIndex(u => u.email == emailUser);
    users[i] = user;
    await backend.setItem('users', JSON.stringify(users));
}

function openCard(id){
    cardWasOpened = true;
    let task = findTaskId(id);
    let epic = findTaskEpic(id)
document.getElementById('opened-card-container').classList.remove('d-none');
document.getElementById('opened-card-container').innerHTML = renderTaskCard(task, epic)
getAssignedContact(task);
getAllSubtasks(task);



}

function closeCard(){
    document.getElementById('opened-card-container').classList.add('d-none');
}

function dontClose(event){
    event.stopPropagation();
}