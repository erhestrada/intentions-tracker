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
        const response = await fetch(`http://192.168.86.195:3000/retrieveBondedIntentions?uuid=${encodeURIComponent(uuid)}&intention=${intention}`);

        if (!response.ok) {
            const errorData = await response.json();  // Get the error details from the response
            throw new Error(errorData.error || 'Unknown error occurred');
        }

        const data = await response.json();
        return data

    } catch(error) {
        console.error("Error retrieving bonded intentions", error);
        return [];
    }
}

export async function batchRetrieveBondedIntentions(uuid, intentions) {
    let x = {};
    for (const intention of intentions) {
        a = retrieveBondedIntentions(uuid, intention);
        x[intention] = a;
    }
    return x;
}