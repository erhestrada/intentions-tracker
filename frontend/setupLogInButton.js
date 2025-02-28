export function setupLogInButton() {
    const logInButton = document.getElementById('log-in-button');

    logInButton.addEventListener('click', () => {
        const username = document.getElementById('username-input').value.trim();
        console.log(username);
    });
}