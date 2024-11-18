export function calculateStreaks(statesOfCheckboxes) {
    const dates = Object.keys(statesOfCheckboxes).sort();

    let allActions = [];
    
    for (const date of dates) {
        const dateDict = statesOfCheckboxes[date];
        const actions = Object.keys(dateDict);
        const newActions = actions.filter(action => !allActions.includes(action));
        allActions.push(...newActions);
    }
    
    // Create streaks object with initial values
    let streaks = Object.fromEntries(allActions.map(action => [action, 0]));
    
    //console.log(streaks);

    let previousDate = null;
    
    // Loop through each date and check streaks
    dates.forEach((date, index) => {
        const actionsLog = statesOfCheckboxes[date];
        //console.log('actionsLog', actionsLog);
        
        // Check if consecutive with the previous date
        if (previousDate && !datesAreConsecutive(previousDate, date)) {
            // If not consecutive, reset the streaks for the actions
            for (let action in streaks) {
                streaks[action] = 0; // Reset streak for this action
            }
        }

        // Check each action on this date
        for (let action in actionsLog) {
            // If the action was marked "yes": true, increment the streak
            if (actionsLog[action].yes === true) {
                if (streaks[action] === undefined) {
                    streaks[action] = 1; // Start streak for this action if not already
                } else {
                    streaks[action] += 1; // Increment the streak
                    console.log('streaks:', streaks);
                }
            }
        }
        
        // Set this date as the previous date for the next iteration
        previousDate = date;
    });

    return streaks;
}

function datesAreConsecutive(dateStr1, dateStr2) {
    // Parse the date strings into Date objects
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    
    // Adjust both dates to the same time (midnight) by setting hours, minutes, seconds, and milliseconds to 0
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    
    // Check if date2 is exactly one day after date1
    const differenceInMillis = date2 - date1; // Difference in milliseconds
    
    // One day in milliseconds (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    
    return differenceInMillis === oneDayInMillis;
}


const statesOfCheckboxes = {
                            "10/31/2024":{"meditate":{"yes":true,"no":false}},
                            "11/1/2024":{"meditate":{"yes":true,"no":false},"weigh self":{"yes":false,"no":false},"drink more water":{"yes":false,"no":false}},
                            "11/18/2024":{"weigh self":{"yes":false,"no":false}}
                        };
//const abc = datesAreConsecutive('10/31/2024', '11/1/2024');
//console.log(abc);

const streaks = calculateStreaks(statesOfCheckboxes);
console.log(streaks);