export async function storeGroup(uuid, groupName, groupDescription) {
    try {
        const response = await fetch('http://192.168.86.195:3000/storeGroup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ uuid, groupName, groupDescription })
        });
        const result = await response.json();
        console.log('group stored', result);

    } catch(error) {
        console.error("Error storing group: ", error);
    }
}