let assignedTo = [];
let users = [];
let user;
let categoryColor = '';
let createTasktouched = false;
const buttons = ['urgent', 'medium', 'low'];
const colors = [
    'orange',
    'red',
    'green',
    'blue',
    'pink',
    'yellow',
    'ocean'
];

async function init() {
    await loadData();
    setUser();
    await includeHTML();
    renderCategorySelector();
    renderContactSelector();
};

/**
 * Backend Functions
*/
setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');

async function loadData() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
}

/**
 * saves current user in local varriable 'user'
 */
function setUser() {
    let emailUser = localStorage.getItem('user-email');
    user = users.find(u => u.email == emailUser);
}

async function saveData() {
    let emailUser = localStorage.getItem('user-email');
    const i = users.findIndex(u => u.email == emailUser);
    users[i] = user;
    await backend.setItem('users', JSON.stringify(users));
}


async function createTaskButtonTouched(category) {
    createTasktouched = true;
    if (allInputsFilled()) {
        createTask(category);
        createTasktouched = false;
        await saveData();
        showAnimationAndGoToBoard();
    };
}

function createTask(category) {
    user.epics.forEach(epic => {
        if (epic.name == document.getElementById('firstValue').innerText) {
            const id = createID(epic);
            epic.tasks.push(getTaskFromUserInput(category, id));
            epic.totalTasks++;
        }
    });
}

function getTaskFromUserInput(category, id) {
    return {
        'id': id,
        'title': document.getElementById('title').value,
        'description': document.getElementById('description').value,
        'assignedTo': assignedTo,
        'dueDate': document.getElementById('dueDate').value,
        'prio': returnPrioState(),
        'subtasks': getSubtasks(),
        'category': category
    };
}

/**
 * @param {string} epic from current task
 * @returns unique id for each task
 */
function createID(epic) {
    return (epic.name.slice(0, 4).toLowerCase() + (epic.totalTasks));
}

function showAnimationAndGoToBoard() {
    document.body.style.overflowY = 'hidden';
    document.getElementById('addedToBoard').classList.add('comeFromBottom');
    setTimeout(goToBoard, 2000);
}

function goToBoard() {
    if (currentSite() == '/board.html') {
        closeAddTaskTemplate();
        document.getElementById('addedToBoard').classList.remove('comeFromBottom');
        startRender();
    } else {
        window.location.href = 'board.html'
    }
}

/**
 * @returns current html site
 */
function currentSite() {
    let currentSite = window.location.href;
    currentSite = currentSite.substring(currentSite.lastIndexOf('/'));
    return currentSite;
}

/**
 * @returns boolean if all inputs are filled or not
 */
function allInputsFilled() {
    let validateAll = [
        !validate(isEmpty('title'), 'title'),
        !validate(isEmpty('description'), 'description'),
        !validate(isEmpty('dueDate'), 'dueDate'),
        !validate(prioStateIsEmpty(), 'prioState'),
        !validate(assignedToIsEmpty(), 'assignedTo'),
        !validate(categoryIsEmpty(), 'category'),
    ]
    return validateAll.every(Boolean);
}

/**
 * validate if html input element is empty or not
 * if field is empty show message "field required" under input element
 * @param {boolean} isempty if field is empty or not
 * @param {string} id HTML Element ID
 * @returns boolean if input is empty or not
 */
function validate(isempty, id) {
    if (isempty) {
        setFieldRequiredMessage(id);
        return true
    } else {
        resetFieldRequiredMessage(id);
        return false
    }
}

/**
 * 
 * @param {string} id HTML Element ID
 * @returns boolean if input is empty or not
 */
function isEmpty(id) {
    return document.getElementById(id).value == '';
}

function setFieldRequiredMessage(id) {
    document.getElementById(id + 'Validation').style.display = 'block';
}
function resetFieldRequiredMessage(id) {
    document.getElementById(id + 'Validation').style.display = 'none';
}

function prioStateIsEmpty() {
    return returnPrioState() == ''
}

function assignedToIsEmpty() {
    return assignedTo.length == 0;
}

function categoryIsEmpty() {
    return document.getElementById('firstValue').innerText == 'Select task Category'
}

function returnPrioState() {
    let activeButton = '';
    buttons.forEach(button => {
        if (document.getElementById(button).classList.contains('active')) {
            activeButton = button;
        };
    });
    return activeButton;
};

/**
 * set eventListener for category selector input
 */
function setCategoryEventListener() {
    const categoryPlaceholder = document.getElementById('categoryPlaceholder');
    categoryPlaceholder.addEventListener('click', () => {
        document.getElementById('category').classList.toggle('open');
        document.getElementById('assigned').classList.remove('open');
    })
}

/**
 * set eventListener for contact selector input
 */
