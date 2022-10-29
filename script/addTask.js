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

let categoryColor = '';

function init() {
    includeHTML();
    renderCategorys();
    renderInviteSelector();
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
                    assignedTo: 'Marcel Gregor',
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
window.addEventListener('click', (event) => {
    let id = event.target.parentNode.id;
    if (event.target.className != 'checkbox') {
        if (id == 'category' || id == 'assigned') {
            openCustomSelector(id);
            scrollToTop();
        } else {
            closeAllCustomSelectors();
            scrollToTop();
        }
    };
})

function closeAllCustomSelectors() {
    document.getElementById('category').classList.remove('open');
    document.getElementById('assigned').classList.remove('open');
}

function openCustomSelector(id) {
    document.getElementById('assigned').classList.remove('open');
    document.getElementById('category').classList.remove('open');
    document.getElementById(id).classList.add('open');
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
    toggleMenu('category');
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
    toggleMenu('category');
}

function renderInviteSelector() {
    let assigned = document.getElementById('assigned');
    assigned.innerHTML = assignedTemplate();

    database.contacts.forEach(contact => {
        assigned.innerHTML += assignedContactsTemplate(contact);
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
}

function sendInviteMail(value) { }

/***********************HTML Templates**************************/

function newCategoryTemplate() {
    return /*html*/`
    <div class="newCategory">
        <input id="categoryInput" class="noBorder" placeholder="New category name" type="text">
        <div class="createClearContainer">
            <img onclick="renderCategorys()" src="./assets/clear.svg" alt=""> |
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
            <img onclick="renderInviteSelector()" src="./assets/clear.svg" alt=""> |
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
        <span class="placeholder">
            Select Contact
            <img class="assigned" src="./assets/selectArrow.svg" alt="">
        </span>
    `
}

function assignedContactsTemplate(contact) {
    return /*html*/`
    <span class="selectable assigned">${contact.name}
        <input class="checkbox" type="checkbox" name="" id="">
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