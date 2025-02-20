export async function removeIntentionFromIntentionsLog(uuid, intention) {
    try {
        const response = await fetch('http://192.168.86.195:3000/removeIntentionFromIntentionsLog', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uuid, intention })
        });

        const result = await response.json();
        console.log('Intention removed:', result);

    } catch (error) {
        console.error('Error removing intention:', error);
    }

}
