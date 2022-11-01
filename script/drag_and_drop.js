let todoList = document.getElementById('todo-tasks')


/**
 * This function is used to start all functions included by visiting the webpage
 *  
 */
function init(){
    includeHTML();
    readDatabase();
}


/**
 * This function is used to load a Json containing all tasks
 * 
 */
async function readDatabase(){
let url = `./script/tasks.json`;
let response = await fetch(url);
let allTasks = await response.json();
getAllEpics(allTasks);
}

/**
 * This function gets all epics of the database
 * 
 * @param {object} allTasks 
 */


function getAllEpics(allTasks){
let epics = allTasks["epics"]
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

function getAllTasks(epic){
    for (let i = 0; i < epic["tasks"].length; i++) {
        const task = epic["tasks"][i];
        console.log(task, epic);
        document.getElementById('todo-tasks').innerHTML += renderTask(task, epic)
        
    }
}



/**
 * This function is used to render the tasks in HTML
 * 
 * @param {object} task
 * @param {object} epic
 */
function renderTask(task, epic){
  
    /*html*/ return `
    <div class="task-card">
    <span class="epic ${epic["color"]}">${epic["name"]}</span>
    <h4 class="task-name">${task["name"]}</h4>
    <p class="task-description">${task["description"]}</p>


    <div class="d-flex-jc-sb w-100">
        <div class="contacts">
            <div class="contact">MC</div>
            <div class="contact">Tt</div>
        </div><img class="priority" src="assets/${task["priority"]}.svg">
    </div>
</div>`
}


    /*
<!-- //// <div class="d-flex-jc-sb w-100">
// <div class="bar"></div><span>1/${task["subTask"].length}</span>
// </div> --> --> */