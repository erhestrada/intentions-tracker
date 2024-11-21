// Store data function
export async function storeRequiredRepetitionsForIntention(intention, repetitions) {
  //console.log(intention, repetitions);
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

/*
storeRequiredRepetitionsForIntention('weigh self', 1);
storeRequiredRepetitionsForIntention('drink more water', 3);
storeRequiredRepetitionsForIntention('meditate', 1);
storeRequiredRepetitionsForIntention("don't eat junk food", 3);
storeRequiredRepetitionsForIntention('limit soda', 3);
storeRequiredRepetitionsForIntention('say no to distractions, wait and wander instead', 6);
storeRequiredRepetitionsForIntention('express intentions in morning check-in', 1);
storeRequiredRepetitionsForIntention('lucid dream', 1);
*/


/*
deletes where id = 1
db.run('DELETE FROM required_repetitions_per_intention WHERE id = ?', [1], (err) => {
  if (err) {
    console.error('Error deleting row:', err);
  } else {
    console.log('Row deleted successfully');
  }
});


*/
