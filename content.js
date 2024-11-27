// Function to remove ads from the page
function removeAds() {
  const elementsToHide = [
    '[class*="adswarning"]',
    '[class*="ad300"]',
    '[class*="adHeight"]',
    '[class*="special-offer"]',
    '[id*="adslot"]',
    '[class*="rightAd"]',
    '[id*="gpt-ad"]',
    '[class*="ad-slot"]',
    '[class*="ad-container"]',
    '[aria-label*="advertisement"]',
    '[class*="adnative"]',
    '[class*=".wps-player__happy-inside"]',
    '[id*="admobile"]',
    '[id*="deskad"]',
    ".vjs-inplayer-container",
    "#movieplayer-box-adv",
    "#EPimLayerOuter",
    '[class*="ads-banner"]',
    '[class*="ad-box"]',
    '[id*="adframe"]',
    '[class*="promo-ad"]',
    '[id*="adleaderboard"]',
    '[class*="banner-ad"]',
    '[id*="sponsored"]',
    '[class*="ad-display"]',
    '[id*="advert"]',
    '[class*="popup-ad"]',
    '[id*="adside"]',
    '[class*="adspace"]',
    '[class*="adblock"]',
    '[id*="adtop"]',
    ".ad-wrapper",
    ".advertisement-container",
    ".ad-section",
    '[class*="ad-wrap"]',
    '[class*="ad-banner"]',
    '[id*="adcontainer"]',
    '[class*="adsense"]',
    '[id*="ads_bottom"]',
    '[class*="ad-section"]',
    '[class*="adsbox"]',
    '[class*="ad-unit"]',
    '[class*="inline-ad"]',
    '[id*="ad-sidebar"]',
    '[class*="advert-unit"]',
    '[id*="adblocker"]',
    '[class*="ad-overlay"]',
    '[id*="adblock-sidebar"]',
    '[class*="sponsored-content"]',
    '[class*="ad-vertical"]',
    ".sponsored-post",
    "#ad-footer",
    "#ad-header",
    ".ad-background",
    ".video-archive-ad",
    "#topAdv",
    ".sidebar-ads",
  ];

  // Loop through all selectors and remove matching elements
  elementsToHide.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => element.remove());
  });
}

// Function to observe the DOM for changes and remove ads when detected
function monitorAds() {
  const observer = new MutationObserver(removeAds);

  // Check if DOM is ready and start observing
  function startObserver() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      removeAds(); // Remove ads immediately
    } else {
      // If `document.body` does not exist, try again later
      setTimeout(startObserver, 50);
    }
  }

  startObserver();
}

// Function to disable caching by adding meta tags
function disableCache() {
  // Check if DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addMetaTags);
  } else {
    addMetaTags(); // If DOM is ready, execute directly
  }

  function addMetaTags() {
    // Add Cache-Control meta tag
    const metaTag = document.createElement("meta");
    metaTag.httpEquiv = "Cache-Control";
    metaTag.content = "no-cache, no-store, must-revalidate";
    document.head.appendChild(metaTag);

    // Add Pragma meta tag
    const metaPragma = document.createElement("meta");
    metaPragma.httpEquiv = "Pragma";
    metaPragma.content = "no-cache";
    document.head.appendChild(metaPragma);

    // Add Expires meta tag
    const metaExpires = document.createElement("meta");
    metaExpires.httpEquiv = "Expires";
    metaExpires.content = "0";
    document.head.appendChild(metaExpires);
  }
}

// Run the scripts
disableCache(); // Disable cache for the page
monitorAds();   // Start monitoring and removing ads
