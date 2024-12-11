// Fetch and display data from SQLite database
export async function retrieveAndFormatRequiredRepetitionsPerIntention(uuid) {
    const requiredRepetitionsPerIntentionRows = await retrieveRequiredRepetitionsPerIntention(uuid);
    const requiredRepetitionsPerIntention = makeRequiredRepetitionsPerIntentionFromRows(requiredRepetitionsPerIntentionRows);
    return requiredRepetitionsPerIntention;
}
  
export async function retrieveIntentionsLog(uuid) {
    try {
    //const response = await fetch('http://192.168.86.195:3000/retrieveRequiredRepetitionsPerIntention');
    const response = await fetch(`http://192.168.86.195:3000/retrieveIntentionsLog?uuid=${encodeURIComponent(uuid)}`);
    const data = await response.json();
    return data;
    } catch (error) {
    console.error('Error retrieving data:', error);
    }
}

function makeRequiredRepetitionsPerIntentionFromRows(rows) {
    const requiredRepetitionsPerIntention = rows.reduce((accumulator, row) => {
        accumulator[row['intention']] = row['repetitions'];
        return accumulator;
    }, {});
    return requiredRepetitionsPerIntention;
}
