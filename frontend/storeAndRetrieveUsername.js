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

export async function retrieveUsername(uuid) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/retrieveUsername?uuid=${encodeURIComponent(uuid)}`);
        const data = await response.json();
        const username = data.username;
        return username
    } catch(error) {
        console.error("Error retrieving username", error);
    }
}

export async function retrieveUsernames() {
    try {
        const response = await fetch(`http://192.168.86.195:3000/retrieveUsernames`);
        const usernameRows = await response.json();

        const usernamePerId = usernameRows.reduce((accumulator, row) => {
            const uuid = row.uuid;
            const username = row.username;
            accumulator[uuid] = username;
            return accumulator
        }, {});

        return usernamePerId;

    } catch(error) {
        console.error("Error retrieving usernames", error);
    }    
}