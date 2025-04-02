export function displayProgressForIntention(containerId, intention, formattedAchievementStatuses) {
    console.log(formattedAchievementStatuses);
    const container = document.getElementById(containerId);

    container.innerHTML = '';  // or container.textContent = '';

    const element = document.createElement('p');
    element.innerText = intention;

    container.appendChild(element);
}