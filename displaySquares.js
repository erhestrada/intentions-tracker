export function displaySquares(data) {
    // Create a container for the squares
    const container = document.createElement('div');

    for (const [key, value] of Object.entries(data)) {
        // Create a div for each key-value pair
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('intention'); // Add class for targeting in deletion        
        // Create a label for the key and add squares for the value
        itemDiv.textContent = `${key}: ${'■'.repeat(value)}`; // Repeat the square based on value

        // Append the item div to the container
        container.appendChild(itemDiv);
    }

    // Append the container to the document body or a specific container
    document.body.appendChild(container);
}