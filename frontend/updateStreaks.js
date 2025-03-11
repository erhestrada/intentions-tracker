import { storeStreak } from "./storeStreak";

export function updateStreaks(uuid, streaks, date, intention, achievementStatuses, bondedIntentions) {
    const yesterdaysDate = getYesterdaysDate(date);
    const achievementStatus = achievementStatuses[date][intention];

    // if yesterday's date not in streaks, today's streak for the intention is at 0
    if (!streaks[yesterdaysDate]) {
        // if streaks[date] already initialized as an object, set streaks[date][intention] to 0
        if (date in streaks) {
            streaks[date][intention] = 0;
        } else {
            // initialize streaks[date] as an object with key intention and value 0
            streaks[date] = {[intention]: 0};
        }
    }

    // placeholder streak value of false
    if (!(date in streaks)) {
        streaks[date] = {[intention]: false};
    } else {
        if (!(intention in streaks[date])) {
            streaks[date][intention] = false;
        }
    }

    //let streakValue = streaks?.[date]?.[intention] ?? streaks?.[yesterdaysDate]?.[intention] ?? 0;
    let streak;
    let yesterdaysStreakValue = streaks?.[yesterdaysDate]?.[intention] ?? 0;

    if (achievementStatus === true) {
        streak = yesterdaysStreakValue + 1
        streaks[date][intention] = streak;
    } else {
        // streak resets to 0 if failed
        streak = 0;
        streaks[date][intention] = streak;
    }
    
    storeStreak(uuid, date, intention, streak);
    //localStorage.setItem('streaks', JSON.stringify(streaks));
    console.log('streaks', streaks);
    return streaks;
}

export function undoStreakUpdate(uuid, streaks, date, intention) {
    const yesterdaysDate = getYesterdaysDate(date);
    streaks[date][intention] = streaks?.[yesterdaysDate]?.[intention] ?? 0;
    const streak = streaks?.[yesterdaysDate]?.[intention] ?? 0;
    storeStreak(uuid, date, intention, streak);
    //localStorage.setItem('streaks', JSON.stringify(streaks));
    return streaks
}

export function getYesterdaysDate(dateStr) {
    // Create a Date object from the given date string (MM/DD/YYYY)
    const dateParts = dateStr.split('/');
    const date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]); // Months are 0-based in JavaScript
    
    // Subtract one day to get yesterday's date
    date.setDate(date.getDate() - 1);
    
    // Format the new date as MM/DD/YYYY
    const yesterday = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    
    return yesterday;
}

// input: intention
// output: intention it's bonded to

function updateStreakGivenBonds(intention, bondedIntentions) {
    // only +1 streak if every achievementStatus is True, else reset to 0

}