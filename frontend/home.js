import { retrieveRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";

function displayIntentionBoxes(required_repetitions_per_intention) {

}

const requiredRepetitionsPerIntention = await retrieveRequiredRepetitionsPerIntention();
displayIntentionBoxes(requiredRepetitionsPerIntention);