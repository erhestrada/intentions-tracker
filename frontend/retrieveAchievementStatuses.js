export async function retrieveAchievementStatuses(uuid) {
    try {
      //const response = await fetch('http://192.168.86.195:3000/retrieveRequiredRepetitionsPerIntention');
      const response = await fetch(`http://192.168.86.195:3000/retrieveAchievementStatuses?uuid=${encodeURIComponent(uuid)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
}
