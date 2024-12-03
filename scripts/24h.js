// Hàm xóa các quảng cáo dựa trên id, class, hoặc nội dung
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

  // 1. Xóa các phần tử theo các selector
  selectors.forEach(selector => {
    try {
      document.querySelectorAll(selector).forEach(node => node.remove());
    } catch (error) {
      console.warn(`Không thể xử lý selector: ${selector}`, error);
    }
  });

  // 2. Xóa các phần tử <a> có `rel="sponsored"`
  document.querySelectorAll('a[rel="sponsored"]').forEach(ad => ad.remove());

  // 3. Xóa các phần tử <span> có chứa "Tin tài trợ"
  document.querySelectorAll('span').forEach(span => {
    if (span.textContent.includes("Tin tài trợ")) {
      const parent = span.closest('div'); // Xóa thẻ cha gần nhất nếu tồn tại
      if (parent) parent.remove();
      else span.remove();
    }
  });
}

// Hàm khởi động MutationObserver để theo dõi các thay đổi trên DOM
function monitorAds() {
  const observer = new MutationObserver(() => removeAds());

  function startObserver() {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
      removeAds(); // Chạy ngay khi bắt đầu
    } else {
      setTimeout(startObserver, 50); // Đợi DOM sẵn sàng
    }
  }

  startObserver();
}

// Gọi hàm để khởi chạy
monitorAds();
