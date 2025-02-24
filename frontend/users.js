import { retrieveUsers } from "./retrieveUsers"

async function getAndDisplayAllUsers() {
    const users = await retrieveUsers();

    const parentElement = document.getElementById('users-container');

    users.forEach((userData) => {
        const userElement = document.createElement('a');
        userElement.className = 'clickable';
        userElement.style.display = 'block';
        userElement.style.marginBottom = "10px";
        userElement.href = `userProfile.html?uuid=${userData.uuid}`;
        userElement.innerText = userData.uuid;
        parentElement.appendChild(userElement);
    });
}

getAndDisplayAllUsers();