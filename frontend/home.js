import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveAndFormatRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";
import { typeIntentions, handleKeydown } from "./typeIntentions";
import { retrieveAchievementStatuses } from "./retrieveAchievementStatuses";
import { retrieveAndFormatIntentionsLog } from "./retrieveIntentionsLog";
import { retrieveAndFormatStreaks } from "./retrieveStreaks";
import { storeAchievementStatus } from "./storeAchievementStatus";
import { retrieveAndFormatAchievementStatuses } from "./retrieveAchievementStatuses";
import { storeRequiredRepetitionsForIntention } from "./storeRequiredRepetitionsForIntention";
import { removeIntentionFromRequiredRepetitionsPerIntention } from "./removeIntentionFromRequiredRepetitionsPerIntention";
import { removeIntentionFromIntentionsLog } from "./removeIntentionFromIntentionsLog";
import { calculateRequiredRepetitionsRemainingPerIntention } from "./typeIntentions";
import { setupLogInButton } from "./setupLogInButton";
import { setupCreateGroupButton } from "./setupCreateGroupButton.js";
import { updateStreaks, undoStreakUpdate, getYesterdaysDate} from "./updateStreaks.js"
import { resetBrokenStreaks } from "./updateStreaks.js";
import { batchRetrieveBondedIntentions } from "./storeAndRetrieveBondedIntentions.js";
import { displayProgressForIntention } from "./displayProgressForIntention.js";

// i don't think retrieveAchievementStatus should ever be used (just a list of rows) - it should be formattedAchievementStatuses (?)

async function displayIntentionBoxes(uuid, requiredRepetitionsPerIntention, intentionsRepetitionsPerDate, bondsPerIntention) {
    for (const [intention, requiredRepetitions] of Object.entries(requiredRepetitionsPerIntention)) {
        const bondedIntentions = bondsPerIntention[intention];
        displayIntentionBox(intention, bondedIntentions, requiredRepetitions, achievementStatuses, formattedAchievementStatuses, intentionsRepetitionsPerDate, date, streaks, yesterdaysDate, intentionBoxesContainer, true);
    }

    const plusMinusBox = document.createElement('div');
    plusMinusBox.className = 'intention-box';
    plusMinusBox.id = 'plus-minus-box';

    const plusMinusBoxLabel = document.createElement('p');
    plusMinusBoxLabel.innerText = 'Add / Remove Intentions';

    const plusButtonElement = document.createElement('button');
    plusButtonElement.innerText = '+';
    plusButtonElement.addEventListener('click', () => openPopUp('popup'));

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

    const closeButton = document.getElementById('add-intention-close-button');
    closeButton.addEventListener('click', () => closePopUp('popup'));

    intentionBoxesContainer.appendChild(plusMinusBox);
    plusMinusBox.appendChild(plusMinusBoxLabel);
    plusMinusBox.appendChild(plusButtonElement);
    plusMinusBox.appendChild(minusButtonElement);
}

