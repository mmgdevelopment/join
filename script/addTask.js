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

let categoryColor = '';

function init() {
    includeHTML();
    renderCategorys();
    renderInviteSelector();
    setCategoryEventListener();
    setAssignedEventListener();
};


function createTestTask() {
    database.epics.forEach(epic => {
        if (epic.name == document.getElementById('firstValue').innerText) {
            const id = epic.name.slice(0, 4).toLowerCase() + (epic.tasks.length + 1).toString()
            console.log(id);
            epic.tasks.push(
                {
                    id: id,
                    title: document.getElementById('title').value,
                    description: document.getElementById('description').value,
                    assignedTo: assignedTo,
                    dueDate: document.getElementById('dueDate').value,
                    prio: returnPrioState(),
                    subtasks: []
                }
            )
        }
    });
    console.log(database.epics);
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

    })
}


window.addEventListener('click', (event) => {
    if (event.target.className != 'placeholder' &&
        event.target.className != 'category' &&
        event.target.className != 'selectable assigned' &&
        event.target.className != 'checkbox' &&
        event.target.className != 'assigned'
    ) {
        closeAllCustomSelectors();
        console.log(event.target.className);
    };
})

function closeAllCustomSelectors() {
    document.getElementById('category').classList.remove('open');
    document.getElementById('assigned').classList.remove('open');
    scrollToTop();
}

function scrollToTop() {
    document.getElementById('assigned').scrollTop = 0;
    document.getElementById('category').scrollTop = 0;
}

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

function renderNewCategory() {
    document.getElementById('colorPicker').style.display = 'flex';
    document.getElementById('category').innerHTML = newCategoryTemplate();
}

function addCategory() {
    let input = document.getElementById('categoryInput');
    if (input.value) {
        database.epics.push({
            "name": input.value,
            "color": categoryColor,
            "tasks": []
        })
    } else {
        /* Form validation -> input required*/
    }
    categoryColor = '';
    renderCategorys();
    document.getElementById('colorPicker').style.display = 'none';
    let index = (database.epics.length - 1).toString();
    showCategory(index);
    setCategoryEventListener();
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

function renderCategorys() {
    document.getElementById('category').innerHTML = categorysTemplate();
    renderSingleCategorys();
    document.getElementById('colorPicker').style.display = 'none';
}

function showCategory(id) {
    let firstValue = document.getElementById('firstValue');
    firstValue.innerHTML = renderChoosenCategory(id);
    closeAllCustomSelectors();
}

function renderInviteSelector() {
    let assigned = document.getElementById('assigned');
    assigned.innerHTML = assignedTemplate();
    let id = 0
    database.contacts.forEach(contact => {
        assigned.innerHTML += assignedContactsTemplate(contact, id);
        id++;
    });

    assigned.innerHTML += assignedInviteTemplate();
}

function renderInviteNewContact() {
    document.getElementById('assigned').innerHTML = inviteContactTemplate();
}

function inviteContact() {
    let value = document.getElementById('contactInput').value;
    if (value) {
        sendInviteMail(value);
        renderInviteSelector();
    } else {
        /**form Validation -> input required */
    }
    setAssignedEventListener();
}

function sendInviteMail(value) { }

function toggleCheckbox(id) {
    const checkbox = document.getElementById(`check-${id}`);
    checkbox.toggleAttribute('checked',);
    renderAssignedContacts();
}

function renderAssignedContacts() {
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
    document.getElementById('assignedTo').innerHTML = '';
    assignedTo.forEach(contact => {
        const nameAsArray = contact.split(' ');
        const foreName = nameAsArray[0];
        const lastName = nameAsArray[1];
        document.getElementById('assignedTo').innerHTML += assignedToAvatarsTemplate(foreName.slice(0, 1) + lastName.slice(0, 1));
    });

}

/***********************HTML Templates**************************/

function newCategoryTemplate() {
    return /*html*/`
    <div class="newCategory">
        <input id="categoryInput" class="noBorder" placeholder="New category name" type="text">
        <div class="createClearContainer">
            <img onclick="renderCategorys(), setCategoryEventListener()" src="./assets/clear.svg" alt=""> |
            <img onclick="addCategory()" src="./assets/createTask.svg" alt="">
        </div>
    </div>
    `;
};
function inviteContactTemplate() {
    return /*html*/`
    <div class="newCategory">
        <input id="contactInput" class="noBorder" placeholder="contact email" type="text">
        <div class="createClearContainer">
            <img onclick="renderInviteSelector(), setAssignedEventListener()" src="./assets/clear.svg" alt=""> |
            <img onclick="inviteContact()" src="./assets/createTask.svg" alt="">
        </div>
    </div>
    `;
};

function renderSingleCategorys() {
    for (let i = 0; i < database.epics.length; i++) {
        const category = database.epics[i];
        document.getElementById('category').innerHTML += `
       <span onclick="showCategory('category-${i}')" id="category-${i}" class="selectable category">${category.name}
           <div class="color ${category.color}"></div>
       </span> 
       `
    }
}

function categorysTemplate() {
    return /*html*/`
        <span id="categoryPlaceholder" class="placeholder">
            <div id="firstValue">Select task Category</div>
            <img class="category" src="./assets/selectArrow.svg" alt="">
        </span>
        <span onclick="renderNewCategory()" class="selectable category">New Category</span>
`}

function assignedTemplate() {
    return /*html*/`
        <span id="assignedPlaceholder" class="placeholder">
            Select Contact
            <img class="assigned" src="./assets/selectArrow.svg" alt="">
        </span>
    `
}

function assignedContactsTemplate(contact, id) {
    return /*html*/`
    <span onclick="toggleCheckbox(${id})" id="contact-${id}" class="selectable assigned">${contact.name}
        <input class="checkbox" type="checkbox" name="" id="check-${id}">
    </span>
    `
}

function assignedInviteTemplate() {
    return /*html*/`
        <span onclick="renderInviteNewContact()" class="selectable assigned">Invite new Contact
            </span id="contactImg" src="./assets/contacts.svg" alt="">
        </span>
    `
}

function renderChoosenCategory(id) {
    index = id.slice(-1);
    let category = database.epics[index]
    return /*html*/ `
            ${category.name}
            <div class="color ${category.color}"></div>
    `
}

function assignedToAvatarsTemplate(shortName) {
    return /*html*/ `
    <div class="assignedTo">${shortName}</div>
    `
}