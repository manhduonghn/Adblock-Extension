function removeAds() {
  const ids = [
    "banner_duoi_tin_so_6", "div_inpage_banner", "banner-inpage"
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
    '[class*="module_"][class*="_ads"]',
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
      if (nodes && nodes.length > 0) {
        nodes.forEach(node => node.remove());
      }
    } catch (error) {
      console.error(`Invalid selector: ${selector}`, error);
    }
  });
}

function monitorAds() {
  const observer = new MutationObserver(() => {
    try {
      removeAds();
    } catch (error) {
      console.error("Error while removing ads:", error);
    }
  });

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

function removeSponsoredContent() {
  try {
    const articles = document.querySelectorAll('article.atclRdSbIn.xocbg');
    articles.forEach(article => {
      if (article.textContent.includes('Tin tài trợ')) {
        article.remove();
      }
    });

    const randomIdRegex = /^[a-zA-Z]{8,12}_\d+_\d+$/;
    document.querySelectorAll('[id]').forEach(element => {
      if (randomIdRegex.test(element.id)) {
        element.remove();
      }
    });
  } catch (error) {
    console.error("Error while removing sponsored content:", error);
  }
}

function monitorSponsoredContent() {
  const observer = new MutationObserver(removeSponsoredContent);

  document.addEventListener('DOMContentLoaded', () => {
    try {
      removeSponsoredContent();
    } catch (error) {
      console.error("Error during initial sponsored content removal:", error);
    }

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

monitorAds();
monitorSponsoredContent();
