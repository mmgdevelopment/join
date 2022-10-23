const buttons = ['urgent', 'medium', 'low'];

let categorys = [
    {
        name: 'Sales',
        color: 'pink'
    },
    {
        name: 'Backoffice',
        color: 'yellow'
    },
];

let contacts = [
    'You',
    'Marcel Gregor',
    'Steven Munk'
];

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

function toggleMenu(id) {
    document.getElementById(id).classList.toggle('open');
}

function renderNewCategory() {
    document.getElementById('colorPicker').style.display = 'flex';
    toggleMenu('category');
    document.getElementById('category').innerHTML = newCategoryTemplate();
}

function addCategory() {
    let input = document.getElementById('categoryInput');
    if (input.value) {
        categorys.push({
            name: input.value,
            color: categoryColor
        })
    } else {
        /* Form validation -> input required*/
    }
    categoryColor = '';
    renderCategorys();
    document.getElementById('colorPicker').style.display = 'none';
    let index = (categorys.length - 1).toString();
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

    contacts.forEach(contact => {
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
    for (let i = 0; i < categorys.length; i++) {
        const category = categorys[i];
        document.getElementById('category').innerHTML += `
       <span onclick="showCategory('category-${i}')" id="category-${i}" class="selectable category">${category.name}
           <div class="color ${category.color}"></div>
       </span> 
       `
    }
}

function categorysTemplate() {
    return /*html*/`
        <span id="categoryPlaceholder" class="placeholder" onclick="toggleMenu('category')">
            <div id="firstValue">Select task Category</div>
            <img src="./assets/selectArrow.svg" alt="">
        </span>
        <span onclick="renderNewCategory()" class="selectable category">New Category</span>
`}

function assignedTemplate() {
    return /*html*/`
        <span class="placeholder" onclick="toggleMenu('assigned')">
            Select Contact
            <img src="./assets/selectArrow.svg" alt="">
        </span>
    `
}

function assignedContactsTemplate(name) {
    return /*html*/`
    <span class="selectable assigned">${name}
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
    let category = categorys[index]
    return /*html*/ `
            ${category.name}
            <div class="color ${category.color}"></div>
    `
}