function displayIntentionBox(intention, bondedIntentions, requiredRepetitions, achievementStatuses, formattedAchievementStatuses, intentionsRepetitionsPerDate, date, streaks, yesterdaysDate, intentionBoxesContainer, initialize) {
    if (Object.keys(bondedIntentions).length > 0) {
        console.log(uuid, intention, bondedIntentions);
    }

    const intentionBox = document.createElement('div');
    intentionBox.className = 'intention-box';
    intentionBox.id = intention;

    const achievementStatus = formattedAchievementStatuses?.[date]?.[intention] ?? 0;

    if (achievementStatus === 1) {
        intentionBox.style.backgroundColor = 'rgb(129, 199, 132)';
    } else {
        //intentionBox.style.backgroundColor = 'rgb(229, 57, 53)';
        //intentionBox.style.backgroundColor = 'lightblue';
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

    successButton.addEventListener('click', async () => {
        //achievementStatus[date][intention] = true
        achievementStatuses = updateAchievementStatuses(uuid, achievementStatuses, date, intention, true);
        streaks = await updateStreaks(uuid, streaks, date, intention, achievementStatuses, bondedIntentions);
        console.log('STREAKS', streaks);
        let streaksValue = streaks?.[date]?.[intention] ?? streaks?.[yesterdaysDate]?.[intention] ?? 0;
        console.log('DATE', date);
        console.log('INTENTION', intention);
        console.log('STREAKS VALUE', streaksValue);
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
        streaks = updateStreaks(uuid, streaks, date, intention, achievementStatuses, bondedIntentions);
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
    
    // really want to just unhide progressPopup for intention
    const displayProgressButton = document.createElement('button');
    displayProgressButton.innerText = '📈';
    displayProgressButton.addEventListener('click', () => {
        openPopUp('progress-popup');
        displayProgressForIntention('progress-container', intention, formattedAchievementStatuses);
    });

    const progressCloseButton = document.getElementById('progress-close-button');
    progressCloseButton.addEventListener('click', () => closePopUp('progress-popup'));

    const removeIntentionBoxElement = document.createElement('button');
    removeIntentionBoxElement.className = 'remove-intention-button';
    removeIntentionBoxElement.innerText = 'Remove Intention';
    removeIntentionBoxElement.style.display = 'none';
    removeIntentionBoxElement.addEventListener('click', () => {
        removeIntentionFromRequiredRepetitionsPerIntention(uuid, intention);
        removeIntentionFromIntentionsLog(uuid, intention);
        intentionBox.remove();

        delete requiredRepetitionsPerIntention[intention];
        // delete intentinos log entries here too? might not be necessary
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
    intentionBox.appendChild(displayProgressButton);
    intentionBox.appendChild(removeIntentionBoxElement);

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

function openPopUp(popupId) {
    document.getElementById(popupId).style.display = 'block';
}

function closePopUp(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

let intentionsWithRepetitionsRemaining;
document.addEventListener('keydown', async (e) => {
    if (e.key === ' ' && (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault();  // Prevent the default spacebar action (scrolling)
    }
    if (expressIntentionsButton.clicked) {
        console.log('call handleKeyDown');
        console.log('intentionsWithRepetitionsRemaining', intentionsWithRepetitionsRemaining);
        handleKeydown(e, uuid, intentionsWithRepetitionsRemaining)
    }
});

const expressIntentionsButton = document.getElementById('express-intentions-button');
expressIntentionsButton.addEventListener('click',  async function() {
    expressIntentionsButton.clicked = !expressIntentionsButton.clicked;
    console.log(expressIntentionsButton.clicked);

    let intentionsLog = await retrieveAndFormatIntentionsLog(uuid);
    let intentionsRepetitionsPerDate = makeIntentionsRepetitionsPerDateFromIntentionsLog(intentionsLog);
    const requiredRepetitionsRemainingPerIntention = calculateRequiredRepetitionsRemainingPerIntention(requiredRepetitionsPerIntention, intentionsRepetitionsPerDate)
    intentionsWithRepetitionsRemaining = Object.keys(requiredRepetitionsRemainingPerIntention).filter(intention => requiredRepetitionsRemainingPerIntention[intention] > 0);
    
    if (expressIntentionsButton.clicked) {
        this.blur();
        let intentionsLog = await retrieveAndFormatIntentionsLog(uuid);
        console.log('intentions log', intentionsLog);
        let intentionsRepetitionsPerDate = makeIntentionsRepetitionsPerDateFromIntentionsLog(intentionsLog);
        console.log('call typeIntentions');
        typeIntentions(requiredRepetitionsPerIntention, intentionsRepetitionsPerDate);
        //expressIntentionsButton.clicked = !expressIntentionsButton.clicked;
    } else {
        const container = document.querySelector('.container');
        container.innerHTML = ''; // Clear previous content
    }
});

// addIntention when add intention button clicked in popup
const form = document.getElementById('myForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const intention = document.getElementById('add-intention-input').value.trim();
    const requiredRepetitions = Number(document.getElementById('required-repetitions-input').value);
    requiredRepetitionsPerIntention[intention] = requiredRepetitions;
    storeRequiredRepetitionsForIntention(uuid, intention, requiredRepetitions);

    document.getElementById('add-intention-input').value = ''; // clear input when intention added
    document.getElementById('required-repetitions-input').value = ''; // clear input when intention added

    const bondedIntentions = {};
    displayIntentionBox(intention, bondedIntentions, requiredRepetitions, achievementStatuses, formattedAchievementStatuses, intentionsRepetitionsPerDate, date, streaks, yesterdaysDate, intentionBoxesContainer, false);
});

const uuid = getOrCreateUniqueId();
//let achievementStatuses = JSON.parse(localStorage.getItem('achievementStatuses')) || {};
let achievementStatuses = await retrieveAchievementStatuses(uuid);
let formattedAchievementStatuses = await retrieveAndFormatAchievementStatuses(uuid);
console.log('1', achievementStatuses);
//console.log('2', achievementStatuses2);

const date = (new Date()).toLocaleDateString();
const yesterdaysDate = getYesterdaysDate(date);

const intentionBoxesContainer = document.getElementById('intention-boxes-container');

let requiredRepetitionsPerIntention = await retrieveAndFormatRequiredRepetitionsPerIntention(uuid);
console.log('rrpi', requiredRepetitionsPerIntention);
let intentionsLog = await retrieveAndFormatIntentionsLog(uuid);
let intentionsRepetitionsPerDate = makeIntentionsRepetitionsPerDateFromIntentionsLog(intentionsLog);
console.log('il', intentionsLog);

const bondsPerIntention = await batchRetrieveBondedIntentions(uuid, Object.keys(requiredRepetitionsPerIntention));
resetBrokenStreaks(uuid, date, Object.keys(requiredRepetitionsPerIntention), achievementStatuses, bondsPerIntention);
let streaks = await retrieveAndFormatStreaks(uuid);
//let streaks = JSON.parse(localStorage.getItem('streaks')) || {};
console.log('streaks initial', streaks);

setupLogInButton(uuid);
setupCreateGroupButton(uuid);
displayIntentionBoxes(uuid, requiredRepetitionsPerIntention, intentionsRepetitionsPerDate, bondsPerIntention);
