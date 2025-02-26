import { retrieveUsers } from "./retrieveUsers";
import { retrieveAndFormatRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";
import { retrieveAchievementStatuses } from "./retrieveAchievementStatuses";
import { retrieveAndFormatIntentionsLog } from "./retrieveIntentionsLog";
import { retrieveAndFormatStreaks } from "./retrieveStreaks";
import { retrieveAndFormatAchievementStatuses } from "./retrieveAchievementStatuses";
import { sendBondRequest } from "./sendBondRequest";

export async function displayInformationForUsers() {
    const users = (await retrieveUsers()).map(obj => obj.uuid);
    users.forEach(uuid => displayInformationForUser(uuid));
}

export async function displayInformationForUser(uuid) {
    console.log(uuid);
    const requiredRepetitionsPerIntention = await retrieveAndFormatRequiredRepetitionsPerIntention(uuid);
    const intentionsLog = await retrieveAndFormatIntentionsLog(uuid);
    const intentionsRepetitionsPerDate = makeIntentionsRepetitionsPerDateFromIntentionsLog(intentionsLog);
    displayIntentionBoxes(uuid, requiredRepetitionsPerIntention, intentionsRepetitionsPerDate);
}

async function displayIntentionBoxes(uuid, requiredRepetitionsPerIntention, intentionsRepetitionsPerDate) {
    let achievementStatuses = await retrieveAchievementStatuses(uuid);
    let formattedAchievementStatuses = await retrieveAndFormatAchievementStatuses(uuid);
    console.log('formatted as', formattedAchievementStatuses);

    let streaks = await retrieveAndFormatStreaks(uuid);

    const masterContainer = document.querySelector('.container');

    const intentionBoxesContainer = document.createElement('div');
    intentionBoxesContainer.id = 'intention-boxes-container-' + uuid;
    intentionBoxesContainer.className = 'intention-boxes-container';
    
    masterContainer.appendChild(intentionBoxesContainer);

    /*
    const userElement = document.createElement('p');
    userElement.innerText = uuid;
    document.body.appendChild(userElement);
    intentionBoxesContainer.appendChild(userElement);
    */

    const date = (new Date()).toLocaleDateString();
    const yesterdaysDate = getYesterdaysDate(date);

    for (const [intention, repetitions] of Object.entries(requiredRepetitionsPerIntention)) {
        const intentionBox = document.createElement('div');
        intentionBox.className = 'intention-box';
        intentionBox.id = intention;
        intentionBox.uuid = uuid;

        const intentionTextElement = document.createElement('p');
        intentionTextElement.innerText = intention;
        
        const requiredRepetitionsTextElement = document.createElement('p');
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

        const achievementStatusElement = document.createElement('p');
        const achievementStatus = formattedAchievementStatuses?.[date]?.[intention] ?? 0;
        
        if (achievementStatus === 1) {
            intentionBox.style.backgroundColor = 'rgb(129, 199, 132)';
            achievementStatusElement.innerText = '✔️';
        } else {
            achievementStatusElement.innerText = '❌';
        }
        
        const streakElement = document.createElement('p');
        let streaksValue = streaks?.[date]?.[intention] ?? streaks?.[yesterdaysDate]?.[intention] ?? 0;
        streakElement.innerText = "Streak: " + streaksValue;

        intentionBoxesContainer.appendChild(intentionBox);
        intentionBox.appendChild(intentionTextElement);
        intentionBox.appendChild(requiredRepetitionsTextElement);
        intentionBox.appendChild(repetitionSquaresElement);
        intentionBox.appendChild(successTextElement);
        intentionBox.appendChild(achievementStatusElement);
        intentionBox.appendChild(streakElement);
    }

    const line = document.createElement('hr');
    masterContainer.appendChild(line);

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

let bondedIntentions = [];

function setupBondRequestButton() {
    const bondRequestButton = document.getElementById('bond-request-button');
    bondRequestButton.clicked = false;
    bondRequestButton.addEventListener('click', () => {
        bondRequestButton.clicked = !bondRequestButton.clicked;
    
        const intentionBoxes = document.querySelectorAll('.intention-box');
    
        if (bondRequestButton.clicked) {
            // reset bondedIntentions
            bondedIntentions = [];
            bondRequestButton.innerText = 'Send Bond Request';
            intentionBoxes.forEach(intentionBox => {
                intentionBox.style.opacity = '0.5';
                intentionBox.classList.add('clickable');
                intentionBox.clicked = false;
                intentionBox.addEventListener('click', handleIntentionBoxClick);
            });
        } else {
            sendBondRequest(uuid, bondedIntentions);
            alert(bondedIntentions);
            //alert('bond request sent', bondedIntentions);
            bondRequestButton.innerText = 'Bond Request';
            intentionBoxes.forEach(intentionBox => {
                intentionBox.style.opacity = '1';
                intentionBox.classList.remove('clickable');
                intentionBox.removeEventListener('click', handleIntentionBoxClick)
            });
        }
    });
}

function handleIntentionBoxClick(event) {
    event.currentTarget.clicked = !event.currentTarget.clicked;
    const intention = event.currentTarget.querySelector('p').innerText;
    console.log(event.currentTarget.uuid);

    if (event.currentTarget.clicked) {
        event.currentTarget.style.opacity = '1';
        bondedIntentions.push(intention);
        console.log(bondedIntentions);
    } else {
        event.currentTarget.style.opacity = '0.5';
        bondedIntentions = bondedIntentions.filter(element => element != intention);
    }
}

setupBondRequestButton();
displayInformationForUsers();
