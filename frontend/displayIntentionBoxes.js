import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveAndFormatRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";
import { typeIntentions, handleKeydown } from "./typeIntentions";
import { retrieveAchievementStatuses } from "./retrieveAchievementStatuses";
import { retrieveAndFormatIntentionsLog } from "./retrieveIntentionsLog";
import { retrieveAndFormatStreaks } from "./retrieveStreaks";
import { storeAchievementStatus } from "./storeAchievementStatus";
import { storeStreak } from "./storeStreak";
import { retrieveAndFormatAchievementStatuses } from "./retrieveAchievementStatuses";
import { storeRequiredRepetitionsForIntention } from "./storeRequiredRepetitionsForIntention";
import { removeIntentionFromRequiredRepetitionsPerIntention } from "./removeIntentionFromRequiredRepetitionsPerIntention";
import { removeIntentionFromIntentionsLog } from "./removeIntentionFromIntentionsLog";
import { calculateRequiredRepetitionsRemainingPerIntention } from "./typeIntentions";

async function displayIntentionBoxes(uuid, requiredRepetitionsPerIntention, intentionsRepetitionsPerDate) {
    for (const [intention, requiredRepetitions] of Object.entries(requiredRepetitionsPerIntention)) {
        displayIntentionBox(intention, requiredRepetitions, achievementStatuses, formattedAchievementStatuses, date, streaks, yesterdaysDate, intentionBoxesContainer, true);
    }

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
        console.log(minusButtonElement.clicked);

        const removeIntentionButtons = document.querySelectorAll('.remove-intention-button');

        removeIntentionButtons.forEach(button => {
            button.style.display = minusButtonElement.clicked ? 'block' : 'none';
        });
    });


    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', closePopUp);

    intentionBoxesContainer.appendChild(plusMinusBox);
    plusMinusBox.appendChild(plusMinusBoxLabel);
    plusMinusBox.appendChild(plusButtonElement);
    plusMinusBox.appendChild(minusButtonElement);
}

function displayIntentionBox(intention, requiredRepetitions, achievementStatuses, formattedAchievementStatuses, date, streaks, yesterdaysDate, intentionBoxesContainer, initialize) {
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

    const successButton = document.createElement('button');
    successButton.innerText = '✔️';

    const streakElement = document.createElement('p');
    let streaksValue = streaks?.[date]?.[intention] ?? streaks?.[yesterdaysDate]?.[intention] ?? 0;
    streakElement.innerText = "Streak: " + streaksValue;

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

    if (initialize) {
        intentionBoxesContainer.appendChild(intentionBox);
    } else {
        const plusMinusBox = document.querySelector('#plus-minus-box');
        const parent = plusMinusBox.parentNode;
        parent.insertBefore(intentionBox, plusMinusBox);
    }

    intentionBox.appendChild(intentionTextElement);
    intentionBox.appendChild(requiredRepetitionsTextElement);
    intentionBox.appendChild(repetitionSquaresElement);
    intentionBox.appendChild(successTextElement);
    intentionBox.appendChild(successButton);
    intentionBox.appendChild(failureButton);
    intentionBox.appendChild(streakElement);
    intentionBox.appendChild(removeIntentionBoxElement);

}




function updateAchievementStatuses(uuid, achievementStatuses, date, intention, achievementStatus) {
    // Ensure the date is part of the object, creating it if necessary
    if (!achievementStatuses[date]) {
        achievementStatuses[date] = {};
    }
    achievementStatuses[date][intention] = achievementStatus;
    storeAchievementStatus(uuid, date, intention, achievementStatus);
    
    //localStorage.setItem('achievementStatuses', JSON.stringify(achievementStatuses));
    return achievementStatuses
}

function updateStreaks(uuid, streaks, date, intention, achievementStatuses) {
    const yesterdaysDate = getYesterdaysDate(date);
    const achievementStatus = achievementStatuses[date][intention];

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

    //let streakValue = streaks?.[date]?.[intention] ?? streaks?.[yesterdaysDate]?.[intention] ?? 0;
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

function undoStreakUpdate(uuid, streaks, date, intention) {
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

function openPopUp() {
    document.getElementById('popup').style.display = 'block';
}

function closePopUp() {
    document.getElementById('popup').style.display = 'none';
}
