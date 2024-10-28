import { loadArrayFromLocalStorage } from "./updateIntentionsLog";

function displayProgress() {
    const intentionsLog = loadArrayFromLocalStorage('intentionsLog');
    const intentionsLogContainer = document.getElementById('intentions-log-container');
    for (const intentionAndDateTime of intentionsLog) {
        const [intention, dateTime] = intentionAndDateTime;
        
        const intentionEntry = document.createElement('p');
        intentionEntry.innerText = intention + ' ' + dateTime;
        console.log(dateTime);
        console.log(dateTime.toLocaleString());

        intentionsLogContainer.appendChild(intentionEntry);
    }
}

displayProgress();