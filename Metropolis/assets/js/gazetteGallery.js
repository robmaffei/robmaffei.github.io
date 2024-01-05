async function loadGallery() {
    var imageContainer = document.getElementById("gazetteGallery");
    imageContainer.innerHTML = '';

    const metropolisData = JSON.parse(localStorage.getItem("metropolis")) || {};
    const gazetteIndex = metropolisData.gazzetteIndex || {};
    const currentDay = metropolisData.gameVariables.currentDay || 0;

    // Split images into two groups: keys <= currentDay and keys > currentDay
    const imagesBeforeCurrentDay = [];
    const imagesAfterCurrentDay = [];

    Object.entries(gazetteIndex).forEach(([key, path]) => {
        if (parseInt(key) <= currentDay) {
            imagesBeforeCurrentDay.push({ key, path });
        } else {
            imagesAfterCurrentDay.push({ key, path });
        }
    });

    // Display images before currentDay in ascending order with captions
    imagesBeforeCurrentDay
        .sort((a, b) => parseInt(a.key) - parseInt(b.key))
        .forEach(({ key, path }) => {
            displayImage(imageContainer, path, key);
        });

    // Display images after currentDay in random order with sepia tone
    shuffleArray(imagesAfterCurrentDay);
    imagesAfterCurrentDay.forEach(({ path }) => {
        displayImage(imageContainer, path, false);
    });
}

function displayImage(container, path, caption) {
    var imgContainer = document.createElement("div");
    var imgElement = document.createElement("img");
    imgElement.src = '../../game/' + path;

    imgElement.style.maxWidth = '100%';
    imgElement.style.objectFit = 'cover';

    imgContainer.style.width = '350px';
    imgContainer.style.height = '200px';
    imgContainer.style.overflow = 'hidden';
    imgContainer.style.margin = '10px';
    imgContainer.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.5)';
    imgContainer.style.position = 'relative'; // Set position to relative

    if (!caption) {  // If notViewed
        imgElement.style.filter = 'sepia(100%) brightness(0.7) opacity(0.7)';
    }
    
    imgContainer.appendChild(imgElement);

    if (caption) {
        var captionElement = document.createElement("div");        
        captionElement.style.textAlign = 'center';
        captionElement.style.position = 'absolute'; // Set position to absolute
        captionElement.style.bottom = '5px'; // Adjust bottom spacing
        captionElement.style.width = '100%'; // Ensure full width
        captionElement.style.backgroundColor = 'white'; // White background

        var captionText = document.createElement("b");
        captionText.innerText = "Giorno " + caption;

        // Append captionText to captionElement
        captionElement.appendChild(captionText);

        imgContainer.appendChild(captionElement);
    }

    container.appendChild(imgContainer);

    // Add click event to open full-screen image
    imgElement.addEventListener('click', function () {
        openFullScreenImage('../../game/' + path);
    });
}

function openFullScreenImage(imageSrc) {
    var modal = document.createElement("div");
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '999';

    var fullScreenImage = document.createElement("img");
    fullScreenImage.src = imageSrc;
    fullScreenImage.style.maxWidth = '90%';
    fullScreenImage.style.maxHeight = '90%';
    fullScreenImage.style.objectFit = 'contain';

    modal.appendChild(fullScreenImage);

    // Close modal when clicking outside the image
    modal.addEventListener('click', function () {
        modal.remove();
    });

    document.body.appendChild(modal);
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

window.addEventListener("currentDayChange", function(event) {
    loadGallery();
});
