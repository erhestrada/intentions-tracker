import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";

async function retrieveAndDisplayBondRequestsForUser(uuid) {
    const bondRequests = await retrieveBondRequestsForUser(uuid);
    console.log(bondRequests);

    const container = document.getElementById('inbox-container');
    
    bondRequests.forEach((element) => {
        console.log(element);

        const {receiver_id: receiverId, sender_id: senderId, bonded_intentions: bondedIntentionsJson, acceptance_status: acceptanceStatus} = element;
        console.log(receiverId);


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