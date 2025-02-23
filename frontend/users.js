import { retrieveUsers } from "./retrieveUsers"

async function getAndDisplayAllUsers() {
    const users = await retrieveUsers();
    console.log(users);

    const parentElement = document.getElementById('users-container');

    users.forEach((userData) => {
        const userElement = document.createElement('p');
        userElement.innerText = userData.uuid;

        parentElement.appendChild(userElement);
    });
}

getAndDisplayAllUsers();