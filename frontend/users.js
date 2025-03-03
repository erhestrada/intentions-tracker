import { retrieveUsers } from "./retrieveUsers"
import { retrieveUsername } from "./storeAndRetrieveUsername";

async function getAndDisplayAllUsers() {
    const users = await retrieveUsers();

    const userObject = {};
    
    for (const userData of users) {
        const username = await retrieveUsername(userData.uuid);
        userObject[userData.uuid] = username; // Add the uuid as the key and username as the value
    }

    const parentElement = document.getElementById('users-container');

    users.forEach((userData) => {
        const userElement = document.createElement('a');
        userElement.className = 'clickable';
        userElement.style.display = 'block';
        userElement.style.marginBottom = "10px";
        userElement.href = `userProfile.html?uuid=${userData.uuid}`;
        userElement.innerText = userObject[userData.uuid];
        parentElement.appendChild(userElement);
    });
}

getAndDisplayAllUsers();