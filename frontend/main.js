import { typeIntentions, handleKeydown } from "./typeIntentions";
import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";

const userId = getOrCreateUniqueId();

// i should just be getting the column using sql
const intentions = (await retrieveRequiredRepetitionsPerIntention()).map(obj => obj.intention);
console.log('intentions', intentions);
document.addEventListener('keydown', (e) => handleKeydown(e, intentions));
typeIntentions(intentions);
