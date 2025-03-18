function setupCreateGroupButton() {
    const createGroupButton = document.getElementById('create-group-button');
    createGroupButton.addEventListener('click', openPopUp);
    
    const form = document.getElementById('createGroupForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const intention = document.getElementById('add-intention-input').value.trim();
        const requiredRepetitions = Number(document.getElementById('required-repetitions-input').value);
        requiredRepetitionsPerIntention[intention] = requiredRepetitions;
    
        document.getElementById('add-intention-input').value = ''; // clear input when intention added
        document.getElementById('required-repetitions-input').value = ''; // clear input when intention added
    
    });
}

function openPopUp() {
    document.getElementById('popup').style.display = 'block';
}
