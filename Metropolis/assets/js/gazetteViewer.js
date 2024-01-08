// Function to update the view based on the "currentDayChange" event
function updateView(event) {
    const metropolisData = JSON.parse(localStorage.getItem("metropolis")) || {};

    // Update displayedGazette with the details of the event
    metropolisData.gameVariables.displayedGazette = event;

    // Save the updated data back to localStorage
    localStorage.setItem("metropolis", JSON.stringify(metropolisData));

    displayGazette();
}

function displayGazette() {    
    const metropolisData = JSON.parse(localStorage.getItem("metropolis")) || {};

    if (!metropolisData.gazzetteIndex || !metropolisData.gameVariables) {
        console.error("Incomplete metropolisData. Unable to display gazette.");
        return;
    }

    var currentIndex = metropolisData.gameVariables.displayedGazette;

    // Check if the currentIndex is a valid index in gazzetteIndex
    if (metropolisData.gazzetteIndex[currentIndex]) {
        var currentGazette = metropolisData.gazzetteIndex[currentIndex];
        var imagePath = baseUrl + 'game/' + currentGazette;

        console.log("Current Gazette Index:", currentIndex);
        console.log("Current Gazette:", currentGazette);

        // Set the source of the image element
        const gazetteViewer = document.getElementById("gazetteViewer");
        if (gazetteViewer) {
            
            gazetteViewer.src = imagePath;
            gazetteViewer.onload = function() {
                gazetteViewer.style.display = "block"; // or "inline"
            };


        } else {
            console.error("Element with ID 'gazetteViewer' not found.");
        } 
    } else {
        console.error("Invalid gazette index:", currentIndex);
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
