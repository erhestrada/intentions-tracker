export function displayProgressForIntention(containerId, intention, formattedAchievementStatuses) {
    console.log(formattedAchievementStatuses);
    const container = document.getElementById(containerId);

    container.innerHTML = '';  // or container.textContent = '';

    const achievementStatusPerDate = getAchievementStatusPerDateForIntention(intention, formattedAchievementStatuses)
    console.log(achievementStatusPerDate);

    for (const [date, achievementStatus] of Object.entries(achievementStatusPerDate)) {
        const element = document.createElement('p');
        element.innerText = `${date}: ${achievementStatus}`;
    
        container.appendChild(element);
    }
}

function getAchievementStatusPerDateForIntention(intention, formattedAchievementStatuses) {
    let intentionAchievementStatusPerDate = {};
    for (const [date, dateAchievementStatuses] of Object.entries(formattedAchievementStatuses)) {
        if (dateAchievementStatuses.hasOwnProperty(intention)) {
            intentionAchievementStatusPerDate[date] = dateAchievementStatuses[intention];
        }
    }
    return intentionAchievementStatusPerDate;
}