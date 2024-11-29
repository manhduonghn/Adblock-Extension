function removeAds() {
  const ids = [
    "adslot", "gpt-ad", "admobile", "deskad", "adframe", "adleaderboard", 
    "sponsored", "adcontainer", "ads_bottom", "ad-sidebar", "adblocker", 
    "ad-overlay", "adblock-sidebar", "ad-vertical", "ad-footer", "ad-header", 
    "topAdv"
  ];
  
  const classes = [
    "adswarning", "ad300", "adHeight", "special-offer", "rightAd", 
    "ad-slot", "ad-container", "advertisement", "adnative", "wps-player__happy-inside", 
    "ads-banner", "ad-box", "promo-ad", "banner-ad", "ad-display", 
    "advert", "popup-ad", "adside", "adspace", "adblock", "adtop", 
    "ad-wrapper", "advertisement-container", "ad-section", "ad-wrap", 
    "ad-banner", "adsense", "adsbox", "ad-unit", "inline-ad", 
    "advert-unit", "sponsored-content", "sponsored-post", "ad-background", 
    "video-archive-ad", "sidebar-ads"
  ];
  
  const elements = [
    ".vjs-inplayer-container", "#movieplayer-box-adv", "#EPimLayerOuter", 
    ".ad-section", ".ad-background", "#topAdv", ".sidebar-ads"
  ];
  
  // Build selectors dynamically from ids and classes
  const selectors = [
    ...ids.map(id => `[id*="${id}"]`),
    ...classes.map(cls => `[class*="${cls}"]`),
    ...elements
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => element.remove());
  });
}

function monitorAds() {
  const observer = new MutationObserver(removeAds);

  // Check if DOM is ready
  function startObserver() {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
      removeAds(); // Remove ads immediately
    } else {
      // If `document.body` does not exist, try again later
      setTimeout(startObserver, 50);
    }
  }

  startObserver();
}

// Run script
monitorAds();
