// need api function and api for setting username
export async function storeUsername(uuid, username) {
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
