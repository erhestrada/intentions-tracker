import { storeGroup } from "./storeAndRetrieveGroups";

export function setupCreateGroupButton(uuid) {
    const createGroupButton = document.getElementById('create-group-button');
    createGroupButton.addEventListener('click', () => openPopUp('create-group-popup'));
    
    const closeButton = document.getElementById('create-group-close-button');
    closeButton.addEventListener('click', () => closePopUp('create-group-popup'));
    
    const form = document.getElementById('createGroupForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const groupName = document.getElementById('group-name-input').value.trim();
        const groupDescription = document.getElementById('group-description-input').value.trim();
    
        document.getElementById('group-name-input').value = ''; // clear input when intention added
        document.getElementById('group-description-input').value = ''; // clear input when intention added

        console.log(uuid, groupName, groupDescription);

        //storeGroup(uuid, groupName, groupDescription);
    
    });
}

function openPopUp(popupId) {
    document.getElementById(popupId).style.display = 'block';
}

function closePopUp(popupId) {
    document.getElementById(popupId).style.display = 'none';
}
