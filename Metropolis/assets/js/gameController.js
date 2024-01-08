const baseUrl = window.location.href.replace(/\/[^\/]*$/, "/");

// Function to clear all local storage
function newGame() {
    localStorage.removeItem("metropolis");

    console.log("Starting new game.");

    setupGame();
}

// Function to setup the game
async function setupGame() {    
    console.log("baseurl",baseUrl);
    
    // Check if localStorage has an item called "metropolis"
    const metropolisData = JSON.parse(localStorage.getItem("metropolis")) || {};    

    // Ensure gameVariables exists and contains the required keys
    metropolisData.gameVariables = metropolisData.gameVariables || {};
    metropolisData.gameVariables.currentDay = metropolisData.gameVariables.currentDay || 1;
    metropolisData.gameVariables.displayedGazette = metropolisData.gameVariables.displayedGazette || 1;
    
    // Ensure other keys exist
    metropolisData.gazzetteIndex = metropolisData.gazzetteIndex || {};
    metropolisData.cardsDeck = metropolisData.cardsDeck || [];   

    // Check if the cardsDeck array is empty
    await checkDeckContent(metropolisData);      
    
    await checkGazetteContent(metropolisData);

    console.log("metropolisData:", metropolisData);

    // Fire an event indicating that the currentDay has changed
    const currentDayChangeEvent = new CustomEvent("currentDayChange", { detail: { currentDay: metropolisData.gameVariables.currentDay } });
    window.dispatchEvent(currentDayChangeEvent);
}

async function checkDeckContent(metropolisData) {   
    if (!metropolisData.cardsDeck || metropolisData.cardsDeck.length < 1) {
        
        try {
            const response = await fetch(baseUrl + 'game/carte.csv');
    
            if (response.ok) {
                const carteCsvData = await response.text();
    
                const rows = carteCsvData.split('\n');
                const carteOriginalArray = [];
    
                rows.forEach(row => {
                    const columns = row.split('$');
    
                    if (columns.length === 2) {
                        const count = parseInt(columns[0], 10);
                        const value = columns[1].trim();
    
                        carteOriginalArray.push(...Array(count).fill(value));
                    }
                });
    
                metropolisData.cardsDeck = [...carteOriginalArray];
    
                console.log("Populating card deck.");
    
                localStorage.setItem("metropolis", JSON.stringify(metropolisData));
            } else {
                console.error('Error fetching data. Status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching or processing data:', error);
        }
    }     
}

async function checkGazetteContent(metropolisData) { 
    // Fetch data from the gazzetta.csv file
    const gazzettaCsvData = await fetch(baseUrl + 'game/gazzetta.csv').then(response => response.text());
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
            // Display overlay stripe when there are no more days
            displayNoMoreDaysOverlay();
        }
    }
}

let isOverlayVisible = false; // Variable to track whether an overlay is currently visible

// Function to display overlay stripe when there are no more days
function displayNoMoreDaysOverlay() {
    // Check if an overlay is already visible
    if (!isOverlayVisible) {
        // Set the flag to indicate that an overlay is now visible
        isOverlayVisible = true;

        // Create a div element for the overlay stripe
        const overlayDiv = document.createElement("div");
        overlayDiv.style.position = "fixed";
        overlayDiv.style.top = "50%";
        overlayDiv.style.left = "0";
        overlayDiv.style.width = "100%";
        overlayDiv.style.height = "100px"; // You can adjust the height as needed
        overlayDiv.style.background = "red";
        overlayDiv.style.opacity = "0.75";
        overlayDiv.style.color = "white";
        overlayDiv.style.fontSize = "2em";
        overlayDiv.style.textAlign = "center";
        overlayDiv.style.lineHeight = "100px"; // Adjust line height for centering text
        overlayDiv.textContent = "Ultimo giorno.";

        // Append the overlay div to the body
        document.body.appendChild(overlayDiv);

        fadeOutOverlay(overlayDiv);
    }
}

// Function to gradually fade out the overlay with ease-in effect
function fadeOutOverlay(overlayDiv) {
    const fadeDuration = 600; // Total duration of fade-out in milliseconds
    const fadeInterval = 60; // Interval for each step in milliseconds
    const steps = fadeDuration / fadeInterval; // Number of steps

    let currentStep = 0;

    const fadeOutInterval = setInterval(() => {
        const easeInFactor = Math.pow(currentStep / steps, 2); // Ease-in effect

        // Update the opacity style with ease-in effect
        overlayDiv.style.opacity = Math.min(1 - easeInFactor, 0.75);

        // Check if the opacity is fully faded out
        if (easeInFactor >= 1 || currentStep >= steps) {
            // Clear the interval and remove the overlay from the DOM
            clearInterval(fadeOutInterval);
            document.body.removeChild(overlayDiv);

            // Reset the flag to indicate that no overlay is currently visible
            isOverlayVisible = false;
        }

        currentStep += 1;
    }, fadeInterval);
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
