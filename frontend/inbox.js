import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";

async function retrieveAndDisplayBondRequestsForUser(uuid) {
    const bondRequests = await retrieveBondRequestsForUser(uuid);

    const bondRequestsContainer = document.getElementById('inbox-container');
    
    bondRequests.forEach((bondRequest) => {
        const {receiver_id: receiverId, sender_id: senderId, bonded_intentions: bondedIntentionsJson, acceptance_status: acceptanceStatus} = bondRequest;

        const bondRequestContainer = document.createElement('p');
        bondRequestContainer.innerText = `receiver: ${receiverId} | sender: ${senderId} | bond: ${bondedIntentionsJson} | acceptance status: ${acceptanceStatus}`;

        bondRequestsContainer.appendChild(bondRequestContainer);

    })

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