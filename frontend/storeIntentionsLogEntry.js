export async function storeIntentionsLogEntry(uuid, date, intention, timestamp) {
    try {
      const response = await fetch('http://192.168.86.195:3000/storeIntentionsLogEntry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, date, intention, timestamp })
      });
        const result = await response.json();
        console.log('Data Stored:', result);
    } catch (error) {
        console.error('Error storing data:', error);
    }
};
