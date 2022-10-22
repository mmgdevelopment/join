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

function openMenu(id) {
    document.getElementById(id).classList.toggle('open');
}