async function loadGallery() {
    // Array of file paths
    const carteCsvData = await fetch(baseUrl + 'game/carte.csv').then(response => response.text());
    const imagePaths = carteCsvData.split(',');

    // Get the container element where images will be displayed
    var imageContainer = document.getElementById("cardGallery");

    // Clear existing images in the container
    imageContainer.innerHTML = '';

    // Get the cards deck from localStorage
    const metropolisData = JSON.parse(localStorage.getItem("metropolis")) || {};
    const cardsDeck = metropolisData.cardsDeck || [];

    // Loop through the image paths and create image elements
    imagePaths.forEach(function (path) {
        var imgElement = document.createElement("img");
        imgElement.src = baseUrl + 'game/' + path;

    // Image is in the cards deck
    imgElement.style.maxWidth = '350px';
    imgElement.style.height = 'auto';        
    imgElement.style.margin = '10px';
    imgElement.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.5)';

        // Check if the path is in the cards deck and apply different styles accordingly
        if (!cardsDeck.includes(path)) {
            // Image is not in the cards deck - apply different styles (e.g., transparency)
            
            imgElement.style.filter = 'sepia(100%) brightness(0.7) opacity(0.7)';
        }

        imageContainer.appendChild(imgElement);
    });
}

 // Subscribe to the "currentDayChange" event
 window.addEventListener("currentDayChange", function(event) {
    // Update the HTML element with the new currentDay value
    loadGallery();
});