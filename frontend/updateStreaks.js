import { storeStreak } from "./storeStreak";
import { retrieveAndFormatAchievementStatuses } from "./retrieveAchievementStatuses";

export async function updateStreaks(uuid, streaks, date, intention, achievementStatuses, bondedIntentions) {
    const yesterdaysDate = getYesterdaysDate(date);
    const achievementStatus = achievementStatuses[date][intention];

    // streaks initialization

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

    // end of streaks initialization
    const bondedIntentionsAchievementStatuses = await loadBondedIntentionsAchievementStatuses(bondedIntentions, date);
    console.log('HELLO???', bondedIntentionsAchievementStatuses);

    // update streak using achievementStatus
    // if ALL bonded intentions have achievementStatus = true, +1
    // only +1 streak if every achievementStatus is True, else reset to 0

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

// {id: 1, user_id: '59a75576-4ef2-48b4-9aa9-89d44bfc00db', intention: 'weigh self', bonded_intentions: '[["8d394cbd-4cbf-4d8f-8ab5-8e886cf740eb","walk the dog"]]'}
async function loadBondedIntentionsAchievementStatuses(bondedIntentions, date) {
    if (Object.keys(bondedIntentions).length > 0) {
        // user-intention pairs
        const bondedIntentionsX = JSON.parse(bondedIntentions.bonded_intentions);
        const bondedIntentionsIds = bondedIntentionsX.map((element) => element[0]);
        const intentionsPerUser = bondedIntentionsX.reduce((acc, curr) => {
            const [id, intention] = curr;
            if (!(id in acc)) {
                acc[id] = [intention];
            } else {
                acc[id].push(intention);
            }
            return acc;
        }, {});

        for(const uuid of bondedIntentionsIds) {
            // e.g,. 3/11/2025: {walk the dog: 1}
            const achievementStatuses = await retrieveAndFormatAchievementStatuses(uuid);
            const achievementStatusesPerIntention = achievementStatuses[date] ? achievementStatuses[date] : {};
            const intentions = intentionsPerUser[uuid];

            const achievementStatusesPerBondedIntention = Object.keys(achievementStatusesPerIntention).filter(key => intentions.includes(key)).reduce((acc, key) => {
                acc[key] = obj[key];
                return acc;
            }, {});

            if (Object.values(achievementStatusesPerBondedIntention).includes(0) || Object.keys(achievementStatusesPerBondedIntention).length === 0) {
                return false;
            }

        }

        return true;

    } else {
        return false;
    }
}
