export async function sendBondRequest(senderId, bondedIntentions) {
    const receiverIds = Object.keys(bondedIntentions);
    for (const receiverId of receiverIds) {
        const acceptanceStatus = senderId === receiverId ? 'accepted' : 'pending';
        storeBondRequest(senderId, receiverId, bondedIntentions, acceptanceStatus);
    }
};

async function storeBondRequest(senderId, receiverId, bondedIntentions, acceptanceStatus) {
    try {
        const response = await fetch('http://192.168.86.195:3000/storeBondRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ senderId, receiverId, bondedIntentions, acceptanceStatus })
        });
          const result = await response.json();
          console.log('Data Stored:', result);
    
      } catch (error) {
          console.error('Error storing data:', error);
      }
}

export async function updateBondRequest(receiverId, bondedIntentionsJson, updatedStatus) {
    try {
        const response = await fetch('http://192.168.86.195:3000/updateBondRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiverId, bondedIntentionsJson, updatedStatus })
        });
          const result = await response.json();
          console.log('Data Stored:', result);
    
      } catch (error) {
          console.error('Error storing data:', error);
      }
}
