export function setupLogInButton() {
    const logInButton = document.getElementById('log-in-button');

    logInButton.addEventListener('click', async () => {
        const username = document.getElementById('username-input').value.trim();
        setUsername(username);
        console.log(username);
    });
}

// need api function and api for setting username
async function setUsername(username) {
    try {
        const response = fetch('http://192.168.86.195:3000/storeUsername', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username })
        });
        const result = await response.json();
        console.log('Username Stored', result);

    } catch(error) {
        console.error("Error setting username: ", error);
    }
}
