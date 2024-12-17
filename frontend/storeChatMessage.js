export async function storeChatMessage(chatMessage) {
    try {
        const response = await fetch('http://192.168.86.195:3000/storeChatMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatMessage })
        });
        
        const result = await response.json();
        console.log('Data Store:', result);
    } catch (error) {
        console.error('Error storing data:', error);
    }
}
