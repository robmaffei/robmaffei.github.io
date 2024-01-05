// Function to clear all local storage
function newGame() {
    localStorage.removeItem("metropolis");

    console.log("Starting new game.");

    setupGame();
}

function loadDirectory(directoryUrl) {
    return new Promise((resolve, reject) => {
        fetch(directoryUrl)
            .then(response => response.text())
            .then(htmlContent => {
                // Now you can parse or manipulate the content as needed
                var parser = new DOMParser();
                var doc = parser.parseFromString(htmlContent, 'text/html');
                var fileLinks = doc.getElementsByTagName("a");

                // Array to store file names
                var fileNames = [];

                // Iterate through each anchor element
                for (var i = 0; i < fileLinks.length; i++) {
                    var title = fileLinks[i].getAttribute("title");

                    // Exclude the parent directory ("..")
                    if (title && title !== "..") {
                        var path = fileLinks[i].getAttribute("href");
                        fileNames.push(path);
                    }
                }

                // Log the list of file names to the console
                console.log("File Names:", fileNames);

                resolve(fileNames); // Resolve the Promise with the file names
            })
            .catch(error => {
                console.error('Error fetching directory:', error);
                reject(error); // Reject the Promise with the error
            });
    });
}

async function populateStartingDeck(metropolisData) {
    try {        
        //Starting deck setup
        metropolisData.startingDeck = await loadDirectory('../../game/carte');
        console.log("Populating starting deck.", metropolisData.startingDeck);
        // Save the updated data back to localStorage
        localStorage.setItem("metropolis", JSON.stringify(metropolisData));

        // Now you can use startingDeck as needed
        // Example: doSomethingWithStartingDeck(startingDeck);
    } catch (error) {
        console.error('Error in populateStartingDeck:', error);
    }
}

async function createGazette(metropolisData) {
    try {        
        //Starting gazette setup
        metropolisData.gazettePages = await loadDirectory('../../game/gazzetta');
        console.log("Populating gazette.", metropolisData.gazettePages);
        // Save the updated data back to localStorage
        localStorage.setItem("metropolis", JSON.stringify(metropolisData));

        // Now you can use startingDeck as needed
        // Example: doSomethingWithStartingDeck(startingDeck);
    } catch (error) {
        console.error('Error in createGazette:', error);
    }
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
    metropolisData.startingDeck = metropolisData.startingDeck || [];
    metropolisData.cardsDeck = metropolisData.cardsDeck || [];    
    metropolisData.gazettePages = metropolisData.gazettePages || [];
    metropolisData.gazzetteIndex = metropolisData.gazzetteIndex || {};
    
    populateStartingDeck(metropolisData);

    // Check if cardsDeck exists and is not empty
    if (!metropolisData.cardsDeck || metropolisData.cardsDeck.length === 0) {        
        // If cardsDeck is missing or empty, populate it with a copy of carteOriginalArray
        metropolisData.cardsDeck = [...metropolisData.startingDeck];

        console.log("Populating card deck.");

        // Save the updated data back to localStorage
        localStorage.setItem("metropolis", JSON.stringify(metropolisData));
    }    

    createGazette(metropolisData);
    
    // Check if gazzetteIndex has missing keys or incorrect length    
    const missingKeys = Object.keys(metropolisData.gazzetteIndex).filter(key => !metropolisData.gazettePages.includes(metropolisData.gazzetteIndex[key]));

    if (missingKeys.length > 0 || Object.keys(metropolisData.gazzetteIndex).length !== metropolisData.gazettePages.length) {
        // If missing keys or incorrect length, recreate the entire dictionary
        const copiedArray = [...metropolisData.gazettePages];
        metropolisData.gazzetteIndex = {};

        for (let i = 1; i <= metropolisData.gazettePages.length; i++) {
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
