async function loadGallery() {
    // Fetch the CSV data
    const response = await fetch(baseUrl + 'game/carte.csv');

    if (response.ok) {
        const carteCsvData = await response.text();

        // Create a dictionary from the CSV data
        const cardDict = {};

        const rows = carteCsvData.split('\n');
        rows.forEach(row => {
            const columns = row.split('$');

            if (columns.length === 2) {
                const count = parseInt(columns[0], 10);
                const value = columns[1].trim();  // Trim both count and value

                cardDict[value] = count;
            }
        });

        // Log the dictionary for debugging purposes
        console.log("Card Dictionary:", cardDict);

        // Get the container element where cards will be displayed
        var cardGallery = document.getElementById("cardGallery");

        // Create a div container for each key in the dictionary
        Object.keys(cardDict).forEach(function (key) {
            // Create a div container
            var cardContainer = document.createElement("div");
            cardContainer.classList.add("cardContainer");
            cardContainer.style.overflow= 'hidden';

            // Create an h1 element with the respective key as text
            var cardText = document.createElement("h1");
            cardText.classList.add("cardText");
            cardText.textContent = key;

            // Append the h1 element to the div container
            cardContainer.appendChild(cardText);

            // Create a caption element
            var captionElement = document.createElement("div");
            captionElement.classList.add("captionElement");
            captionElement.style.textAlign = 'center';
            captionElement.style.fontSize = '1.5em';
            captionElement.style.position = 'relative'; // Set position to absolute
            captionElement.style.bottom = '25%'; // Align to the bottom
            captionElement.style.left = '45%'; // Align to the right
            captionElement.style.width = '100%';
            captionElement.style.transform = 'rotate(-45deg)'; // Rotate by 45° counterclockwise            
            captionElement.style.filter = 'sepia(100%) brightness(.9) opacity(1)';
            captionElement.style.backgroundColor = 'rgba(255, 255, 255, .8)';
            captionElement.style.borderTop = '1px solid black';
            captionElement.style.borderBottom = '1px solid black';

            // Create caption text
            var captionText = document.createElement("b");
            captionText.innerText = cardDict[key] + 'x';

            // Append caption text to caption element
            captionElement.appendChild(captionText);

            // Append the caption element to the div container
            cardContainer.appendChild(captionElement);

            // Append the div container to the cardGallery
            cardGallery.appendChild(cardContainer);
        });

    } else {
        console.error('Error fetching data. Status:', response.status);
    }
}

// Subscribe to the "currentDayChange" event
window.addEventListener("currentDayChange", function (event) {
    // Update the HTML element with the new currentDay value
    loadGallery();
});
