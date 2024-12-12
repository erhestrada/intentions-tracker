
//const uuid = '59a75576-4ef2-48b4-9aa9-89d44bfc00db';
export async function storeAchievementStatus(uuid, date, intention, achievementStatus) {
    console.log('A');
    achievementStatus = achievementStatus ? 1 : 0;
    try {
      const response = await fetch('http://192.168.86.195:3000/storeAchievementStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, date, intention, achievementStatus })
      });
        console.log('B');
        const result = await response.json();
        console.log('Data Stored:', result);
  
    } catch (error) {
        console.log('C');
        console.error('Error storing data:', error);
    }
};
