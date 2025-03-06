import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveUsernames } from "./storeAndRetrieveUsername";
import { retrieveAcceptanceStatuses } from "./retrieveAcceptanceStatuses";
import { updateBondRequest } from "./sendBondRequest";
import { storeBondedIntentions } from "./storeAndRetrieveBondedIntentions";

// if acceptanceStatusPerReceiverId.values() all accepted
// store bondedIntention


async function retrieveAndDisplayBondRequestsForUser(uuid) {
    const bondRequests = await retrieveBondRequestsForUser(uuid);

    const bondRequestsContainer = document.getElementById('inbox-container');

    const usernamePerId = await retrieveUsernames();

    for (const bondRequest of bondRequests) {
        const {receiver_id: receiverId, sender_id: senderId, bonded_intentions: bondedIntentionsJson, acceptance_status: acceptanceStatus} = bondRequest;

        const senderUsername = usernamePerId[senderId];

        const bondedIntentionsByUsernameJson = await convertIdIndexedJsonToUsernameIndexedJson(bondedIntentionsJson, usernamePerId);
        let acceptanceStatusPerReceiverId = await getAcceptanceStatusPerReceiverId(bondedIntentionsJson);

        let bondRequestElement = document.createElement('p');
        bondRequestElement.innerText = `sender: ${senderUsername} | bond: ${bondedIntentionsByUsernameJson}`;

        const bondedIntentions = JSON.parse(bondedIntentionsJson);

        Object.keys(bondedIntentions).forEach(userId => {
            const username = usernamePerId[userId];
            const acceptanceStatus = acceptanceStatusPerReceiverId[userId];
            bondRequestElement.innerText += ` | ${username}: ${acceptanceStatus}`
        });

        if (acceptanceStatus === 'pending') {
            const acceptButton = document.createElement('button');
            acceptButton.innerText = 'accept';
            acceptButton.style.marginLeft = '10px';
            console.log(acceptanceStatusPerReceiverId);
            setupStatusButton(acceptButton, bondRequestElement, receiverId, bondedIntentionsJson, 'accepted', acceptanceStatusPerReceiverId);

            const declineButton = document.createElement('button');
            declineButton.innerText = 'decline';
            setupStatusButton(declineButton, bondRequestElement, receiverId, bondedIntentionsJson, 'declined', acceptanceStatusPerReceiverId);
            
            bondRequestElement.appendChild(acceptButton);
            bondRequestElement.appendChild(declineButton);
        }

        bondRequestsContainer.appendChild(bondRequestElement);
    }
}

function setupStatusButton(button, bondRequestElement, receiverId, bondedIntentionsJson, updatedStatus, acceptanceStatusPerReceiverId) {
    button.addEventListener('click', () => {
        bondRequestElement.innerHTML = bondRequestElement.innerHTML.replace('pending', updatedStatus);
        const buttons = bondRequestElement.querySelectorAll('button');
        buttons.forEach(button => button.remove());     
        updateBondRequest(receiverId, bondedIntentionsJson, updatedStatus);

        if (updatedStatus === 'accepted') {
            acceptanceStatusPerReceiverId[receiverId] = 'accepted';

            const allAccepted = Object.values(acceptanceStatusPerReceiverId).every(value => value === 'accepted');
            if (allAccepted) {
                storeBondedIntentions(receiverId, bondedIntentionsJson);
            }

        } else {
            acceptanceStatusPerReceiverId[receiverId] = 'declined';
        }
    });
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