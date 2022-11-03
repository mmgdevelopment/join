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
  
  
      <div class="d-flex-jc-sb w-100">
          <div id="assigned${task['id']}" class="contacts">
          </div><img class="priority" src="assets/${task["prio"]}.svg">
      </div>
  </div>`;
  }
  
  /*
  <!-- //// <div class="d-flex-jc-sb w-100">
  // <div class="bar"></div><span>1/${task["subTask"].length}</span>
  // </div> --> --> */


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
    console.log(document.getElementById("mobile-search"));
    document.getElementById("btn-add-task").innerHTML = "";
    document.getElementById("btn-add-task").innerHTML =
      '<img src="assets/plus-white.svg">';
    document.getElementById("desktop-search").innerHTML = "";
    document.getElementById("mobile-search").innerHTML =
      '<input id="search" placeholder="Find task" type="text"></input>';
  }
  
  