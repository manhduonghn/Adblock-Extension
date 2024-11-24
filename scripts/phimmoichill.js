// Set a cookie with the key 'popupOpened' to prevent popup ads
document.cookie = "popupOpened=true; path=/;";

// Inject CSS to hide ad elements
const css = `
    .off-ads,
    #an_catfish {
        display: none !important;
    }
`;
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);

// Function to mute the ad video and skip it by moving to the end
function muteAndSkipAd(video) {
    if (video) {
        video.muted = true; // Mute the ad video
        video.currentTime = video.duration || 9999; // Skip to the end of the video
        video.remove(); // Remove the video element after skipping
        console.log("Muted and skipped the ad.");
    }
}

// Observe changes in the DOM for ads
const adObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        // Check if the ad video element has appeared
        const adPlayer = document.querySelector('.jw-flag-ads');
        const video = document.querySelector('.jw-video');

        if (adPlayer && video) {
            muteAndSkipAd(video); // Mute and skip the ad
            adObserver.disconnect(); // Stop observing after the ad is skipped
        }
    });
});

// Start observing the root of the document for changes
adObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
});

// The code related to script removal has been removed.
