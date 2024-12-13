import { retrieveUsers } from "./retrieveUsers";

export async function displayInformationForUsers() {
    const users = (await retrieveUsers()).map(obj => obj.uuid);
    users.forEach(uuid => displayInformationForUser(uuid));
}

export async function displayInformationForUser(uuid) {
    console.log(uuid);
}

displayInformationForUsers();
