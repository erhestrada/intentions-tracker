export async function retrieveAndFormatAchievementStatuses(uuid) {
  const rows = await retrieveAchievementStatuses(uuid);
  const achievementStatuses = makeAchievementStatusesFromRows(rows);
  return achievementStatuses;
}

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

// date, action, achievement_status
function makeAchievementStatusesFromRows(rows) {
  const achievementStatuses = rows.reduce((accumulator, row) => {
    const date = row['date'];
    const action = row['action'];
    const achievementStatus = row['achievement_status'];

    if (!(date in accumulator)) {
      accumulator[date] = {[action]: achievementStatus};
    } else {
      accumulator[date][action] = achievementStatus;
    }

    return accumulator;
  }, {});
  return achievementStatuses;
}