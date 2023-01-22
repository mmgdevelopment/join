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