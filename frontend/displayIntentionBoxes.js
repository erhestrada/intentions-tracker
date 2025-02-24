import { removeIntentionFromRequiredRepetitionsPerIntention } from "./removeIntentionFromRequiredRepetitionsPerIntention";
import { removeIntentionFromIntentionsLog } from "./removeIntentionFromIntentionsLog";

export async function displayIntentionBoxes(uuid, requiredRepetitionsPerIntention, intentionsRepetitionsPerDate, achievementStatuses, formattedAchievementStatuses, streaks, date, yesterdaysDate, intentionBoxesContainer) {
    for (const [intention, requiredRepetitions] of Object.entries(requiredRepetitionsPerIntention)) {
        displayIntentionBox(intention, requiredRepetitions, achievementStatuses, formattedAchievementStatuses, intentionsRepetitionsPerDate, date, streaks, yesterdaysDate, intentionBoxesContainer, true);
    }

    /*
    const plusMinusBox = document.createElement('div');
    plusMinusBox.className = 'intention-box';
    plusMinusBox.id = 'plus-minus-box';

    const plusMinusBoxLabel = document.createElement('p');
    plusMinusBoxLabel.innerText = 'Add / Remove Intentions';

    const plusButtonElement = document.createElement('button');
    plusButtonElement.innerText = '+';
    plusButtonElement.addEventListener('click', openPopUp);

    const minusButtonElement = document.createElement('button');
    minusButtonElement.innerText = '-';
    minusButtonElement.addEventListener('click', () => {
        minusButtonElement.clicked = !minusButtonElement.clicked;

        const removeIntentionButtons = document.querySelectorAll('.remove-intention-button');

        removeIntentionButtons.forEach(button => {
            button.style.display = minusButtonElement.clicked ? 'block' : 'none';
        });
    });

    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', closePopUp);
    }

    intentionBoxesContainer.appendChild(plusMinusBox);
    plusMinusBox.appendChild(plusMinusBoxLabel);
    plusMinusBox.appendChild(plusButtonElement);
    plusMinusBox.appendChild(minusButtonElement);
    */
}

