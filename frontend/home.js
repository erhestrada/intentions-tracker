import { retrieveRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";
import { typeIntentions, handleKeydown } from "./typeIntentions";

function displayIntentionBoxes(requiredRepetitionsPerIntention, intentionsRepetitionsPerDate) {
    const intentionBoxesContainer = document.getElementById('intention-boxes-container');
    for (const {id, intention, repetitions} of requiredRepetitionsPerIntention) {
        const intentionBox = document.createElement('div');
        intentionBox.className = 'intention-box';
        intentionBox.id = intention;

        const intentionTextElement = document.createElement('p');
        intentionTextElement.innerText = intention;
        
        const requiredRepetitionsTextElement = document.createElement('p');
        const date = (new Date()).toLocaleDateString();
        let repetitionsOnDate;
        if (date in intentionsRepetitionsPerDate) {
            repetitionsOnDate = intentionsRepetitionsPerDate[date][intention] || 0;
        } else {
            repetitionsOnDate = 0;
        }
        requiredRepetitionsTextElement.innerText = repetitionsOnDate + '/' + repetitions + ' repetitions';

        const repetitionSquaresElement = document.createElement('p');
        //repetitionSquaresElement.innerText = '⬜'.repeat(repetitions);
        repetitionSquaresElement.innerText = displayProgress(intention, repetitions, intentionsRepetitionsPerDate);

        const successTextElement = document.createElement('p');
        successTextElement.innerText = 'Achievement Status';

        // load achievementStatus for the day, and streaks; update both achievement status and streak
        /*
        const achievementStatuses = {
            "10/31/2024":{"meditate":{"yes":true,"no":false}},
            "11/1/2024":{"meditate":{"yes":true,"no":false},"weigh self":{"yes":false,"no":false},"drink more water":{"yes":false,"no":false}},
            "11/18/2024":{"weigh self":{"yes":false,"no":false}}
        };
        */
        let achievementStatuses = JSON.parse(localStorage.getItem('achievementStatuses')) || {};
        let streaks = localStorage.getItem('streaks') || {};
        const successButton = document.createElement('button');
        successButton.innerText = '✔️';

        const streakElement = document.createElement('p');
        let streaksValue = streaks?.[date]?.[intention] ?? 0;
        streakElement.innerText = "Streak: " + streaksValue;

        successButton.addEventListener('click', () => {
            //achievementStatus[date][intention] = true
            achievementStatuses = updateAchievementStatuses(achievementStatuses, date, intention, true);
            console.log('achievement statuses', achievementStatuses);
            streaks = updateStreaks(streaks, date, intention, achievementStatuses);
            console.log('streaksABC', streaks);
            let streaksValue = streaks?.[date]?.[intention] ?? 0;
            streakElement.innerText = "Streak: " + streaksValue;
            if (intentionBox.style.backgroundColor === 'rgb(129, 199, 132)') {
                intentionBox.style.backgroundColor = 'lightblue';
                // change achievementStatus to default state - false
                achievementStatuses = updateAchievementStatuses(achievementStatuses, date, intention, false);
                streaks = updateStreaks(streaks, date, intention, achievementStatuses);
            } else {
                intentionBox.style.backgroundColor = '#81C784';
            }
        });

        const failureButton = document.createElement('button');
        failureButton.innerText = '❌';
        failureButton.addEventListener('click', () => {
            //achievementStatuses = updateAchievementStatuses(achievementStatuses, intention, date, false);
            achievementStatuses = updateAchievementStatuses(achievementStatuses, date, intention, false);
            streaks = updateStreaks(streaks, date, intention, achievementStatuses);
            let streaksValue = streaks?.[date]?.[intention] ?? 0;
            streakElement.innerText = "Streak: " + streaksValue;
            if (intentionBox.style.backgroundColor === 'rgb(229, 57, 53)') {
                intentionBox.style.backgroundColor = 'lightblue';
                streaks = updateStreaks(streaks, date, intention, achievementStatuses);
            } else {
                intentionBox.style.backgroundColor = '#E53935 ';
            }
        });        

        intentionBoxesContainer.appendChild(intentionBox);
        intentionBox.appendChild(intentionTextElement);
        intentionBox.appendChild(requiredRepetitionsTextElement);
        intentionBox.appendChild(repetitionSquaresElement);
        intentionBox.appendChild(successTextElement);
        intentionBox.appendChild(successButton);
        intentionBox.appendChild(failureButton);
        intentionBox.appendChild(streakElement);
    }
}

function displayProgress(intention, requiredRepetitions, intentionsRepetitionsPerDate) {
    const requirementSymbol = '⬜';
    const repetitionSymbol = '✅';
    /*
    let date = (new Date()).toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      });
    */
    const date = (new Date()).toLocaleDateString();
    let repetitionsOnDate;
    if (date in intentionsRepetitionsPerDate) {
        repetitionsOnDate = intentionsRepetitionsPerDate[date][intention] || 0;
    } else {
        repetitionsOnDate = 0;
    }

    let repetitionsLeftToDo = requiredRepetitions - repetitionsOnDate;
    if (repetitionsLeftToDo < 0) {
        repetitionsLeftToDo = 0;
    }

    // display all checkmarks
    const innerText = intention + ' ' + repetitionSymbol.repeat(repetitionsOnDate) + requirementSymbol.repeat(repetitionsLeftToDo);
    return innerText;
}

function makeIntentionsRepetitionsPerDateFromIntentionsLog(intentionsLog) {
    const intentionsRepetitionsPerDate = {};
    for (const [date, intentionsAndDateTimes] of Object.entries(intentionsLog)) {
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

        intentionsRepetitionsPerDate[date] = intentionsRepetitionsOnDate;
    }
    return intentionsRepetitionsPerDate;
}

function updateAchievementStatuses(achievementStatuses, date, intention, achievementStatus) {
    // Ensure the date is part of the object, creating it if necessary
    if (!achievementStatuses[date]) {
        achievementStatuses[date] = {};
    }
    console.log(achievementStatuses[date]);
    achievementStatuses[date][intention] = achievementStatus;
    
    localStorage.setItem('achievementStatuses', JSON.stringify(achievementStatuses));
    console.log(achievementStatuses[date]);
    return achievementStatuses
}

// needs to be streaks[date][intention]
function updateStreaks(streaks, date, intention, achievementStatuses) {
    const yesterdaysDate = getYesterdaysDate(date);
    const achievementStatus = achievementStatuses[date][intention];

    if (!streaks[yesterdaysDate]) {
        if (date in streaks) {
            streaks[date][intention] = 0;
        } else {
            streaks[date] = {[intention]: 0};
        }
    }

    let yesterdaysStreakValue = streaks?.[yesterdaysDate]?.[intention] ?? 0;

    if (achievementStatus === true) {
        streaks[date][intention] = yesterdaysStreakValue + 1;
    } else {
        if (yesterdaysStreakValue > 0) {
            streaks[date] = yesterdaysStreakValue - 1;
        }
    }
    
    console.log('streaks', streaks);
    return streaks;
}

function getYesterdaysDate(dateStr) {
    // Create a Date object from the given date string (MM/DD/YYYY)
    const dateParts = dateStr.split('/');
    const date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]); // Months are 0-based in JavaScript
    
    // Subtract one day to get yesterday's date
    date.setDate(date.getDate() - 1);
    
    // Format the new date as MM/DD/YYYY
    const yesterday = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    
    return yesterday;
}

const intentions = Object.keys(JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {});
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();  // Prevent the default spacebar action (scrolling)
    }
    handleKeydown(e, intentions)
});
document.getElementById('express-intentions-button').addEventListener('click',  function() {
    this.blur();
    typeIntentions(intentions)
});

const requiredRepetitionsPerIntention = await retrieveRequiredRepetitionsPerIntention();
const intentionsLog = JSON.parse(localStorage.getItem('intentionsLog')) || {};
const intentionsRepetitionsPerDate = makeIntentionsRepetitionsPerDateFromIntentionsLog(intentionsLog);
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
displayIntentionBoxes(requiredRepetitionsPerIntention, intentionsRepetitionsPerDate);
