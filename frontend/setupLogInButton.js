// need api function and api for setting username

export function setupLogInButton() {
    const logInButton = document.getElementById('log-in-button');

    logInButton.addEventListener('click', async () => {
        const username = document.getElementById('username-input').value.trim();
        setUsername(username);
        console.log(username);
    });
}


async function setUsername(username) {

}