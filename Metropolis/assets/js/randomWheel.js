async function drawRandomCard() {
    try {
        const metropolisData = JSON.parse(localStorage.getItem("metropolis")) || {};

        // Check if cardsDeck exists and is not empty
        if (!metropolisData.cardsDeck || metropolisData.cardsDeck.length === 0) {
            // Fetch data from the carte.csv file
            const carteCsvData = await fetch(baseUrl + 'game/carte.csv').then(response => response.text());
            const carteOriginalArray = carteCsvData.split(',');

            // If cardsDeck is missing or empty, populate it with a copy of carteOriginalArray
            metropolisData.cardsDeck = [...carteOriginalArray];

            console.log("Populating card deck.");
        }

        // Get a random index within the range of the cardsDeck array
        const randomIndex = Math.floor(Math.random() * metropolisData.cardsDeck.length);

        // Retrieve the random card
        const randomCard = metropolisData.cardsDeck[randomIndex];

        // Remove the random card from the cardsDeck array
        metropolisData.cardsDeck.splice(randomIndex, 1);

        // Save the updated data back to localStorage
        localStorage.setItem("metropolis", JSON.stringify(metropolisData));

        var imagePath = baseUrl + 'game/' + randomCard;

        // Set the source of the image element
        const cardViewer = document.getElementById("cardViewer");
        if (cardViewer) {
            // Set the image source
            cardViewer.src = imagePath;

            // Make the image visible
            cardViewer.style.display = 'block';

            // Hide the text element
            const result = document.getElementById('textViewer');
            if (result) {
                result.style.display = 'none';
            }
        } else {
            console.error("Element with ID 'cardViewer' not found.");
        }
    } catch (error) {
        console.error('Error drawing random card:', error);
    }
}

// Define the getRandomValue function in the global scope
function getRandomValue(columnName, csvArray, textColor) {
    // Display textViewer and hide cardViewer
    const textViewer = document.getElementById('textViewer');
    if (textViewer) {
        textViewer.style.display = 'block';
    }

    const cardViewer = document.getElementById('cardViewer');
    if (cardViewer) {
        cardViewer.style.display = 'none';
    } else {
        console.error("Element with ID 'cardViewer' not found.");
    }

    // Log the entire CSV array for debugging
    console.log('CSV Array:', csvArray);

    // Trim whitespace from column names
    const trimmedColumnNames = csvArray[0].map(column => column.trim());

    // Get the index of the specified column
    const columnIndex = trimmedColumnNames.indexOf(columnName.trim());

    // Log the columnIndex for debugging
    console.log('Column Index:', columnIndex);

    // Extract the values from the specified column (excluding the header)
    const columnValues = getColumnValues(csvArray, columnIndex);

    // Log the columnValues for debugging
    console.log('Column Values:', columnValues);

    // Filter out empty and undefined values
    const nonEmptyValues = columnValues.filter(value => value !== undefined && value.trim() !== '');

    // Log the nonEmptyValues for debugging
    console.log('Non-Empty Values:', nonEmptyValues);

    // Get a random value from the non-empty values
    const randomValue = nonEmptyValues[Math.floor(Math.random() * nonEmptyValues.length)];

    // Display random values before revealing the extracted one
    const wheel = document.getElementById('tipoRuota');
    const result = document.getElementById('risultatoRuota');
    const animationDuration = 500; // 2 seconds
    const interval = 75; // Update every 200 milliseconds
    let counter = 0;

    // Function to handle the animation logic
    function handleAnimation(randomDisplayValue) {
        wheel.textContent = `${columnName}:`;
        wheel.style.color = textColor;
        result.textContent = `${randomDisplayValue}`;
        result.style.color = textColor;
    }

    const animationInterval = setInterval(() => {
        const randomDisplayValue = nonEmptyValues[Math.floor(Math.random() * nonEmptyValues.length)];
        handleAnimation(randomDisplayValue);

        counter += interval;

        // Stop the animation after the specified duration
        if (counter >= animationDuration) {
            clearInterval(animationInterval);

            // Conditionally handle the final display based on whether it's zero or not
            if (parseInt(randomValue) === 0) {
                // If it's 0, call the drawRandomCard function
                drawRandomCard();
            } else {
                handleAnimation(randomValue);
            }
        }
    }, interval);
}


// Function to extract values from a specific column (excluding header)
function getColumnValues(csvArray, columnIndex) {
    return csvArray.slice(1).map(row => row[columnIndex]);
}

// Function to load CSV data from an external file
async function loadCsvData() {
    try {
        const response = await fetch(baseUrl + 'game/wheel.csv');
        const csvData = await response.text();

        // Parse CSV data into an array
        const csvArray = csvData.split('\n').map(row => row.split(','));

        // Attach the function to the button click events
        document.getElementById('randomEstrazione').addEventListener('click', function () {
            getRandomValue('Estrazione', csvArray, 'green');
        });

        document.getElementById('randomPedone').addEventListener('click', function () {
            getRandomValue('Pedone', csvArray, 'orange');
        });

        document.getElementById('randomTram').addEventListener('click', function () {
            getRandomValue('Tram e Metro', csvArray, 'blue');
        });

        document.getElementById('randomTaxi').addEventListener('click', function () {
            getRandomValue('Taxi', csvArray, '#FFD700');
        });
    } catch (error) {
        console.error('Error fetching CSV data:', error);
    }
}

// Use DOMContentLoaded event to ensure script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Call the function to load CSV data
    loadCsvData();
});
