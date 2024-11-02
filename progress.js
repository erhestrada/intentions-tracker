import { displaySquares } from "./displaySquares";
import { loadArrayFromLocalStorage } from "./updateIntentionsLog";

// put a checkmark next to intention if date matches date for container
// ✅

function displayProgress() {
    const requiredRepetitionsPerIntention = JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {};    
    const intentionsLog = JSON.parse(localStorage.getItem('intentionsLog')) || {};
    const intentionsLogContainer = document.getElementById('intentions-log-container');

    for (const [date, intentionsAndDateTimes] of Object.entries(intentionsLog)) {
        const entryForDate = document.createElement('div');
        entryForDate.className = 'entry-for-date';
        const dateElement = document.createElement('p');
        dateElement.textContent = date;
        entryForDate.append(dateElement);

        console.log(intentionsAndDateTimes);

        // just store intentionsExpressedOnDate in main.js in the first place
        const intentionsExpressedOnDate = intentionsAndDateTimes.filter(intentionAndDateTime => {
            const [intention, isoDateTime] = intentionAndDateTime;
            const abc = new Date(isoDateTime);
            if (abc.toLocaleDateString() === date) {
                return true;
            } 
        }).map(element => element[0]);
        
        const intentionsRepetitionsOnDate = intentionsExpressedOnDate.reduce((acc, element) => {
            acc[element] = (acc[element] || 0) + 1;
            return acc;
        }, {});

        Object.entries(requiredRepetitionsPerIntention).forEach(([intention, requiredRepetitions]) => {
            const requirementSymbol = '⬜';
            const repetitionSymbol = '✅';
            const repetitionsOnDate = intentionsRepetitionsOnDate[intention] || 0;

            let repetitionsLeftToDo = requiredRepetitions - repetitionsOnDate;
            if (repetitionsLeftToDo < 0) {
                repetitionsLeftToDo = 0;
            }

            // display all checkmarks
            const checkmarksElement = document.createElement('p');
            checkmarksElement.innerText = intention + ' ' + repetitionSymbol.repeat(repetitionsOnDate) + requirementSymbol.repeat(repetitionsLeftToDo);
            entryForDate.appendChild(checkmarksElement);
        })

        let statesOfCheckboxes = JSON.parse(localStorage.getItem('statesOfCheckboxes')) || {};

        const uniqueIntentions = Object.keys(intentionsRepetitionsOnDate);
        //const uniqueIntentions = Object.keys(requiredRepetitionsPerIntention);
        console.log(uniqueIntentions);
        uniqueIntentions.forEach(intention => {
            // Create a label for the intention
            const label = document.createElement('label');
            label.textContent = intention; // Set label text to the intention
            entryForDate.appendChild(label); // Append the label to the body
    
            // Create the "Yes" checkbox
            const yesCheckbox = document.createElement('input');
            yesCheckbox.type = "checkbox";
            yesCheckbox.id = `${intention.replace(' ', '-')}-yes`; // Unique ID for "Yes" checkbox
            yesCheckbox.checked = statesOfCheckboxes[intention] ? statesOfCheckboxes[intention]['yes'] : false;
            yesCheckbox.addEventListener('change', () => updateCheckboxStates(intention, 'yes', yesCheckbox.checked));
    
            // Create the label for the "Yes" checkbox
            const yesLabel = document.createElement('label');
            yesLabel.htmlFor = yesCheckbox.id; // Associate the label with the checkbox
            yesLabel.textContent = " Yes"; // Set label text
    
            // Create the "No" checkbox
            const noCheckbox = document.createElement('input');
            noCheckbox.type = "checkbox";
            noCheckbox.id = `${intention.replace(' ', '-')}-no`; // Unique ID for "No" checkbox
            noCheckbox.checked = statesOfCheckboxes[intention] ? statesOfCheckboxes[intention]['no'] : false;
            noCheckbox.addEventListener('change', () => updateCheckboxStates(intention, 'no', noCheckbox.checked));
    
            // Create the label for the "No" checkbox
            const noLabel = document.createElement('label');
            noLabel.htmlFor = noCheckbox.id; // Associate the label with the checkbox
            noLabel.textContent = " No"; // Set label text
    
            // Append the checkboxes and their labels to the body
            entryForDate.appendChild(yesCheckbox);
            entryForDate.appendChild(yesLabel);
            entryForDate.appendChild(noCheckbox);
            entryForDate.appendChild(noLabel);
            entryForDate.appendChild(document.createElement('br'));
            intentionsLogContainer.appendChild(entryForDate);
        })

    }



}

function updateCheckboxStates(intention, yesNo, checked) {
    let statesOfCheckboxes = JSON.parse(localStorage.getItem('statesOfCheckboxes')) || {};
    if (intention in statesOfCheckboxes) {
        statesOfCheckboxes[intention][yesNo] = checked;
    } else {
        statesOfCheckboxes[intention] = {'yes': false, 'no': false};
    }
    localStorage.setItem('statesOfCheckboxes', JSON.stringify(statesOfCheckboxes));
    return statesOfCheckboxes;
}

displayProgress();
