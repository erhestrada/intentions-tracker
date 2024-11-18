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
        console.log('data', date);
        console.log('states of checkboxes', statesOfCheckboxes);

        const uniqueIntentions = Object.keys(intentionsRepetitionsOnDate);
        //const uniqueIntentions = Object.keys(requiredRepetitionsPerIntention);
        //console.log(uniqueIntentions);
        uniqueIntentions.forEach(intention => {
            // Create a label for the intention
            const label = document.createElement('label');
            label.textContent = intention; // Set label text to the intention
            entryForDate.appendChild(label); // Append the label to the body
    
            // Create the "Yes" checkbox
            const yesCheckbox = document.createElement('input');
            yesCheckbox.type = "checkbox";
            yesCheckbox.id = date.replace(/\//g, '-') + '-' + `${intention.replace(/ /g, '-')}-yes`;
            console.log(yesCheckbox.id);
            yesCheckbox.checked = statesOfCheckboxes[date] && statesOfCheckboxes[date][intention] ? statesOfCheckboxes[date][intention]['yes'] : false;
            yesCheckbox.addEventListener('change', () => updateCheckboxStates(date, intention, 'yes', yesCheckbox.checked));
    
            // Create the label for the "Yes" checkbox
            const yesLabel = document.createElement('label');
            yesLabel.htmlFor = yesCheckbox.id; // Associate the label with the checkbox
            yesLabel.textContent = " Yes"; // Set label text
    
            // Create the "No" checkbox
            const noCheckbox = document.createElement('input');
            noCheckbox.type = "checkbox";
            noCheckbox.id = date.replace(/\//g, '-') + '-' + `${intention.replace(/ /g, '-')}-no`;
            noCheckbox.checked = statesOfCheckboxes[date] && statesOfCheckboxes[date][intention] ? statesOfCheckboxes[date][intention]['no'] : false;
            noCheckbox.addEventListener('change', () => updateCheckboxStates(date, intention, 'no', noCheckbox.checked));

            // uncheck no checkbox when yes checkbox checked
            yesCheckbox.addEventListener('change', () => {
                if (yesCheckbox.checked) {
                    noCheckbox.checked = false;
                    updateCheckboxStates(date, intention, 'no', noCheckbox.checked)
                }
            });
            
            // uncheck yes checkbox when no checkbox checked
            noCheckbox.addEventListener('change', () => {
                if (noCheckbox.checked) {
                    yesCheckbox.checked = false;
                    updateCheckboxStates(date, intention, 'yes', yesCheckbox.checked)
                }
            });

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

function updateCheckboxStates(date, intention, yesNo, checked) {
    // Retrieve existing states from localStorage, or initialize an empty object if none exist
    let statesOfCheckboxes = JSON.parse(localStorage.getItem('statesOfCheckboxes')) || {};

    // Ensure the date is part of the object, creating it if necessary
    if (!statesOfCheckboxes[date]) {
        statesOfCheckboxes[date] = {};
    }

    // If the intention exists, update the yesNo state
    if (intention in statesOfCheckboxes[date]) {
        statesOfCheckboxes[date][intention][yesNo] = checked;
    } else {
        // Otherwise, initialize the intention with the yesNo states
        statesOfCheckboxes[date][intention] = { 'yes': false, 'no': false };
        statesOfCheckboxes[date][intention][yesNo] = checked;
    }

    // Save the updated states back to localStorage
    localStorage.setItem('statesOfCheckboxes', JSON.stringify(statesOfCheckboxes));

    return statesOfCheckboxes;
}

displayProgress();
