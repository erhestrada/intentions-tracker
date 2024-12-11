export async function retrieveAndFormatStreaks(uuid) {
    const streaksRows = await retrieveStreaks(uuid);
    const streaks = makeStreaksFromRows(streaksRows);
    return streaks;
}
  
export async function retrieveStreaks(uuid) {
    try {
    const response = await fetch(`http://192.168.86.195:3000/retrieveStreaks?uuid=${encodeURIComponent(uuid)}`);
    const data = await response.json();
    return data;
    } catch (error) {
    console.error('Error retrieving data:', error);
    }
}

function makeStreaksFromRows(rows) {
    const streaks = rows.reduce((accumulator, row) => {
        accumulator[row['date']] = [row['intention'], row[timestamp]];
        return accumulator;
    }, {});
    return streaks;
}
