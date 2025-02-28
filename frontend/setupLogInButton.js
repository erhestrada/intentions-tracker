export function setupLogInButton() {
    const username = document.getElementById('username-input').value.trim();
    const logInButton = document.getElementById('log-in-button');

    logInButton.addEventListener('click', () => {
        console.log('log in clicked');
    });
}