// Store data function
export async function storeRequiredRepetitionsForIntention(intention, repetitions) {
  try {
    const response = await fetch('http://192.168.86.195:3000/storeRequiredRepetitionsForIntention', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intention, repetitions })
    });
    const result = await response.json();
    console.log('Data Stored:', result);

  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Fetch and display data from SQLite database
async function getData() {
  try {
    const response = await fetch('http://192.168.86.195:3000/retrieve');
    const data = await response.json();
    dataDiv.innerHTML = data.map(item => `<p>Stored Value: ${item.value}</p>`).join('');
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
}
