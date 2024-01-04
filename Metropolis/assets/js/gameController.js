// Function to clear all local storage
function newGame() {
    localStorage.removeItem("metropolis");

    console.log("Starting new game.");

    setupGame();
}

// Function to setup the game
async function setupGame() {
    // Check if localStorage has an item called "metropolis"
    const metropolisData = JSON.parse(localStorage.getItem("metropolis")) || {};    

    // Ensure gameVariables exists and contains the required keys
    metropolisData.gameVariables = metropolisData.gameVariables || {};
    metropolisData.gameVariables.currentDay = metropolisData.gameVariables.currentDay || 1;
    metropolisData.gameVariables.displayedGazette = metropolisData.gameVariables.displayedGazette || 1;
    
    // Ensure other keys exist
    metropolisData.gazzetteIndex = metropolisData.gazzetteIndex || {};
    metropolisData.cardsDeck = metropolisData.cardsDeck || [];    
    
    // Check if cardsDeck exists and is not empty
    if (!metropolisData.cardsDeck || metropolisData.cardsDeck.length === 0) {
        // Fetch data from the carte.csv file
        const carteCsvData = await fetch('../../game/carte.csv').then(response => response.text());
        const carteOriginalArray = carteCsvData.split(',');

        // If cardsDeck is missing or empty, populate it with a copy of carteOriginalArray
        metropolisData.cardsDeck = [...carteOriginalArray];

        console.log("Populating card deck.");

        // Save the updated data back to localStorage
        localStorage.setItem("metropolis", JSON.stringify(metropolisData));
    }

    // Fetch data from the gazzetta.csv file
    const gazzettaCsvData = await fetch('../../game/gazzetta.csv').then(response => response.text());
    const gazzettaOriginalArray = gazzettaCsvData.split(',');

    // Check if gazzetteIndex has missing keys or incorrect length
    const missingKeys = Object.keys(metropolisData.gazzetteIndex).filter(key => !gazzettaOriginalArray.includes(metropolisData.gazzetteIndex[key]));

    if (missingKeys.length > 0 || Object.keys(metropolisData.gazzetteIndex).length !== gazzettaOriginalArray.length) {
        // If missing keys or incorrect length, recreate the entire dictionary
        const copiedArray = [...gazzettaOriginalArray];
        metropolisData.gazzetteIndex = {};

        for (let i = 1; i <= gazzettaOriginalArray.length; i++) {
            const key = i.toString();

            // Create a new key
            metropolisData.gazzetteIndex[key] = "";

            // Get a random value from the copied array
            const randomIndex = Math.floor(Math.random() * copiedArray.length);
            const randomValue = copiedArray[randomIndex];

            // Assign the random value to the new key
            metropolisData.gazzetteIndex[key] = randomValue;

            // Remove the random value from the copied array
            copiedArray.splice(randomIndex, 1);
        } 
        
        console.log("Creating new gazette.");

        // Save the updated data back to localStorage
        localStorage.setItem("metropolis", JSON.stringify(metropolisData));
    }

    console.log("metropolisData:", metropolisData);

    // Fire an event indicating that the currentDay has changed
    const currentDayChangeEvent = new CustomEvent("currentDayChange", { detail: { currentDay: metropolisData.gameVariables.currentDay } });
    window.dispatchEvent(currentDayChangeEvent);
}

// Function to move to the next day
function nextDay() {
    const metropolisData = JSON.parse(localStorage.getItem("metropolis")) || {};
    
    // Check if currentDay is smaller than the number of keys in gazzetteIndex
    if (metropolisData.gameVariables && metropolisData.gazzetteIndex) {
        const currentDay = metropolisData.gameVariables.currentDay || 1;
        const gazzetteKeysCount = Object.keys(metropolisData.gazzetteIndex).length;

        if (currentDay < gazzetteKeysCount) {
            // Increase the value of currentDay by one
            metropolisData.gameVariables.currentDay = currentDay + 1;            

            // Save the updated data back to localStorage
            localStorage.setItem("metropolis", JSON.stringify(metropolisData));

            // Fire an event indicating that the currentDay has changed
            const currentDayChangeEvent = new CustomEvent("currentDayChange", { detail: { currentDay: metropolisData.gameVariables.currentDay } });
            window.dispatchEvent(currentDayChangeEvent);
        } else {
            console.log("No more days.");
        }
    }
}

// Function to update the HTML element with the id "currentDay"
function updateCurrentDayElement(currentDay) {
    const currentDayElement = document.getElementById("currentDay");
    if (currentDayElement) {
        currentDayElement.textContent = 'Giorno ' + currentDay;
    }
}

// Call setupGame on page loading
window.onload = function() {
    setupGame();

    // Subscribe to the "currentDayChange" event
    window.addEventListener("currentDayChange", function(event) {
        // Update the HTML element with the new currentDay value
        updateCurrentDayElement(event.detail.currentDay);
    });
};

// You can add more functions or logic as needed for your gameController
