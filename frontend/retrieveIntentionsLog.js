// Fetch and display data from SQLite database
export async function retrieveAndFormatIntentionsLog(uuid) {
    const intentionsLogRows = await retrieveIntentionsLog(uuid);
    const intentionsLog = makeIntentionsLogFromRows(intentionsLogRows);
    return intentionsLog;
}
  
export async function retrieveIntentionsLog(uuid) {
    try {
    const response = await fetch(`http://192.168.86.195:3000/retrieveIntentionsLog?uuid=${encodeURIComponent(uuid)}`);
    const data = await response.json();
    return data;
    } catch (error) {
    console.error('Error retrieving data:', error);
    }
}

// expected intentionsLog format
// {date: [[intention, timestamp], ...]}
function makeIntentionsLogFromRows(rows) {
    const intentionsLog = rows.reduce((accumulator, row) => {
        const rowDate = row['date'];
        const rowIntention = row['intention'];
        const rowTimestamp = row['timestamp'];
        
        if (!(rowDate in accumulator)) {
            accumulator[rowDate] = [[rowIntention, rowTimestamp]];
        } else {
            accumulator[rowDate].push([rowIntention, rowTimestamp]);
        }
        
        return accumulator;
    }, {});
    return intentionsLog;
}
