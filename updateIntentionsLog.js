import { saveDataToLocalStorage } from "./addIntention";

export function updateIntentionsLog(intention, dateTime) {
    const jsonIntentionsLog = localStorage.getItem('intentionsLog') ?? JSON.stringify([]);
    let intentionsLog = JSON.parse(jsonIntentionsLog);
    intentionsLog.push([intention, dateTime]);
    saveDataToLocalStorage('intentionsLog', intentionsLog);
    return intentionsLog;
}
