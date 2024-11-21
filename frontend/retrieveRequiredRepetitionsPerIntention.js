// Fetch and display data from SQLite database
export async function retrieveRequiredRepetitionsPerIntention() {
    try {
      const response = await fetch('http://192.168.86.195:3000/retrieve');
      const data = await response.json();
      dataDiv.innerHTML = data.map(item => `<p>Stored Value: ${item.value}</p>`).join('');
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }
  