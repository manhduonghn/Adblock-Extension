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
    'ad-slot-renderer',
    '.yt-playability-error-supported-renderers',
    'tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)'
];

const skipButtonSelectors = [
    '.ytp-ad-skip-button', '.ytp-ad-skip-button-modern', '.ytp-ad-skip-button-container'
];

let videoId = null;
let isSwitchedToEmbed = false;
let isAllowPauseVideo = false;
let allowPauseVideoTimeoutId = 0;
let video = null;
let fineScrubbing = null;

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
    const skipButton = document.querySelector(skipButtonSelectors.join(', '));

    if (player) {
        const isAdPlaying = player.classList.contains('ad-showing');
        video = player.querySelector('video.html5-main-video');

        if (isAdPlaying && video) {
            video.muted = true; // Mute ad audio
            video.currentTime = video.duration || 9999; // Skip ad by fast-forwarding
            if (skipButton) skipButton.click(); // Click "Skip Ad" button if present
        }

        if (video) {
            video.addEventListener('pause', handlePauseVideo);
            video.addEventListener('mouseup', allowPauseVideo);
        }
    }

    // Handle adblocker warnings
    const adBlockerWarningDialog = document.querySelector(
        'tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)'
    );
    if (adBlockerWarningDialog) adBlockerWarningDialog.remove();

    const adBlockerWarningInner = document.querySelector('.yt-playability-error-supported-renderers');
    if (adBlockerWarningInner) {
        adBlockerWarningInner.remove();
        if (!isSwitchedToEmbed) {
            console.log("Switching to embed mode due to adblocker warnings");
            updateEmbed();
            isSwitchedToEmbed = true;
        }
    }
}

// Update to embedded mode
function updateEmbed() {
    const videoId = new URLSearchParams(window.location.search).get('v');
    if (videoId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.classList.add('youtube-main-embed-video');
        iframe.width = '100%';
        iframe.style.height = '400px';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        const videoContainer = document.querySelector('#player');
        if (videoContainer) {
            videoContainer.innerHTML = '';
            videoContainer.appendChild(iframe);
        }
    }
}

// Allow temporary pause control
function allowPauseVideo() {
    isAllowPauseVideo = true;
    clearTimeout(allowPauseVideoTimeoutId);
    allowPauseVideoTimeoutId = setTimeout(disallowPauseVideo, 500);
}

// Disallow pause control
function disallowPauseVideo() {
    isAllowPauseVideo = false;
    clearTimeout(allowPauseVideoTimeoutId);
}

// Handle video pause
function handlePauseVideo() {
    if (isAllowPauseVideo) {
        disallowPauseVideo();
        return;
    }
    if (document.hidden) return;
    if (fineScrubbing?.checkVisibility()) return;
    if (video && video.duration - video.currentTime > 0.1) video.play();
}

// Observe changes in the DOM to detect ads
function initObserver() {
    const observer = new MutationObserver(checkAndHandleAds);
    observer.observe(document.documentElement, { childList: true, subtree: true });
}

initObserver(); // Start observer

// Add event listeners for key controls
function handleGlobalKeyDownKeyUp(event) {
    if (document.activeElement?.matches('input, textarea, select')) return;
    if (event.type === 'keydown' && ['KeyK', 'MediaPlayPause'].includes(event.code)) {
        allowPauseVideo();
    } else if (event.type === 'keyup' && event.code === 'Space') {
        allowPauseVideo();
    }
}

window.addEventListener('keydown', handleGlobalKeyDownKeyUp);
window.addEventListener('keyup', handleGlobalKeyDownKeyUp);
