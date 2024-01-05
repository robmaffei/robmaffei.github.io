// Function to update the view based on the "currentDayChange" event
function updateView(event) {
    const metropolisData = JSON.parse(localStorage.getItem("metropolis")) || {};

    // Update displayedGazette with the details of the event
    metropolisData.gameVariables.displayedGazette = event;

    // Save the updated data back to localStorage
    localStorage.setItem("metropolis", JSON.stringify(metropolisData));

    displayGazette();
}

// Function display the gazette
function displayGazette() {    
    const metropolisData = JSON.parse(localStorage.getItem("metropolis")) || {};

    var currentIndex = metropolisData.gameVariables.displayedGazette;

    var currentGazette = metropolisData.gazzetteIndex[currentIndex];

    var imagePath = baseUrl + 'game/' + currentGazette;

    console.log("Current Gazette Index:", currentIndex);
    console.log("Current Gazette:", currentGazette);    

    // Set the source of the image element
    const gazetteViewer = document.getElementById("gazetteViewer");
    if (gazetteViewer) {
        gazetteViewer.src = imagePath;
    } else {
        console.error("Element with ID 'gazetteViewer' not found.");
    } 
}

document.addEventListener("DOMContentLoaded", function() {    
    displayGazette();

    // Subscribe to the "currentDayChange" event
    window.addEventListener("currentDayChange", function(event) {
        // Update the HTML element with the new currentDay value
        updateView(event.detail.currentDay);
    });
});
