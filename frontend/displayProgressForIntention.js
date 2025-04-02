export function displayProgressForIntention(containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = '';  // or container.textContent = '';

    const element = document.createElement('p');
    element.innerText = 'placeholder';

    container.appendChild(element);
}