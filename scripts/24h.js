function removeAds() {
  const ids = [
    "banner_duoi_tin_so_6", "div_inpage_banner" , "banner-inpage"
  ];
  
  const classes = [
    "m_banner_show", "footer-24h-lhqc"
  ];
  
  const elements = [
    ".popup_ads_100wh", ".popup_ads_none", ".popup_ads",
    "#box_4t1_trang_chu > .mar-auto.container",
    "#div_danh_cho_phai_dep_cot_phai",
    ".mar-t-15.padd-b-15.padd-t-30.ttdn-24h-b",
    ".mgbt10.mrT5.cate-24h-foot-home-2-col"
  ];
  
  const dynamicSelectors = [
    '[id*="ADS_"][id*="container"]',
    '[class*="module_"][class="_ads"]',
    '[id*="google_ads_iframe"][id*="mobile"]'
  ];

  const selectors = [
    ...ids.map(id => `[id*="${id}"]`),
    ...classes.map(cls => `[class*="${cls}"]`),
    ...elements,
    ...dynamicSelectors
  ];

  selectors.forEach(selector => {
    try {
      const nodes = document.querySelectorAll(selector);

      // Ensure nodes is iterable
      if (nodes && nodes.forEach) {
        nodes.forEach(node => node.remove());
      } else {
        Array.from(nodes).forEach(node => node.remove());
      }
    } catch (error) {
      console.error(`Invalid selector: ${selector}`, error);
    }
  });
}

function monitorAds() {
  const observer = new MutationObserver(removeAds);

  function startObserver() {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
      removeAds();
    } else {
      setTimeout(startObserver, 50);
    }
  }

  startObserver();
}

monitorAds();

// Iterates through all the elements <article> 
var articles = document.querySelectorAll('article');

articles.forEach(function(article) {
    // Check if there is a link to rel="nofollow sponsored" 
    var link = article.querySelector('a[rel="nofollow sponsored"]');
    
    // Check if the article contains "Consult News" in the article
    if (link && article.textContent.includes('Tin tài trợ')) {
        article.remove(); // Delete the element <article> 
    }
});
