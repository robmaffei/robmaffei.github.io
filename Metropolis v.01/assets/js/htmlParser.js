// script.js

document.getElementById('loadDirectoryButton').addEventListener('click', loadDirectory);

function loadDirectory(directoryUrl) {
    var directoryUrl = '../../game/gazzetta/';  // Adjust the URL as needed
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