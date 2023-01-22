async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    showCurrentPage();
}

function showCurrentPage() {
    document.getElementById(getID(currentSite())).classList.add('activeSite');
    document.getElementById(getID(currentSite())).style.pointerEvents = 'none';
    document.getElementById(getID(currentSite())).style.userSelect = 'none';

}

/**
 * @returns current html site
 */
function currentSite() {
    let currentSite = window.location.href;
    currentSite = currentSite.substring(currentSite.lastIndexOf('/'));
    return currentSite;
}

function getID(path) {
    const pathWithoutHTML = path.split('.html')[0]
    const id = pathWithoutHTML.slice(1);
    return id;
}




/**
 * function displays the log out button if profile pic is clicked
 */
function showLogOut() {
    let logOut = document.getElementById('log-out');
    if (logOut.classList.contains('d-none')) {
        document.getElementById('log-out').classList.remove('d-none');
    } else {
        document.getElementById('log-out').classList.add('d-none');
    }
}

function logOut() {
    window.location.href = 'index.html';
}

/**
 * This function shows the addtask template
 *
 * @param {string} category if given the task will be generated in this category. Default is todo
 */
function showAddTask(category) {
    clearAllInput();
    showTemplateToAddTask(category);
    renderCategorySelector();
    renderContactSelector();
    setDateOfToday();
    removeKanbanOnPhone();
}

function closeAddTaskTemplate() {
    clearAllInput();
    resetInputRequiredMessages()
    hide('fullscreen');
    showKanban();
}

function showTemplateToAddTask(category) {
    document.getElementById("fullscreen").style.display = "block";
    document.getElementById("headline").innerHTML = "Add Task";
    document.getElementById("createText").innerHTML = "create taks";
    document.getElementById("cancelText").innerHTML = "clear";
    document.getElementById("cancelText").style.color = "black";
    document.getElementById("clear").style.backgroundColor = 'white';
    document.getElementById("cancelImage").classList.remove('filterWhite');
    document.getElementById("createTask").onclick = () => {
        createTaskButtonTouched(category);
    };
    document.getElementById("clear").onclick = () => {
        clearAllInput();
    };
}

function showTemplateToEditTask(id) {
    document.getElementById("fullscreen").style.display = "block";
    document.getElementById("headline").innerHTML = "";
    document.getElementById("createText").innerHTML = "save";
    document.getElementById("cancelText").innerHTML = "delete";
    document.getElementById("cancelText").style.color = "white";
    document.getElementById("cancelImage").classList.add('filterWhite');
    document.getElementById("clear").style.backgroundColor = '#ff3d00';
    document.getElementById("createTask").onclick = () => {
        editTask(id);
    };
    document.getElementById("clear").onclick = () => {
        deleteTask(id);
    };
}



/*****************AddTask****HTML Templates**************************/

function categorySelectorTemplate() {
    return /*html*/`
        <span id="categorySelectorPlaceholder" class="placeholder">
            <div id="firstValue">Select task Category</div>
            <img class="category" src="./assets/selectArrow.svg" alt="">
        </span>
        <span tabindex="0" onclick="renderNewCategoryInput()" class="selectable category">New Category</span>
`}

function newCategoryTemplate() {
    return /*html*/`
    <div  class="customSelectorInput">
        <input id="categoryInput" class="noBorder" placeholder="New category name" type="text">
        <div class="createClearContainer">
            <img onclick="renderCategorySelector()" src="./assets/clear.svg" alt=""> |
            <img onclick="addCategoryButtonTouched()" src="./assets/createTask.svg" alt="">
        </div>
    </div>
    `;
};

function renderSingleCategorys() {
    for (let i = 0; i < user.epics.length; i++) {
        const category = user.epics[i];
        document.getElementById('categorySelector').innerHTML += `
       <span tabindex="0"  onclick="showCategory('category-${i}')" id="category-${i}" class="selectable category">${category.name}
           <div class="color ${category.color}"></div>
       </span> 
       `
    }
}

function inviteContactInputTemplate() {
    return /*html*/`
    <div class="customSelectorInput">
        <input id="contactInput" class="noBorder" placeholder="contact email" type="text">
        <div class="createClearContainer">
            <img onclick="renderContactSelector()" src="./assets/clear.svg" alt=""> |
            <img onclick="inviteContact()" src="./assets/createTask.svg" alt="">
        </div>
    </div>
    `;
};

function contactSelectorTemplate() {
    return /*html*/`
        <span id="assignedSelectorPlaceholder" class="placeholder">
            Select Contact
            <img class="assigned" src="./assets/selectArrow.svg" alt="">
        </span>
    `
}

function singleContactTemplate(contact, id, color) {
    return /*html*/`
    <span data-color="${color}" onclick="toggleCheckbox(${id})" id="contact-${id}" class="selectable assigned">${contact.name}
        <input class="checkbox contactCheckbox" type="checkbox" name="" id="check-${id}">
    </span>
    `
}

function inviteContactSelectorTemplate() {
    return /*html*/`
        <span onclick="renderInviteContactInput()" class="selectable assigned">Invite new Contact
            </span id="contactImg" src="./assets/contacts.svg" alt="">
        </span>
    `
}

function renderChoosenCategory(id) {
    index = id.slice(-1);
    let category = user.epics[index]
    return /*html*/ `
            ${category.name}
            <div class="color ${category.color}"></div>
    `
}

function assignedToContactCircleTemplate(shortName, color) {
    return /*html*/ `
    <div  class="assignedTo ${color} ">${shortName}</div>
    `
}

function subtaskInputTemplate() {
    return /*html*/ `
      <div class="customSelectorInput input p-0">
        <input id="subtaskInput" class="noBorder" placeholder="Add new subtask" type="text">
        <div class="createClearContainer">
            <img onclick="closeInviteInput()" src="./assets/clear.svg" alt=""> |
            <img onclick="addSubtask()" src="./assets/createTask.svg" alt="">
        </div>
    </div>
    `
}

function addSubtaskContainerTemplate() {
    return /*html*/ `
        <div class="input" onclick="renderSubtaskInput()">
            Add new subtask
        </div>
    `
}

function subtasklistTemplate(subtask, id) {
    return /*html*/ `
        <div>
            <input checked="true" type="checkbox" id="subCheck-${id}" class="subtaskCheckbox">
            <span id="subtask-${id}">${subtask}</span>
        </div>
    `
}