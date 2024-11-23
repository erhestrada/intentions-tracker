import { retrieveRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";
import { typeIntentions, handleKeydown } from "./typeIntentions";

function displayIntentionBoxes(requiredRepetitionsPerIntention) {
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


function runTypeIntentions(intentions) {
    console.log(intentions);
    typeIntentions(intentions);
}

const intentions = Object.keys(JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {});
document.addEventListener('keydown', (e) => handleKeydown(e, intentions));
document.getElementById('express-intentions-button').addEventListener('click', () => runTypeIntentions(intentions));

const requiredRepetitionsPerIntention = await retrieveRequiredRepetitionsPerIntention();
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
console.log(requiredRepetitionsPerIntention);
displayIntentionBoxes(requiredRepetitionsPerIntention);
