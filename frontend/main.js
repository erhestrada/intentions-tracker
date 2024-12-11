import { typeIntentions, handleKeydown } from "./typeIntentions";
import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";

const uuid = getOrCreateUniqueId();
const intentions = (await retrieveRequiredRepetitionsPerIntention(uuid)).map(obj => obj.intention);
console.log('intentions', intentions);
document.addEventListener('keydown', (e) => handleKeydown(e, intentions));
typeIntentions(intentions);
