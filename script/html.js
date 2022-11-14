/**
 * This function is used to render the tasks on board.html
 *
 * @param {object} task
 * @param {object} epic
 */

function renderTask(task, epic) {
  return /*html*/ `
      <div onclick="openCard('${task["id"]}')" draggable="true" ondragstart="startDragging('${task["id"]}')" class="task-card">
      <span class="epic ${epic["color"]}">${epic["name"]}</span>
      <h4 class="task-name">${task["title"]}</h4>
      <p class="task-description">${task["description"]}</p>
      <div id="subtasks${task["id"]}" class="d-flex-jc-sb w-100">
      </div>
      <div class="d-flex-jc-sb w-100">
          <div id="assigned${task["id"]}" class="contacts">
          </div><img src="assets/${task["prio"]}.svg">
      </div>
  </div>`;
}

/**
 * This function is used to render the tasks on the opened card board.html
 *
 * @param {object} task
 * @param {object} epic
 */

function renderTaskCard(task, epic) {
  return /*html*/ `
      <div id="edit-area" onclick="dontClose(event)" class="task-card">
      <span class="epic ${epic["color"]}">${epic["name"]}</span>
      <h4 class="task-name">${task["title"]}</h4>
      <p class="task-description">${task["description"]}</p>
      <div class="wrapper">
      <div>
      <div><span>Due date:</span> ${task["dueDate"]}</div>
      <div><span>Priotity:</span><span class="priority ${task["prio"]}">${task["prio"]}<img class="prio_img" src="assets/${task["prio"]}.svg"</img></span></div>
      <div  id="contacts-on-card"><span>Assigned To:</span><div id="assignedContactCard${task["id"]}">
      </div> </div>
  </div> 
  <div id="openCardSubtasks">
  </div>
   <img onclick="closeCard('${task["id"]}')" class="close-btn" src="assets/close.svg"</img>
  <img onclick="openCardEdit('${task["id"]}')" class="edit-btn" src="assets/pencil_filled_square.svg"</img>`;
}
/*<span class="underlined" >Subtasks</span>*/



/**
 * This function renders the progressbar of the subtasks
 * 
 * @param {string} id 
 * @param {object} task 
 * @param {number} done 
 * @param {number} barProgress 
 */
function renderSubtaskBarHTML(id, task, done, barProgress) {
  document.getElementById("subtasks" + id).innerHTML = `
        <div class="bar" style="background-image:  linear-gradient(to right, #29ABE2 ${barProgress}%,#29ABE2 ${
    barProgress / 100
  }px, #f4f4f4 0%)"></div><span class="fw-700">${done}/${task["subtasks"].length} Done</span>`;
}

function renderSubtaskHTML(name, i, id) {
  return /* html*/ `
    <div class="d-flex-gap-20"><input id="subtaskCheckbox${i}" class="checkbox" type="checkbox" onclick="taskIsDone('${
    i + id
  }')"><div class="subtask-titel">${name}</div>`;
}

/**
 * This function is used to render the assigned people on board.html
 * The function will happen after renderTask, because its rendered in that tenplate.
 *
 * @param {object} task
 * @param {string} contact
 */
function renderAssignedContactsHTML(contact, task) {
  return `
    <div class="contact">${contact}</div>`;
}

function renderCardContactsHTML(contact, task, contactName) {
return`
   <div class="d-flex-gap-20"><div class="contact-on-card">${contact}</div><span class="contact-name">${contactName}</span></div>  `;
}

/**
 * This function removes the searchbar and puts it in Desktop view and changes the wording of the Addtask-Button
 * On board.html
 *
 */
function renderDesktopView() {
  document.getElementById("btn-add-task").innerHTML = "";
  document.getElementById("btn-add-task").innerHTML =
    'Add Task <img src="assets/plus-white.svg">';
  document.getElementById("mobile-search").innerHTML = "";
  document.getElementById("desktop-search").innerHTML =
    '<input id="search" placeholder="Find task" type="text" onkeyup="searchTask()"></input>';
}

/**
 * This function removes the searchbar and puts it in Mobile view and changes the wording of the Addtask-Button
 * On board.html
 *
 */
function renderMobileView() {
  document.getElementById("btn-add-task").innerHTML = "";
  document.getElementById("btn-add-task").innerHTML =
    '<img src="assets/plus-white.svg">';
  document.getElementById("desktop-search").innerHTML = "";
  document.getElementById("mobile-search").innerHTML =
    '<input id="search" placeholder="Find task" type="text" onkeyup="searchTask()"></input>';
}

function dummyCardHTML(id) {
  return `<div class="dummy-card" id="dummy-card${id}-tasks">
    <div>
    </div>
    </div>`;
}

function editTaskHTML(task){
  return /* html */ `
  <form>
  <label for="edit-title">Title</label>
                    <input type="text" placeholder="Enter a title" id="edit-title">
                    <label for="edit-description">Description</label>
                    <textarea id="edit-description" placeholder="Enter a Description" cols="30" rows="5"></textarea>
                    <label for="edit-dueDate">Due Date</label>
                    <input type="date" placeholder="" id="edit-dueDate">
                    <label>Prio</label>
                    <div class="row">
                        <!-- <button id="urgent" class="prioButton" onclick="prioButton('urgent')"> -->
                            Urgent
                            <img src="./assets/urgent.svg" alt="">
                        </button>
                        <!-- <button id="medium" class="prioButton" onclick="prioButton('medium')"> -->
                            Medium
                            <img src="./assets/medium.svg" alt="">
                        </button>
                        <!-- <button id="low" class="prioButton" onclick="prioButton('low')"> -->
                            Low
                            <img src="./assets/low.svg" alt="">
                        </button>

                        
                    </div>
                    
                    <label for="customSelect">Assigned</label>
                 
                    <!-- <div id="assigned" class="customSelect"> -->
<!--                     
                    </div> -->
                  
                    </div>
                    <div id="edit-assigned">
                        <!-- Content will be rendered by js-->
                    </div>

                    <label for="subtask">Subtasks</label>
                    <div id="subtask">
                        <div class="input" onclick="renderSubtaskInput()">
                            Add new subtask
                        </div>
                    </div>
                    <ul id="openCardSubtasks">
                        <!-- Content will be rendered by js-->
                    </ul>
  </form>
  
  
  `

}