function displayIntentionBox(intention, requiredRepetitions, achievementStatuses, formattedAchievementStatuses, intentionsRepetitionsPerDate, date, streaks, yesterdaysDate, intentionBoxesContainer, initialize) {
    const intentionBox = document.createElement('div');
    intentionBox.className = 'intention-box';
    intentionBox.id = intention;

    const achievementStatus = formattedAchievementStatuses?.[date]?.[intention] ?? 0;

    if (achievementStatus === 1) {
        intentionBox.style.backgroundColor = 'rgb(129, 199, 132)';
    } else {
        //intentionBox.style.backgroundColor = 'rgb(229, 57, 53)';
        intentionBox.style.backgroundColor = 'lightblue';
    }

    const intentionTextElement = document.createElement('p');
    intentionTextElement.innerText = intention;
    
    const requiredRepetitionsTextElement = document.createElement('p');
    requiredRepetitionsTextElement.id = intention.replace(/ /g, '-') + '-requiredRepetitionsText';

    let repetitionsOnDate;
    if (date in intentionsRepetitionsPerDate) {
        repetitionsOnDate = intentionsRepetitionsPerDate[date][intention] || 0;
    } else {
        repetitionsOnDate = 0;
    }
    requiredRepetitionsTextElement.innerText = repetitionsOnDate + '/' + requiredRepetitions + ' repetitions';

    const repetitionSquaresElement = document.createElement('p');
    repetitionSquaresElement.id = intention.replace(/ /g, '-') + '-repetitionSquares';
    //repetitionSquaresElement.innerText = '⬜'.repeat(repetitions);
    repetitionSquaresElement.innerText = displayProgress(intention, requiredRepetitions, intentionsRepetitionsPerDate);

    const successTextElement = document.createElement('p');
    successTextElement.innerText = 'Achievement Status';

    const streakElement = document.createElement('p');
    let streaksValue = streaks?.[date]?.[intention] ?? streaks?.[yesterdaysDate]?.[intention] ?? 0;
    streakElement.innerText = "Streak: " + streaksValue;

    /*
    const successButton = document.createElement('button');
    successButton.innerText = '✔️';
    successButton.addEventListener('click', () => {
        //achievementStatus[date][intention] = true
        achievementStatuses = updateAchievementStatuses(uuid, achievementStatuses, date, intention, true);
        streaks = updateStreaks(uuid, streaks, date, intention, achievementStatuses);
        let streaksValue = streaks?.[date]?.[intention] ?? streaks?.[yesterdaysDate]?.[intention] ?? 0;
        streakElement.innerText = "Streak: " + streaksValue;
        if (intentionBox.style.backgroundColor === 'rgb(129, 199, 132)') {
            intentionBox.style.backgroundColor = 'lightblue';
            // change achievementStatus to default state - false
            achievementStatuses = updateAchievementStatuses(uuid, achievementStatuses, date, intention, false);
            streaks = undoStreakUpdate(uuid, streaks, date, intention);
            let streaksValue = streaks?.[date]?.[intention] ?? streaks?.[yesterdaysDate]?.[intention] ?? 0;
            streakElement.innerText = "Streak: " + streaksValue;
        } else {
            intentionBox.style.backgroundColor = '#81C784';
        }
    });

    const failureButton = document.createElement('button');
    failureButton.innerText = '❌';
    failureButton.addEventListener('click', () => {
        achievementStatuses = updateAchievementStatuses(uuid, achievementStatuses, date, intention, false);
        streaks = updateStreaks(uuid, streaks, date, intention, achievementStatuses);
        let streaksValue = streaks?.[date]?.[intention] ?? streaks?.[yesterdaysDate]?.[intention] ?? 0;
        streakElement.innerText = "Streak: " + streaksValue;
        if (intentionBox.style.backgroundColor === 'rgb(229, 57, 53)') {
            // the default achievement status for the day is false so no doing anything here... what if the streak was like 3
            intentionBox.style.backgroundColor = 'lightblue';
            streaks = undoStreakUpdate(uuid, streaks, date, intention);
            let streaksValue = streaks?.[date]?.[intention] ?? streaks?.[yesterdaysDate]?.[intention] ?? 0;
            streakElement.innerText = "Streak: " + streaksValue;
        } else {
            intentionBox.style.backgroundColor = '#E53935 ';
        }
    });        

    const removeIntentionBoxElement = document.createElement('button');
    removeIntentionBoxElement.className = 'remove-intention-button';
    removeIntentionBoxElement.innerText = 'Remove Intention';
    removeIntentionBoxElement.style.display = 'none';
    removeIntentionBoxElement.addEventListener('click', () => {
        removeIntentionFromRequiredRepetitionsPerIntention(uuid, intention);
        removeIntentionFromIntentionsLog(uuid, intention);
        intentionBox.remove();
    });
    */

    if (initialize) {
        intentionBoxesContainer.appendChild(intentionBox);
    } else {
        /*
        const plusMinusBox = document.querySelector('#plus-minus-box');
        const parent = plusMinusBox.parentNode;
        parent.insertBefore(intentionBox, plusMinusBox);
        */
    }

    intentionBox.appendChild(intentionTextElement);
    intentionBox.appendChild(requiredRepetitionsTextElement);
    intentionBox.appendChild(repetitionSquaresElement);
    intentionBox.appendChild(successTextElement);
    //intentionBox.appendChild(successButton);
    //intentionBox.appendChild(failureButton);
    intentionBox.appendChild(streakElement);
    //intentionBox.appendChild(removeIntentionBoxElement);

}

export function makeIntentionsRepetitionsPerDateFromIntentionsLog(intentionsLog) {
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

function displayProgress(intention, requiredRepetitions, intentionsRepetitionsPerDate) {
    const requirementSymbol = '⬜';
    const repetitionSymbol = '✅';

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

function openPopUp() {
    document.getElementById('popup').style.display = 'block';
}

function closePopUp() {
    document.getElementById('popup').style.display = 'none';
}