function setAssignedEventListener() {
    const assignedPlaceholder = document.getElementById('assignedPlaceholder');
    assignedPlaceholder.addEventListener('click', () => {
        document.getElementById('assigned').classList.toggle('open');
        document.getElementById('category').classList.remove('open');
        renderAssignedContactsIfClosed()
    })
}

/**
 * set event listener for some closing functions and 
 * for form validation while input fields are filled after first validation
 */
window.addEventListener('click', (event) => {
    if (event.target.id == 'fullscreen') {
        closeAddTaskTemplate();
    }
    if (createTasktouched) {
        allInputsFilled();
    }
    if (event.target.className != 'placeholder' &&
        event.target.className != 'category' &&
        event.target.className != 'selectable assigned' &&
        event.target.className != 'checkbox' &&
        event.target.className != 'assigned' &&
        event.target.id != 'firstValue'
    ) {
        closeAllCustomSelectors();
    };
})

function closeAllCustomSelectors() {
    document.getElementById('category').classList.remove('open');
    document.getElementById('assigned').classList.remove('open');
    scrollToTop();
    renderAssignedContactsIfClosed();
}

function renderAssignedContactsIfClosed() {
    setTimeout(() => {
        renderAssignedContactsIfClosed()
        if (document.getElementById('assigned').offsetHeight > 50 ||
            document.getElementById('category').offsetHeight > 50) {
            document.getElementById('assignedTo').style.display = 'none';
        } else {
            document.getElementById('assignedTo').style.display = 'flex'
        }
    }, 600);
}


/**
 * necessary while closing the custome selectors
 */
function scrollToTop() {
    document.getElementById('assigned').scrollTop = 0;
    document.getElementById('category').scrollTop = 0;
}


/**
 * Prio Button Function 
 * @param {string} id id from HTML Element
 */
function prioButton(id) {
    resetPrioButtons();
    let button = document.getElementById(id);
    button.classList.add('active');
    switch (id) {
        case 'urgent':
            button.classList.add('red')
            break;
        case 'medium':
            button.classList.add('orange')
            break;
        case 'low':
            button.classList.add('green')
            break;
        default:
            break;
    }
}

function resetPrioButtons() {
    buttons.forEach(button => {
        document.getElementById(button).classList = 'prioButton';
    });
}

function renderNewCategoryInput() {
    document.getElementById('colorPicker').style.display = 'flex';
    document.getElementById('category').innerHTML = newCategoryTemplate();
    document.getElementById('categoryInput').focus();
}

function addCategory() {
    let input = document.getElementById('categoryInput');
    if (input.value) {
        user.epics.push({
            "name": input.value,
            "totalTasks": 0,
            "color": categoryColor,
            "tasks": []
        })
        categoryColor = '';
        renderCategorySelector();
        document.getElementById('colorPicker').style.display = 'none';
        let index = (user.epics.length - 1).toString();
        showCategory(index);
        document.getElementById('categoryValidation').style.display = 'none'
    } else {
        document.getElementById('categoryValidation').style.display = 'block'
    }
}

function colorPicker(id) {
    resetPicker();
    let choosedColor = document.getElementById(id);
    choosedColor.classList.add('active');
    categoryColor = id;
}

function resetPicker() {
    colors.forEach(color => {
        document.getElementById(color).classList = 'color';
    });
}

function renderCategorySelector() {
    document.getElementById('category').innerHTML = categorySelectorTemplate();
    renderSingleCategorys();
    document.getElementById('colorPicker').style.display = 'none';
    setCategoryEventListener();
    document.getElementById('categoryValidation').style.display = 'none'
}

function showCategory(id) {
    let firstValue = document.getElementById('firstValue');
    firstValue.innerHTML = renderChoosenCategory(id);
    closeAllCustomSelectors();
}

function renderContactSelector() {
    let assigned = document.getElementById('assigned');
    assigned.innerHTML = contactSelectorTemplate();
    let id = 0
    user.contacts.forEach(contact => {
        assigned.innerHTML += singleContactTemplate(contact, id, contact.color);
        id++;
    });
    assigned.innerHTML += inviteContactSelectorTemplate();
    setAssignedEventListener();
    document.getElementById('assignedToValidation').style.display = 'none';
}

function renderInviteContactInput() {
    document.getElementById('assigned').innerHTML = inviteContactInputTemplate();
    document.getElementById('contactInput').focus();

}

function inviteContact() {
    let value = document.getElementById('contactInput').value;
    if (value) {
        closeAllCustomSelectors();
        sendInviteMail(value);
        renderContactSelector();
        document.getElementById('assignedToValidation').style.display = 'none';
    } else {
        document.getElementById('assignedToValidation').style.display = 'block';
    }
}

function sendInviteMail(value) { }

function toggleCheckbox(id) {
    const checkbox = document.getElementById(`check-${id}`);
    checkbox.toggleAttribute('checked',);
    renderAssignedContacts();
}

