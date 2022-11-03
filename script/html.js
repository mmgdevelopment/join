/**
 * This function is used to render the tasks on board.html
 *
 * @param {object} task
 * @param {object} epic
 */

 function renderTask(task, epic) {
    return `
      <div draggable="true" ondragstart="startDragging('${task["id"]}')" class="task-card">
      <span class="epic ${epic["color"]}">${epic["name"]}</span>
      <h4 class="task-name">${task["title"]}</h4>
      <p class="task-description">${task["description"]}</p>
  

      <div id="subtasks${task["id"]}" class="d-flex-jc-sb w-100">
      
      </div>
  
      <div class="d-flex-jc-sb w-100">
          <div id="assigned${task['id']}" class="contacts">
          </div><img class="priority" src="assets/${task["prio"]}.svg">
      </div>
  </div>`;
  }
 
function renderSubtaskHTML(id, task, done, barProgress){
        document.getElementById('subtasks'+ id).innerHTML = `
        <div class="bar" style="background-image:  linear-gradient(to right, #29ABE2 ${barProgress}%,#29ABE2 ${barProgress/100}px, #f4f4f4 0%)"></div><span>${done}/${task['subtasks'].length}</span>`
}

  /**
 * This function is used to render the assigned people on board.html
 * The function will happen after renderTask, because its rendered in that tenplate.
 *
 * @param {object} task
 * @param {string} contact
 */
  function renderAssignedContactsHTML(contact, task){      
    document.getElementById('assigned'+ task['id']).innerHTML += `
    <div class="contact">${contact}</div>`
    
}

/**
 * This function removes the searchbar and puts it in Desktop view and changes the wording of the Addtask-Button
 * On board.html 
 *
 */
 function renderDesktopView() {
    document.getElementById("btn-add-task").innerHTML = "";
    document.getElementById("btn-add-task").innerHTML = 'Add Task <img src="assets/plus-white.svg">';
    document.getElementById("mobile-search").innerHTML = "";
    document.getElementById("desktop-search").innerHTML =
      '<input id="search" placeholder="Find task" type="text"></input>';
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
      '<input id="search" placeholder="Find task" type="text"></input>';
  }
  
  