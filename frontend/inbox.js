import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveUsernames } from "./storeAndRetrieveUsername";
import { retrieveAcceptanceStatuses } from "./retrieveAcceptanceStatuses";

async function retrieveAndDisplayBondRequestsForUser(uuid) {
    const bondRequests = await retrieveBondRequestsForUser(uuid);

    const bondRequestsContainer = document.getElementById('inbox-container');

    const usernamePerId = await retrieveUsernames();
    console.log('usernamePerId', usernamePerId);

    for (const bondRequest of bondRequests) {
        const {receiver_id: receiverId, sender_id: senderId, bonded_intentions: bondedIntentionsJson, acceptance_status: acceptanceStatus} = bondRequest;

        const receiverUsername = usernamePerId[receiverId];
        const senderUsername = usernamePerId[senderId];

        const bondedIntentionsByUsernameJson = await convertIdIndexedJsonToUsernameIndexedJson(bondedIntentionsJson, usernamePerId);
        const acceptanceStatusPerReceiverId = await getAcceptanceStatusPerReceiverId(bondedIntentionsJson);
        console.log(acceptanceStatusPerReceiverId);

        const bondRequestContainer = document.createElement('p');
        bondRequestContainer.innerText = `receiver: ${receiverUsername} | sender: ${senderUsername} | bond: ${bondedIntentionsByUsernameJson}`;

        const bondedIntentions = JSON.parse(bondedIntentionsJson);

        for (const [userId, userIntentions] of Object.entries(bondedIntentions)) {
            const username = usernamePerId[userId];
            const acceptanceStatus = acceptanceStatusPerReceiverId[userId];
            bondRequestContainer.innerText += ` | ${username}: ${acceptanceStatus}`
        }

        bondRequestsContainer.appendChild(bondRequestContainer);
    }
}

async function convertIdIndexedJsonToUsernameIndexedJson(bondedIntentionsJson, usernamePerId) {
    const bondedIntentions = JSON.parse(bondedIntentionsJson);
    const bondedIntentionsByUsername = {};

    for (const [userId, userIntentions] of Object.entries(bondedIntentions)) {
        const username = usernamePerId[userId];
        bondedIntentionsByUsername[username] = userIntentions;
    }

    const bondedIntentionsByUsernameJson = JSON.stringify(bondedIntentionsByUsername);
    
    return bondedIntentionsByUsernameJson;
}

async function getAcceptanceStatusPerReceiverId(bondedIntentionsJson) {
    const bondedIntentionRows = await retrieveAcceptanceStatuses(bondedIntentionsJson);

    const acceptanceStatusPerReceiverId = bondedIntentionRows.reduce((accumulator, row) => {
        const receiverId = row.receiver_id;
        const acceptanceStatus = row.acceptance_status;
        accumulator[receiverId] = acceptanceStatus;

        return accumulator
    }, {});

    return acceptanceStatusPerReceiverId;
}

async function retrieveBondRequestsForUser(uuid) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/retrieveBondRequestsForUser?uuid=${encodeURIComponent(uuid)}`);
        const data = await response.json();
        return data
    } catch(error) {
        console.error('Error retrieving data:', error);
    }
}

const uuid = getOrCreateUniqueId();
retrieveAndDisplayBondRequestsForUser(uuid);