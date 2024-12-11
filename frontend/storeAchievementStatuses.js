
//db.run('CREATE TABLE IF NOT EXISTS achievement_statuses (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, action TEXT, achievement_status INTEGER)');

export async function initializeAchievementStatuses(uuid) {
    const dates = [
        '11/27/2024',
        '11/28/2024',
        '11/29/2024',
        '11/30/2024',
        '12/1/2024',
        '12/2/2024',
        '12/3/2024',
        '12/4/2024',
        '12/5/2024',
        '12/6/2024'
                    ]
    const actions = ['weigh self', 'drink more water','meditate', "don't eat junk food",'limit soda', 'say no to distractions, wait and wander instead', 'express intentions in morning check-in', 'lucid dream','dream']
    const achievementStatusesRows = makeAchievementStatusesRows(uuid, dates, actions);
    console.log(achievementStatusesRows);

    try {
      const response = await fetch('http://192.168.86.195:3000/initializeAchievementStatuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievementStatusesRows })
      });
      const result = await response.json();
      console.log('Data Stored:', result);
  
    } catch (error) {
      console.error('Error storing data:', error);
    }
};

function makeAchievementStatusesRows(uuid, dates, actions) {
    let achievementStatusesRows = [];
    for (const date of dates) {
        for (const action of actions) {
            const row = [uuid, date, action, 0];
            achievementStatusesRows.push(row);
        }
    }
    return achievementStatusesRows;
}

const uuid = '59a75576-4ef2-48b4-9aa9-89d44bfc00db';
initializeAchievementStatuses(uuid);