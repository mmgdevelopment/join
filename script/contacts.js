setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');

let users = [];
let colors = ['#FF7A00', '#9327FF', '#29ABE2', '#FC71FF', '#02CF2F', '#AF1616', '#462F8A', '#FFC700'];
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
        <span class="initials" style="background-color:${contactColor};">${initials}</span>
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
    selectetContactHTML(name);
}


/**
 * function provides html code for rendering selected contact
 * @param {string} name 
 */
function selectetContactHTML(name) {
    document.getElementById('selected-contact').innerHTML = `
    <div class="huge-contact">
        <span class="huge-initials" style="background-color:${contactColor};">${initials}</span>
        <div class="huge-name-add-task">
            <p class="huge-name">${name}</p>
            <div class="add-task">
                <img src="./assets/blue-plus.svg">
                <p class="add-task-text">Add Task</p>
            </div>
        </div>
    </div>

    <div class="edit-div">
        <p>Contact Information</p>
        <div class="edit only-desktop">
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















