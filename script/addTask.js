setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');

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

let assignedTo = [];
let users = [];
let user;
let categoryColor = '';
let createTasktouched = false;

async function init() {
    await loadData();
    await includeHTML();
    renderCategorySelector();
    renderContactSelector();
};

/**
 * Backend Functions
*/
async function loadData() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    let emailUser = localStorage.getItem('user-email');
    user = users.find(u => u.email == emailUser);
    // setInitialCategorysIfNotExist();
}

async function saveData() {
    let emailUser = localStorage.getItem('user-email');
    const i = users.findIndex(u => u.email == emailUser);
    users[i] = user;
    await backend.setItem('users', JSON.stringify(users));
}

async function deleteAllTasks() {
    user.epics.forEach(epic => {
        epic.tasks = [];
    });
    await saveData();
    await loadData();
}

// function setInitialCategorysIfNotExist() {
//     if (user.epics == '') {
//         user.epics = taskTemplate();
//     }
// }

/**
 * AddTask to JSON
 */
async function createTestTask(category) {
    createTasktouched = true;
    if (allInputsFilled()) {
        user.epics.forEach(epic => {
            if (epic.name == document.getElementById('firstValue').innerText) {
                const id = epic.name.slice(0, 4).toLowerCase() + (epic.totalTasks);
                epic.tasks.push(
                    {
                        id: id,
                        title: document.getElementById('title').value,
                        description: document.getElementById('description').value,
                        assignedTo: assignedTo,
                        dueDate: document.getElementById('dueDate').value,
                        prio: returnPrioState(),
                        subtasks: getSubtasks(),
                        category: category
                    }
                )
                epic.totalTasks++;
            }
        });
        createTasktouched = false;
        await saveData();
        document.body.style.overflowY = 'hidden';
        document.getElementById('addedToBoard').classList.add('comeFromBottom');
        setTimeout(goToBoard, 2000);
    }
}

function newTask(id) {

}
function goToBoard() {

    if (currentSite() == '/board.html') {
        closeTemplate()
    } else {
        window.location.href = 'board.html'
    }
}

function currentSite() {
    let currentSite = window.location.href;
    currentSite = currentSite.substring(currentSite.lastIndexOf('/'));
    return currentSite;
}

function allInputsFilled() {
    let validateAll = [
        !isEmpty('title'),
        !isEmpty('description'),
        !isEmpty('dueDate'),
        !prioStateIsEmpty(),
        !assignedToIsEmpty(),
        !categoryIsEmpty()
    ]
    return validateAll.every(Boolean);
}

function isEmpty(id) {
    if (document.getElementById(id).value == '') {
        document.getElementById(id + 'Validation').style.display = 'block';
        return true
    } else {
        document.getElementById(id + 'Validation').style.display = 'none';
        return false
    }
}

function prioStateIsEmpty() {
    if (returnPrioState() == '') {
        document.getElementById('prioStateValidation').style.display = 'block';
        return true;
    } else {
        document.getElementById('prioStateValidation').style.display = 'none';
        return false;
    }
}

function assignedToIsEmpty() {
    if (assignedTo.length == 0) {
        document.getElementById('assignedToValidation').style.display = 'block';
        return true;
    } else {
        document.getElementById('assignedToValidation').style.display = 'none';
        return false;
    }

}

function categoryIsEmpty() {
    if (document.getElementById('firstValue').innerText == 'Select task Category') {
        document.getElementById('categoryValidation').style.display = 'block';
        return true;
    } else {
        document.getElementById('categoryValidation').style.display = 'none';
        return false;
    }

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
 * open and close customized select inputs
 */

function setCategoryEventListener() {
    const categoryPlaceholder = document.getElementById('categoryPlaceholder');
    categoryPlaceholder.addEventListener('click', () => {
        document.getElementById('category').classList.toggle('open');
        document.getElementById('assigned').classList.remove('open');
    })
}

function setAssignedEventListener() {
    const assignedPlaceholder = document.getElementById('assignedPlaceholder');
    assignedPlaceholder.addEventListener('click', () => {
        document.getElementById('assigned').classList.toggle('open');
        document.getElementById('category').classList.remove('open');
        renderAssignedContactsIfClosed()
    })
}

window.addEventListener('click', (event) => {
    if (event.target.id == 'fullscreen') {
        closeTemplate();
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
        assigned.innerHTML += singleContactTemplate(contact, id);
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
        const nameAsArray = contact.split(' ');
        const foreName = nameAsArray[0];
        const lastName = nameAsArray[1];
        document.getElementById('assignedTo').innerHTML += assignedToContactCircleTemplate(foreName.slice(0, 1) + lastName.slice(0, 1));
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
            assignedTo.push(name);
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

function closeTemplate() {
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

function singleContactTemplate(contact, id) {
    return /*html*/`
    <span onclick="toggleCheckbox(${id})" id="contact-${id}" class="selectable assigned">${contact.name}
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

function assignedToContactCircleTemplate(shortName) {
    return /*html*/ `
    <div class="assignedTo">${shortName}</div>
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