function renderAssignedContacts() {
    saveAssignedContactsInArray();
    renderContactsFromArray();
};

function renderContactsFromArray() {
    document.getElementById('assignedTo').innerHTML = '';
    assignedTo.forEach(contact => {
        name = contact.name;
        const nameAsArray = name.split(' ');
        const foreName = nameAsArray[0];
        const lastName = nameAsArray[1];
        document.getElementById('assignedTo').innerHTML += assignedToContactCircleTemplate(foreName.slice(0, 1) + lastName.slice(0, 1), contact.color);
    });
}

function saveAssignedContactsInArray() {
    assignedTo = [];
    const checkboxes = document.getElementsByClassName('checkbox');
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        if (checkbox.checked) {
            const id = checkbox.id.slice(-1);
            const name = document.getElementById(`contact-${id}`).innerText;
            const color = document.getElementById(`contact-${id}`).getAttribute('data-color');
            assignedTo.push(
                {
                    'name': name,
                    'color': color
                }
            );
        }
    };
}

function renderSubtaskInput() {
    document.getElementById('subtask').innerHTML = subtaskInputTemplate();
    document.getElementById('subtaskInput').focus();

}

function renderAddSubtaskContainer() {
    document.getElementById('subtask').innerHTML = addSubtaskContainerTemplate();
}

function addSubtask() {
    let subtask = document.getElementById('subtaskInput').value;
    let id = document.getElementsByClassName('subtaskCheckbox').length
    document.getElementById('subtaskList').innerHTML += subtasklistTemplate(subtask, id);
    renderSubtaskInput();
}

function getSubtasks() {
    let subtasks = [];
    let allSubtasks = document.getElementsByClassName('subtaskCheckbox');
    for (let i = 0; i < allSubtasks.length; i++) {
        const subtask = allSubtasks[i];
        if (subtask.checked) {
            let id = subtask.id.slice(-1);
            let value = document.getElementById(`subtask-${id}`).innerText;
            subtasks.push(
                {
                    name: value,
                    checked: false
                }

            );
        };
    };
    return subtasks;
}

function clearAllInput() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    renderCategorySelector();
    renderContactSelector();
    renderAssignedContacts();
    document.getElementById('dueDate').value = '';
    resetPrioButtons();
    renderAddSubtaskContainer();
    document.getElementById('subtaskList').innerHTML = '';
}

function closeAddTaskTemplate() {
    clearAllInput();
    resetInputRequiredMessages()
    document.getElementById('fullscreen').style.display = 'none';
}

function closeInviteInput() {
    closeAllCustomSelectors();
    renderAddSubtaskContainer();
}

function resetInputRequiredMessages() {
    let requiredMessages = document.getElementsByClassName('formValidation')
    let messagesAsArray = [...requiredMessages];
    messagesAsArray.forEach(message =>
        message.style.display = 'none'
    )
    createTasktouched = false;
}

/***********************HTML Templates**************************/

function categorySelectorTemplate() {
    return /*html*/`
        <span id="categoryPlaceholder" class="placeholder">
            <div id="firstValue">Select task Category</div>
            <img class="category" src="./assets/selectArrow.svg" alt="">
        </span>
        <span onclick="renderNewCategoryInput()" class="selectable category">New Category</span>
`}

function newCategoryTemplate() {
    return /*html*/`
    <div class="customSelectorInput">
        <input id="categoryInput" class="noBorder" placeholder="New category name" type="text">
        <div class="createClearContainer">
            <img onclick="renderCategorySelector()" src="./assets/clear.svg" alt=""> |
            <img onclick="addCategory()" src="./assets/createTask.svg" alt="">
        </div>
    </div>
    `;
};

function renderSingleCategorys() {
    for (let i = 0; i < user.epics.length; i++) {
        const category = user.epics[i];
        document.getElementById('category').innerHTML += `
       <span onclick="showCategory('category-${i}')" id="category-${i}" class="selectable category">${category.name}
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
        <span id="assignedPlaceholder" class="placeholder">
            Select Contact
            <img class="assigned" src="./assets/selectArrow.svg" alt="">
        </span>
    `
}

function singleContactTemplate(contact, id, color) {
    return /*html*/`
    <span data-color="${color}" onclick="toggleCheckbox(${id})" id="contact-${id}" class="selectable assigned">${contact.name}
        <input class="checkbox" type="checkbox" name="" id="check-${id}">
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
    <div style="background-color: ${color}" class="assignedTo">${shortName}</div>
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

function taskTemplate() {
    return [
        {
            "name": "Backoffice",
            "color": "blue",
            "tasks": []
        },
        {
            "name": 'Marketing',
            "color": 'red',
            "tasks": []
        },
        {
            "name": 'Development',
            "color": 'orange',
            "tasks": []
        }
    ]
}