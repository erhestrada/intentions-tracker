import { retrieveRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";

function displayIntentionBoxes(requiredRepetitionsPerIntention) {
    const intentionBoxesContainer = document.getElementById('intention-boxes-container');
    for (const {id, intention, repetitions} of requiredRepetitionsPerIntention) {
        const intentionBox = document.createElement('div');
        intentionBox.className = 'intention-box';
        intentionBox.id = intention;
        intentionBox.innerText = intention;
        intentionBox.style.border = '1px solid black';
        intentionBoxesContainer.appendChild(intentionBox);

        console.log(intention, repetitions);
    }
}

const requiredRepetitionsPerIntention = await retrieveRequiredRepetitionsPerIntention();
//const requiredRepetitionsPerIntention = [{id: 1, intention: 'x', repetitions: 1}]
console.log(requiredRepetitionsPerIntention);
displayIntentionBoxes(requiredRepetitionsPerIntention);