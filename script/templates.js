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
    const pathWithoutDash = path.slice(1);
    const id = pathWithoutDash.slice(0, -5);
    return id;
}


/**
 * function displays the log out button if profile pic is clicked
 */
function showLogOut() {
    let logOut = document.getElementById('log-out');
    if (logOut.classList.contains('d-none')) {
        document.getElementById('log-out').classList.remove('d-none');
        console.log('hallo')
    } else {
        document.getElementById('log-out').classList.add('d-none');
    }
}


function logOut() {
    window.location.href = 'index.html';
}

