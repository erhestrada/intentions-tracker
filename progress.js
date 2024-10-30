import { loadArrayFromLocalStorage } from "./updateIntentionsLog";

function displayProgress() {
    const intentionsLog = loadArrayFromLocalStorage('intentionsLog');
    const intentionsLogContainer = document.getElementById('intentions-log-container');
    for (const intentionAndDateTime of intentionsLog) {
        const [intention, dateTime] = intentionAndDateTime;
        
        const intentionEntry = document.createElement('p');
        intentionEntry.innerText = intention + ' ' + formatTime(dateTime);

        intentionsLogContainer.appendChild(intentionEntry);
    }
    const uniqueIntentions = getUniqueIntentionsFromIntentionsLog(intentionsLog);
    console.log(uniqueIntentions);
    uniqueIntentions.forEach(intention => {
        // Create a label for the intention
        const label = document.createElement('label');
        label.textContent = intention; // Set label text to the intention
        document.body.appendChild(label); // Append the label to the body

        // Create the "Yes" checkbox
        const yesCheckbox = document.createElement('input');
        yesCheckbox.type = "checkbox";
        yesCheckbox.id = `${intention.replace(' ', '-')}-yes`; // Unique ID for "Yes" checkbox
        yesCheckbox.addEventListener('change', () => localStorage.setItem(yesCheckbox.id + '-checkbox-state', yesCheckbox.checked));

        // Create the label for the "Yes" checkbox
        const yesLabel = document.createElement('label');
        yesLabel.htmlFor = yesCheckbox.id; // Associate the label with the checkbox
        yesLabel.textContent = " Yes"; // Set label text

        // Create the "No" checkbox
        const noCheckbox = document.createElement('input');
        noCheckbox.type = "checkbox";
        noCheckbox.id = `${intention.replace(' ', '-')}-no`; // Unique ID for "No" checkbox
        noCheckbox.addEventListener('change', () => localStorage.setItem(noCheckbox.id + '-checkbox-state', noCheckbox.checked));

        // Create the label for the "No" checkbox
        const noLabel = document.createElement('label');
        noLabel.htmlFor = noCheckbox.id; // Associate the label with the checkbox
        noLabel.textContent = " No"; // Set label text

        // Append the checkboxes and their labels to the body
        document.body.appendChild(yesCheckbox);
        document.body.appendChild(yesLabel);
        document.body.appendChild(noCheckbox);
        document.body.appendChild(noLabel);
        document.body.appendChild(document.createElement('br'));
    })
    // pass/fail buttons per intention
}

function formatTime(dateTime) {
    // Create a Date object from the string
    const date = new Date(dateTime);
    
    // Extract hours, minutes, and seconds
    let hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Format minutes with leading zeros
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    // Combine to get the final formatted time
    const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
    
    // Replace the time portion in the original date string
    const newDateString = dateTime.replace(/(\d{2}:\d{2}:\d{2})/, formattedTime);
    const trimmedDateString = newDateString.replace(/(AM|PM).*/, '$1');
    return trimmedDateString    
}

function getUniqueIntentionsFromIntentionsLog(intentionsLog) {
    const intentions = intentionsLog.map(intentionEntry => intentionEntry[0]);
    const uniqueIntentions = [...new Set(intentions)];
    return uniqueIntentions
}

// e.g. checkboxStates = {meditate: {yes: true, no: false}}
function loadStatesOfCheckboxes() {
    const checkboxStates = JSON.parse(localStorage.getItem('statesOfCheckboxes')) || {};

    for (const action in checkboxStates) {
        if (checkboxStates.hasOwnProperty(action)) {
            const yesNoStates = checkboxStates[action];
    
            for (const yesNoState in yesNoStates) {
                if (yesNoStates.hasOwnProperty(yesNoState)) {
                    const bool = obj[yesNo];
                    console.log(`${intention}: ${yesNo} is ${bool}`);
                    // get the checkbox and set its state
                    // const checkbox = document.getElementById('myCheckbox');
                    // checkbox.checked = (savedState === 'true');

                }
            }
        }
    }

}

displayProgress();
loadStatesOfCheckboxes();