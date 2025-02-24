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
import { getYesterdaysDate } from "./home";

const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get('uuid');

let achievementStatuses = await retrieveAchievementStatuses(uuid);
let formattedAchievementStatuses = await retrieveAndFormatAchievementStatuses(uuid);

let streaks = await retrieveAndFormatStreaks(uuid);

const intentionBoxesContainer = document.getElementById('intention-boxes-container');

const date = (new Date()).toLocaleDateString();
const yesterdaysDate = getYesterdaysDate(date);

const requiredRepetitionsPerIntention = await retrieveAndFormatRequiredRepetitionsPerIntention(uuid);
console.log('rrpi', requiredRepetitionsPerIntention);
//const intentionsLog = JSON.parse(localStorage.getItem('intentionsLog')) || {};
let intentionsLog = await retrieveAndFormatIntentionsLog(uuid);
//console.log('il2', intentionsLog2);
let intentionsRepetitionsPerDate = makeIntentionsRepetitionsPerDateFromIntentionsLog(intentionsLog);
console.log('il', intentionsLog);

displayIntentionBoxes(uuid, requiredRepetitionsPerIntention, intentionsRepetitionsPerDate);
