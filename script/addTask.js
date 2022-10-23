let buttons = ['urgent', 'medium', 'low']

function prioButton(id) {
    resetButtons();
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

function resetButtons() {
    buttons.forEach(button => {
        document.getElementById(button).classList = 'prioButton';
    });
}

function toggleMenu(id) {
    document.getElementById(id).classList.toggle('open');
}

function newCategory() {
    document.getElementById('colorPicker').style.display = 'flex';
    toggleMenu('category');
    document.getElementById('category').innerHTML = newCategoryTemplate();
}


/***********************HTML Templates**************************/


function newCategoryTemplate() {
    return /*html*/`
    <div class="newCategory">
        <input class="noBorder" placeholder="New category name" type="text">
        <div class="createClearContainer">
            <img src="./assets/clear.svg" alt=""> |
            <img src="./assets/createTask.svg" alt="">
        </div>
        
    </div>
    `

}