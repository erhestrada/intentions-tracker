import { storeUsername } from "./storeAndRetrieveUsername";

export function setupLogInButton(uuid) {
    const logInButton = document.getElementById('log-in-button');

    logInButton.addEventListener('click', async () => {
        const username = document.getElementById('username-input').value.trim();
        storeUsername(uuid, username);
        console.log(username);
    });
}
