export function setupLogInButton(uuid) {
    const logInButton = document.getElementById('log-in-button');

    logInButton.addEventListener('click', async () => {
        const username = document.getElementById('username-input').value.trim();
        setUsername(uuid, username);
        console.log(username);
    });
}

// need api function and api for setting username
async function setUsername(uuid, username) {
    try {
        const response = await fetch('http://192.168.86.195:3000/storeUsername', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ uuid, username })
        });
        const result = await response.json();
        console.log('Username Stored', result);

    } catch(error) {
        console.error("Error setting username: ", error);
    }
}
