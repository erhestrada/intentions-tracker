// table userId column, intention column, bonded_intentions column
export async function storeBondedIntentions(receiverId, bondedIntentionsJson) {
    try {
        const response = await fetch('http://192.168.86.195:3000/storeBondedIntentions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ receiverId, bondedIntentionsJson })
        });
        const result = await response.json();
        console.log('Bonded intentions stored', result);

    } catch(error) {
        console.error("Error storing bonded intentions: ", error);
    }
}

export async function retrieveBondedIntentions(uuid, intention) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/retrieveBondedIntentions?uuid=${encodeURIComponent(uuid)}$intention=${intention}`);
        const data = await response.json();
        const username = data.username;
        return username
    } catch(error) {
        console.error("Error retrieving username", error);
    }
}

// input: intention
// output: intention it's bonded to

function updateStreakGivenBonds(intention, bondedIntentions) {
    // only +1 streak if every achievementStatus is True, else reset to 0

}