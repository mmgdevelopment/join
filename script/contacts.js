setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');

let users = [];
let colors = ['#FF7A00', '#9327FF', '#29ABE2', '#FC71FF', '#02CF2F', '#AF1616', '#462F8A', '#FFC700'];
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
let email;
let indexOfUser;
let user;
let contacts;





/**
 * function loads all saved users and defines user variables to inputfields
 */
async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    defineUser();
    renderList();
}


function defineUser() {
    email = localStorage.getItem('user-email');
    indexOfUser = users.findIndex(u => u.email == email);
    user = users[indexOfUser];
}


function renderList() {
    contacts = user['contacts'];
    console.log(contacts);


    let allNames = [];
    for (let i = 0; i < contacts.length; i++) {
        const name = contacts[i];
        allNames.push(name['name']);
    }
    allNames.sort();
    console.log(allNames);







    let allFirstLetters = [];
    for (let i = 0; i < allNames.length; i++) {
        const name = allNames[i];

        allFirstLetters.push(allNames[i].charAt(0));

    }

    console.log(allFirstLetters);












    let allLettersOnce = [];
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];

        if (allFirstLetters.includes(letter)) {

            allLettersOnce.push(letter);

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

    }
    console.log(allLettersOnce);

    for (let i = 0; i < allLettersOnce.length; i++) {
        const letter = allLettersOnce[i];

        for (let d = 0; d < allNames.length; d++) {
            const name = allNames[d];

            if (name.charAt(0) == letter) {

                let certainContact = contacts.find(u => u.name == name);


                let firstLetters = name.match(/\b(\w)/g);
                let initials = firstLetters.join('');

                let contactMail = certainContact['email'];
                let contactColor = certainContact['color'];




                document.getElementById(`letter-${letter}`).innerHTML += `
                
                <div class="single-contact">
                    <span class="initials" style="background-color:${contactColor};">${initials}</span>
                    <div class="name-and-mail">
                        <p>${name}</p>
                        <p class="mail">${contactMail}</p>
                    </div>
                </div>
                
                `;

            }



        }

    }






}
