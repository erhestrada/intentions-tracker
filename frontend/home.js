import { retrieveRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";
import { typeIntentions, handleKeydown } from "./typeIntentions";

function displayIntentionBoxes(requiredRepetitionsPerIntention, intentionsLog) {
    console.log('intentions log', intentionsLog);
    const intentionBoxesContainer = document.getElementById('intention-boxes-container');
    for (const {id, intention, repetitions} of requiredRepetitionsPerIntention) {
        const intentionBox = document.createElement('div');
        intentionBox.className = 'intention-box';
        intentionBox.id = intention;

        const intentionTextElement = document.createElement('p');
        intentionTextElement.innerText = intention;
        
        const requiredRepetitionsTextElement = document.createElement('p');
        requiredRepetitionsTextElement.innerText = repetitions + ' repetitions';

        const repetitionSquaresElement = document.createElement('p');
        repetitionSquaresElement.innerText = '⬜'.repeat(repetitions);

        const successTextElement = document.createElement('p');
        successTextElement.innerText = 'Achievement Status';

        const successButton = document.createElement('button');
        successButton.innerText = '✔️';
        successButton.addEventListener('click', () => {
            if (intentionBox.style.backgroundColor === 'rgb(129, 199, 132)') {
                intentionBox.style.backgroundColor = 'lightblue';
            } else {
                intentionBox.style.backgroundColor = '#81C784';
            }
        });

        const failureButton = document.createElement('button');
        failureButton.innerText = '❌';
        failureButton.addEventListener('click', () => {
            if (intentionBox.style.backgroundColor === 'rgb(229, 57, 53)') {
                intentionBox.style.backgroundColor = 'lightblue';
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

        console.log(intention, repetitions);
    }
}

function displayProgress(intention, intentionsRepetitionsOnDate, requiredRepetitions) {
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

const intentions = Object.keys(JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {});
console.log(intentions);
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
console.log('thing to check', intentionsRepetitionsPerDate);
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
console.log(requiredRepetitionsPerIntention);
displayIntentionBoxes(requiredRepetitionsPerIntention, intentionsLog);
