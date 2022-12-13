setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');

let users = [];
let colors = ['neon-orange', 'orange', 'yellow', 'blue', 'dark-red', 'green', 'neon-green', 'pink', 'ocean', 'purple', 'red'];
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
let email;
let indexOfUser;
let user;
let contacts;





/**
 * function loads all saved users and renders the page
 */
async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    defineUser();
    renderList();
}


/**
 * function defines variables for futher use in js code
 */
function defineUser() {
    email = localStorage.getItem('user-email');
    indexOfUser = users.findIndex(u => u.email == email);
    user = users[indexOfUser];
    contacts = user['contacts'];
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


/**
 * function renders the list of all contacts
 */
let allNames = [];
let allFirstLetters = [];
let allLettersOnce = [];
function renderList() {
    getAllNames();
    getFirstCharOfNames();
    renderAllExistingLetters();
    renderAllContacts()
}


/**
 * function gets all the names of all the contacts the user has
 */
function getAllNames() {
    for (let i = 0; i < contacts.length; i++) {
        const name = contacts[i];
        allNames.push(name['name']);
    }
    allNames.sort();
}


/**
 *function gets the first letter of all names 
 */
function getFirstCharOfNames() {
    for (let i = 0; i < allNames.length; i++) {
        const name = allNames[i];
        allFirstLetters.push(name.charAt(0));
    }
}


/**
 * function checks, what letters must be renderd, depending on the first letter of every name
 */
function renderAllExistingLetters() {
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        if (allFirstLetters.includes(letter)) {
            allLettersOnce.push(letter);
            renderLetterCategory(letter);
        }
    }
}


/**
 * function renders letter categories, depending on the first letter of every name
 * @param {string} letter 
 */
function renderLetterCategory(letter) {
    document.getElementById('list').innerHTML += `
        <div id="letter-${letter}" class="letter-entrie">
            <div class="letter-container">
                <p class="letter">${letter}</p>
                <div class="only-desktop"></div>
            </div>
            <img class="horizontal-line" src="./assets/contact-break-line.svg">
        </div>
    `;
}


/**
 * function renders all contacts, into the right letter catrgory, depending on the first letter of the name
 */
