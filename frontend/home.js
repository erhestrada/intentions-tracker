import { retrieveRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";

function displayIntentionBoxes(requiredRepetitionsPerIntention) {
    const intentionBoxesContainer = document.getElementById('intention-boxes-container');
    for (const {id, intention, repetitions} of requiredRepetitionsPerIntention) {
        const intentionBox = document.createElement('div');
        intentionBox.className = 'intention-box';
        intentionBox.id = intention;

        const intentionTextElement = document.createElement('p');
        intentionTextElement.innerText = intention;
        const requiredRepetitionsTextElement = document.createElement('p');
        requiredRepetitionsTextElement.innerText = 'repetitions: ' + repetitions;
        
        intentionBoxesContainer.appendChild(intentionBox);
        intentionBox.appendChild(intentionTextElement);
        intentionBox.appendChild(requiredRepetitionsTextElement);

        console.log(intention, repetitions);
    }
}

const requiredRepetitionsPerIntention = await retrieveRequiredRepetitionsPerIntention();
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}, {id: 1, intention: 'x', repetitions: 1}]
console.log(requiredRepetitionsPerIntention);
displayIntentionBoxes(requiredRepetitionsPerIntention);