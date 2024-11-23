const cssSelectors = [
    '.html5-video-player.ad-showing',
    '.html5-video-player.ad-interrupting',
    '.video-ads.ytp-ad-module',
    '.ytp-ad-overlay-container',
    'ytd-ad-slot-renderer',
    '#masthead-ad',
    'ytd-rich-item-renderer:has(.ytd-ad-slot-renderer)',
    'ytd-rich-section-renderer:has(.ytd-statement-banner-renderer)',
    'tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)',
    'ytd-popup-container:has(a[href="/premium"])',
    'yt-mealbar-promo-renderer',
    '#related #player-ads',
    '#related ytd-ad-slot-renderer',
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
    'ytm-companion-ad-renderer',
    'ad-slot-renderer'
];

const skipButtonSelectors = [
    '.ytp-ad-skip-button', '.ytp-ad-skip-button-modern', '.ytp-ad-skip-button-container'
];

// Inject CSS to hide ad elements
function injectCSS() {
    const style = document.createElement('style');
    style.textContent = cssSelectors.join(', ') + ' { display: none !important; }';
    document.documentElement.appendChild(style);
}

injectCSS(); // Inject CSS immediately

// Check and handle ads on YouTube
function checkAndHandleAds() {
    const player = document.querySelector('.html5-video-player');
    const video = document.querySelector('video');
    const skipButton = document.querySelector(skipButtonSelectors.join(', '));

    if (player && video) {
        const isAdPlaying = player.classList.contains('ad-showing');

        if (isAdPlaying) {
            video.muted = true; // Mute ad audio
            video.currentTime = video.duration || 9999; // Skip ad by fast-forwarding

            if (skipButton) skipButton.click(); // Click "Skip Ad" button if present
        }
    }
}

// Observe changes in the DOM to detect ads
function initObserver() {
    const observer = new MutationObserver(checkAndHandleAds);
    observer.observe(document.documentElement, { childList: true, subtree: true });
}

initObserver(); // Start observer
