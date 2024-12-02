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

function removeAdsByPatterns() {
  try {
    // Các phần tử cần loại bỏ, căn cứ vào 'sponsored' và liên kết
    const adsSelector = 'article.atclRdSbIn, article.xocbg';
    const ads = document.querySelectorAll(adsSelector);

    ads.forEach((article) => {
      // Kiểm tra nếu trong phần tử có các điều kiện đặc trưng của quảng cáo
      const adLink = article.querySelector('a[rel="nofollow"][sponsored]');
      const adImage = article.querySelector('img[src*="cdn.24h.com.vn"]');
      const sponsoredText = article.querySelector('span.tmPst.clrGr');

      // Loại bỏ phần tử nếu phát hiện là quảng cáo
      if (adLink || adImage || sponsoredText) {
        article.remove();
      }
    });

  } catch (error) {
    console.error("Error while removing ads:", error);
  }
}

function observeAds() {
  const observer = new MutationObserver(removeAdsByPatterns);

  document.addEventListener('DOMContentLoaded', () => {
    try {
      removeAdsByPatterns();  // Gọi hàm loại bỏ quảng cáo ngay sau khi trang tải
    } catch (error) {
      console.error("Error during initial ad removal:", error);
    }

    // Quan sát thay đổi trong body để tiếp tục loại bỏ quảng cáo nếu có phần tử mới
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

// Bắt đầu quan sát
observeAds();
monitorAds();
