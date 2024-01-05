function clearLocalStorage() {
    localStorage.clear();
    console.log('localStorage cleared.');
    // Optionally, you can also reload the page to reflect the changes immediately
    // window.location.reload();

    displayStatus();
}