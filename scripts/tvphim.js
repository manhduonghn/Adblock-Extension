// Inject CSS to hide ad elements
const css = `
    center,
    #floating_ads_bottom_textcss_close,
    #floating_ads_bottom_textcss_wrap,
    #floating_ads_bottom_textcss_container {
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
const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        // Check if the ad video element has appeared
        const adPlayer = document.querySelector('.jw-flag-ads');
        const video = document.querySelector('.jw-video');

        if (adPlayer && video) {
            muteAndSkipAd(video); // Mute and skip the ad
            observer.disconnect(); // Stop observing after the ad is skipped
        }
    });
});

// Start observing the root of the document for changes
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});
