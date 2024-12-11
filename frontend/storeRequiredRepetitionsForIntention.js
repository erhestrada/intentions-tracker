// Store data function
export async function storeRequiredRepetitionsForIntention(uuid, intention, repetitions) {
  //console.log(intention, repetitions);
  try {
    const response = await fetch('http://192.168.86.195:3000/storeRequiredRepetitionsForIntention', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid, intention, repetitions })
    });
    const result = await response.json();
    console.log('Data Stored:', result);

  } catch (error) {
    console.error('Error storing data:', error);
  }
};


/*
const uuid = '59a75576-4ef2-48b4-9aa9-89d44bfc00db';
storeRequiredRepetitionsForIntention(uuid, 'weigh self', 1);
storeRequiredRepetitionsForIntention(uuid, 'drink more water', 3);
storeRequiredRepetitionsForIntention(uuid, 'meditate', 1);
storeRequiredRepetitionsForIntention(uuid, "don't eat junk food", 3);
storeRequiredRepetitionsForIntention(uuid, 'limit soda', 3);
storeRequiredRepetitionsForIntention(uuid, 'say no to distractions, wait and wander instead', 6);
storeRequiredRepetitionsForIntention(uuid, 'express intentions in morning check-in', 1);
storeRequiredRepetitionsForIntention(uuid, 'lucid dream', 1);
storeRequiredRepetitionsForIntention(uuid, 'dream', 1);
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
