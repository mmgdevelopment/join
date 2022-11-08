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
}

let displayLogOut = false;
function showLogOut() {
    if (displayLogOut = false) {
        document.getElementById('log-out').style='display:flex;';
        displayLogOut = true;
    } else {
        document.getElementById('log-out').style='display:none;';   
        displayLogOut = false;
    }
}