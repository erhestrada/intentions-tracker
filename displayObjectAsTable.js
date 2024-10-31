export function displayObjectAsTable(data, column1Title, column2Title) {
    // Create a table element
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    // Create table header
    const header = table.createTHead();
    const headerRow = header.insertRow();
    
    const headerCell1 = document.createElement('th');
    headerCell1.textContent = column1Title;
    headerCell1.style.border = '1px solid black';
    headerCell1.style.padding = '8px';
    headerRow.appendChild(headerCell1);
    
    const headerCell2 = document.createElement('th');
    headerCell2.textContent = column2Title;
    headerCell2.style.border = '1px solid black';
    headerCell2.style.padding = '8px';
    headerRow.appendChild(headerCell2);

    // Create table body
    const body = table.createTBody();
    
    for (const [key, value] of Object.entries(data)) {
        const row = body.insertRow();
        
        const cell1 = row.insertCell();
        cell1.textContent = key;
        cell1.style.border = '1px solid black';
        cell1.style.padding = '8px';
        
        const cell2 = row.insertCell();
        cell2.textContent = value;
        cell2.style.border = '1px solid black';
        cell2.style.padding = '8px';
    }

    // Append the table to the document body or a specific container
    document.body.appendChild(table);
}

// Example usage
//const data = { eat: 3, run: 2, walk: 1 };
//displayObjectInTable(data, 'Activity', 'Count');