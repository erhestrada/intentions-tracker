export async function retrieveAcceptanceStatuses(bondedIntentionsJson) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/retrieveAcceptanceStatuses?bondedIntentionsJson=${encodeURIComponent(bondedIntentionsJson)}`);
        const data = await response.json();
        return data
    } catch(error) {
        console.error("Error retrieving acceptance statuses", error);
    }
}