function renderAllContacts() {
    for (let i = 0; i < allLettersOnce.length; i++) {
        const letter = allLettersOnce[i];
        for (let d = 0; d < allNames.length; d++) {
            const name = allNames[d];
            if (name.charAt(0) == letter) {
                renderSingleContact(name, letter);
            }
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


let certainContact;
let firstLetters;
let initials;
let contactMail;
let contactColor;
let contactPhone;


/**
 * function defines all variables needed for rendering contact, depending on name
 * @param {string} name 
 */
function getVariablesForContact(name) {
    certainContact = contacts.find(u => u.name == name);
    firstLetters = name.match(/\b(\w)/g);
    initials = firstLetters.join('');
    contactMail = certainContact['email'];
    contactColor = certainContact['color'];
    contactPhone = certainContact['phone'];
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


/**
 * function renders a single contact into list
 * @param {string} letter 
 */
function renderSingleContact(name, letter) {
    getVariablesForContact(name)
    listContactHTML(name, letter);
}


/**
 * function provides html code for rendering contact into list
 * @param {string} name 
 * @param {string} letter 
 */
function listContactHTML(name, letter) {
    document.getElementById(`letter-${letter}`).innerHTML += `
    <div onclick="showContactEntrie('${name}')" class="single-contact">
        <span class="initials ${contactColor}" ;">${initials}</span>
        <div class="name-and-mail">
            <p>${name}</p>
            <p class="mail">${contactMail}</p>
        </div>
    </div>
    `;
}


/**
 * function renders selected contact in a huge display
 * @param {string} name 
 */
function showContactEntrie(name) {
    getVariablesForContact(name);
    checkForMobileView();
    selectetContactHTML(name);
}


/**
 * function hides list on mobile devices, so that contact entrie can be seen
 */
function checkForMobileView() {
    document.getElementById('selected-contact').classList.remove('d-none')
    if (screen.width <= 1080) {
        document.getElementById('list').classList.add('d-none')
        document.getElementById('add-btn').classList.add('d-none')
    }
}



function openMobileList() {
    document.getElementById('list').classList.remove('d-none')
    document.getElementById('add-btn').classList.remove('d-none')
    document.getElementById('selected-contact').classList.add('d-none')
}


/**
 * function provides html code for rendering selected contact
 * @param {string} name 
 */
function selectetContactHTML(name) {
    document.getElementById('selected-contact').innerHTML = `
    <img onclick="openMobileList()" class="mobile-back-arrow only-mobile" src="./assets/mobile-back-arrow.svg">
    <img onclick="editPopUp('${name}')" class="mobile-edit-btn only-mobile" src="./assets/mobile-contact-edir.svg">
    <div class="huge-contact">
        <span class="huge-initials ${contactColor}" ;">${initials}</span>
        <div class="huge-name-add-task">
            <p class="huge-name">${name}</p>
            <a href="addTask.html" class="add-task">
                <img class="add-task-img" src="./assets/blue-plus.svg">
                <p class="add-task-text">Add Task</p>
            </a>
        </div>
    </div>

    <div class="edit-div">
        <p>Contact Information</p>
        <div onclick="editPopUp('${name}')" class="edit only-desktop">
            <img src="./assets/pen-small.svg">
            <p style="font-size: 16px;">Edit Contact</p>
        </div>
    </div>

    <p class="mail-and-phone">Email</p>

    <a href="mailto:${contactMail}" class="mail">${contactMail}</a>

    <p class="mail-and-phone">Phone</p>

    <a href="tel:${contactPhone}" class="phone-number">${contactPhone}</a>
    `;
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


/**
 * function creates and saves a new contact
 */
async function createNewContact() {
    let name = document.getElementById('newName').value;
    let email = document.getElementById('newEmail').value;
    let phone = document.getElementById('newPhone').value;
    let color = colors[Math.floor(Math.random() * 8)];

    contacts.push({ 'name': name, 'email': email, 'phone': phone, 'color': color })
    await backend.setItem('users', JSON.stringify(users));
    window.location.href = `contacts.html?msg=Du hast ${name} in deinen Kontakten gespeichet`
}


/**
 * function opens pop up for new contact
 */
function newContactWindow() {
    document.getElementById('pop-up-container').classList.remove('d-none');
    setTimeout(animateNewContact, 1);
}


/**
 * function animates new contact window
 */
function animateNewContact() {
    document.getElementById('pop-up-window').classList.add('not-hidden-mobile');
    document.getElementById('pop-up-window').classList.add('not-hidden');
}


/**
 * function closes new contact pop up
 */
function closeNewContact() {
    document.getElementById('pop-up-container').classList.add('d-none');
    document.getElementById('pop-up-window').classList.remove('not-hidden');
    document.getElementById('pop-up-window').classList.remove('not-hidden-mobile');
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


/**
 * function renders edit pop up
 * @param {string} name 
 */
function editPopUp(name) {
    showEditWindow();
    renderEditWindow(name);
}


/**
 * function renders gray screen and animarion of edit window
 */
function showEditWindow() {
    document.getElementById('pop-up-edit').classList.remove('d-none');
    setTimeout(animateEditWindow, 100);
}


/**
 * function animates edit window
 */
function animateEditWindow() {
    document.getElementById('pop-up-edit-window').classList.add('not-hidden');
    document.getElementById('pop-up-edit-window').classList.add('not-hidden-mobile');
}


/**
 * function renders the HTML and all information for the edit window
* @param {string} name 
 */
function renderEditWindow(name) {
    getVariablesForContact(name);
    renderEditHTML();
    ensertInfoIntoEdit(name);
}


/**
 * function renders the HTML for the edit window
 */
function renderEditHTML() {
    document.getElementById('edit-content').innerHTML = `
        <img onclick="closeEdit()" class="pop-up-exit only-desktop" src="./assets/pop-up-cross.svg">

        <div class="only-mobile">
            <span class="huge-initials pop-up-initials ${contactColor}"  ;">${initials}</span>
        </div>
    
        <div class="only-desktop">
            <span class="huge-initials pop-up-initials  ${contactColor}" ;">${initials}</span>
        </div>
    
        <div class="all-inputfields">
    
            <div class="pop-up-inputfield">
                <input id="editName" class="pop-up-input" type="text" placeholder="Name" title="Change name">
                <img src="./assets/profile.svg">
            </div>
    
            <div class="pop-up-inputfield">
                <input id="editEmail" class="pop-up-input" type="email" placeholder="Email" title="Change email">
                <img src="./assets/mail.svg">
            </div>
    
            <div class="pop-up-inputfield">
                <input id="editPhone" class="pop-up-input" type="tel" placeholder="Phone"
                    title="Change phone number">
                <img src="./assets/phone.svg">
            </div>
    
            <button onclick="saveContactChanges()" class="dark-btn save-btn">
                Save
            </button>

        </div>
    `;
}


/**
 * function enserts info of contact into edit HTML
 * @param {string} name 
 */
function ensertInfoIntoEdit(name) {
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = contactMail;
    document.getElementById('editPhone').value = contactPhone;
    IDOfEditContact = contacts.findIndex(u => u.name == name);
}


let IDOfEditContact;
/**
 * function changes infos of contacts, based on the id of the contact
 */
async function saveContactChanges() {
    let oldContact = contacts[IDOfEditContact];
    oldContact['name'] = document.getElementById('editName').value;
    oldContact['email'] = document.getElementById('editEmail').value;
    oldContact['phone'] = document.getElementById('editPhone').value;

    await backend.setItem('users', JSON.stringify(users));
    window.location.href = `contacts.html?msg=Du hast deinen Kontakt erfolgreich geändert!`
}


/**
 * function closes edit window
 */
function closeEdit() {
    document.getElementById('pop-up-edit').classList.add('d-none');
    document.getElementById('pop-up-edit-window').classList.remove('not-hidden');
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
























