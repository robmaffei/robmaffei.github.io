function calculateOdds() {
    const csvFilePath = baseUrl + 'game/wheel.csv';

    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvData => {
            const rows = csvData.split('\n');
            const oddsTable = document.getElementById('oddsTable');

            oddsTable.innerHTML = '';

            // Add headers to the odds table
            const headersRow = oddsTable.insertRow();
            headersRow.insertCell().textContent = '';
            headersRow.insertCell().textContent = 'Media';
            headersRow.insertCell().textContent = 'Massimo';

            // Populate the odds table
            for (let i = 1; i < rows[0].split(',').length; i++) {
                const row = oddsTable.insertRow();
                const firstCellValue = rows[0].split(',')[i];
                const cell = row.insertCell();
                cell.textContent = firstCellValue;

                const columnIndex = findColumnIndex(rows, firstCellValue);
                const maxValue = calculateMaxValue(rows, columnIndex);
                const averageValue = calculateAverage(rows, columnIndex);

                row.insertCell().textContent = isNaN(averageValue) ? 'N/A' : Math.round(averageValue).toString();
                row.insertCell().textContent = isNaN(maxValue) ? 'N/A' : Math.round(maxValue).toString();
            }
            
                        // Apply background colors for the second, third, and fourth rows
                        const secondRowCells = Array.from(oddsTable.rows[1].cells);
                        secondRowCells.forEach(cell => {
                            cell.style.backgroundColor = 'orange';
                            cell.style.color = 'black';
                        });
            
                        const thirdRowCells = Array.from(oddsTable.rows[2].cells);
                        thirdRowCells.forEach(cell => {
                            cell.style.backgroundColor = 'blue';
                            cell.style.color = 'white';
                        });
            
                        const fourthRowCells = Array.from(oddsTable.rows[3].cells);
                        fourthRowCells.forEach(cell => {
                            cell.style.backgroundColor = '#FFD700';
                            cell.style.color = 'black';
                        });

            // Apply formatting for the first column
            const firstColumnCells = Array.from(oddsTable.querySelectorAll('tr td:first-child'));
            firstColumnCells.forEach(cell => {
                cell.style.backgroundColor = 'white';
                cell.style.fontWeight = 'bold';
                cell.style.color = 'black';
            });

            // Apply formatting for the first row
            const firstRowCells = Array.from(oddsTable.rows[0].cells).slice(1);
            firstRowCells.forEach(cell => {
                cell.style.backgroundColor = 'white';
                cell.style.fontWeight = 'bold';
                cell.style.color = 'black';
            });
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

function calculateMaxValue(rows, columnIndex) {
    const columnValues = rows.slice(1).map(row => parseFloat(row.split(',')[columnIndex]));
    const validValues = columnValues.filter(value => !isNaN(value));
    
    return validValues.length > 0 ? Math.max(...validValues) : NaN;
}

// Function to find the index of a column in the CSV
function findColumnIndex(rows, header) {
    const headers = rows[0].split(',');
    return headers.indexOf(header);
}

// Function to calculate the average value of a column in the CSV (excluding headers)
function calculateAverage(rows, columnIndex) {
    const columnValues = rows.slice(1).map(row => {
        const value = parseFloat(row.split(',')[columnIndex]);
        return !isNaN(value) ? value : 0; // Replace non-numeric values with 0
    });
    const sum = columnValues.reduce((total, value) => total + value, 0);
    return sum / columnValues.length;
}

// Function to fetch and display CSV data in a transposed table with formatting
function displayCSV() {
    // Path to your CSV file
    const csvFilePath = baseUrl + 'game/wheel.csv';

    // Fetch the CSV file
    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvData => {
            // Split CSV data into rows
            const rows = csvData.split('\n');

            // Get the table element
            const table = document.getElementById('csvTable');

            // Clear existing table content
            table.innerHTML = '';

            // Insert the first row with empty first column and "Valori" in the second column
            const firstRow = table.insertRow();
            const emptyCell = firstRow.insertCell();
            emptyCell.textContent = ''; // Empty content for the first cell
            emptyCell.style.backgroundColor = 'white';
            emptyCell.style.fontWeight = 'bold';
            emptyCell.style.color = 'black';

            const valoriCell = firstRow.insertCell();
            valoriCell.textContent = 'Valori'; // Content for the second cell
            valoriCell.colSpan = rows.length - 1; // Span the length of the table
            valoriCell.style.backgroundColor = 'white';
            valoriCell.style.fontWeight = 'bold';
            valoriCell.style.color = 'black';

            // Transpose and populate the rest of the table rows with formatting
            for (let i = 0; i < rows[0].split(',').length; i++) {
                const row = table.insertRow();

                for (let j = 0; j < rows.length - 1; j++) { // Skip the last empty row
                    const cellData = rows[j].split(',')[i].trim();
                    const cell = row.insertCell();

                    // Replace 0 with 'C'
                    const displayedValue = cellData === '0' ? 'C' : cellData;
                    cell.textContent = displayedValue;

                    // Apply different formatting to the first column
                    if (j === 0) {
                        cell.style.fontWeight = 'bold';
                        cell.style.backgroundColor = 'white';
                        cell.style.color = 'black'; // Black text color for the first column
                    } else {
                        // Apply different text colors to the other columns
                        cell.style.color = 'white'; // White text color for other columns                        
                    }

                    // Apply different background colors to each row
                    if (j > 0) {
                        cell.style.textAlign = 'center';

                        switch (i % 4) {
                            case 0:
                                cell.style.backgroundColor = 'green';
                                break;
                            case 1:
                                cell.style.backgroundColor = 'orange';
                                cell.style.color = 'black';
                                break;
                            case 2:
                                cell.style.backgroundColor = 'blue';
                                break;
                            case 3:
                                cell.style.backgroundColor = '#FFD700'; // Gold color
                                cell.style.color = 'black'; // White text color for other columns
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching CSV:', error));
}



document.addEventListener("DOMContentLoaded", function() {    
    displayCSV();

    calculateOdds();    
});