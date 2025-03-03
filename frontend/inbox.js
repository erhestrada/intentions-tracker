import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveUsername } from "./storeAndRetrieveUsername";

async function retrieveAndDisplayBondRequestsForUser(uuid) {
    const bondRequests = await retrieveBondRequestsForUser(uuid);

    const bondRequestsContainer = document.getElementById('inbox-container');

    for (const bondRequest of bondRequests) {
        const {receiver_id: receiverId, sender_id: senderId, bonded_intentions: bondedIntentionsJson, acceptance_status: acceptanceStatus} = bondRequest;

        const receiverUsername = await retrieveUsername(receiverId);
        const senderUsername = await retrieveUsername(senderId);

        const bondedIntentions = JSON.parse(bondedIntentionsJson);
        
        
        const bondedIntentionsByUsername = {};

        for (const [userId, userIntentions] of Object.entries(bondedIntentions)) {
            const username = await retrieveUsername(userId);
            bondedIntentionsByUsername[username] = userIntentions;
        }

        const bondedIntentionsByUsernameJson = JSON.stringify(bondedIntentionsByUsername);

        const bondRequestContainer = document.createElement('p');
        bondRequestContainer.innerText = `receiver: ${receiverUsername} | sender: ${senderUsername} | bond: ${bondedIntentionsByUsernameJson} | acceptance status: ${acceptanceStatus}`;

        bondRequestsContainer.appendChild(bondRequestContainer);
    }
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