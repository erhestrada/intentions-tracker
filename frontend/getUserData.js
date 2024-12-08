export async function getUserData(userId) {
    try {
        const response = await fetch('http://192.168.86.195:3000/retrieveRequiredRepetitionsPerIntention');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
}