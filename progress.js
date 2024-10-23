import { loadArrayFromLocalStorage } from "./updateIntentionsLog";

function displayProgress() {
    const intentionsLog = loadArrayFromLocalStorage('intentionsLog');
    const intentionsLogContainer = document.getElementById('intentions-log-container');
    for (const intention of intentionsLog) {
        const intentionElement = document.createElement('p');
        intentionElement.innerText = intention;
        intentionsLogContainer.appendChild(intentionElement);
    }
}

displayProgress();