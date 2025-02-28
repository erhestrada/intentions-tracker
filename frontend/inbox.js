import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";

function retrieveAndDisplayBondRequestsForUser(uuid) {
    const bondRequests = retrieveBondRequestsForUser(uuid);

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