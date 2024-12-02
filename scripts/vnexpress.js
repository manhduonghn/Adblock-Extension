function removeAdsAndAttributes() {
  const elementsToHide = [
    '[class="inner_section section_wrap_poll mb20"]',
    '[id="button-adblock"]', '[id="supper_masthead"]',
    '[id="sync_bgu_and_masthead"]',
    '[class="item-box-cate"]',
    '[class="wrap-hd-adblock"]',
    '[class="box-category box-ebank-qt"]',
    '[class="menu_grid2 width_common"]',
    '[class="contact downloadapp"]',
    '[class="guitoasoan_btn ads_btn"]',
    '[class="mb30 guitoasoan_btn ads_btn"]',
    '[class="list_item_panel width_common"]',
    '[class="ads"]', '[class="list-link"]',
    '[class="container box-news-other-site"]',
    '[class="width_common app_info vne_app"]',
    '[class*="section box_300_targer clearfix"]', 
    '[class*="newsletters_footer_mb coppy_right_info width_common"]',
    '[class*="installvneapp installvneapp--small js_installvneapp"]',
    '[id*="newsletters"]', '[id*="podcastIcon"]', '[class="inner_ads"]',
    '[id*="banner_top"]', '[id*="raovat"]', '[id*="thongtindoanhnghiep"]',
    '[class="width_common box-ewiki animated animatedFadeInUp fadeInUp"]',
  ];

  const unwantedLinks = [
    'li.item-menu > a[href*="raovat.vnexpress.net"]',
    'li.item-menu > a[href*="startup.vnexpress.net"]',
    'li.link > a[href*="raovat.vnexpress.net"]',
    'li.link > a[href*="startup.vnexpress.net"]',
  ];

  // Delete elements based on 'elementsToHide' 
  elementsToHide.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      // Remove the element completely from DOM 
      element.remove();
    });
  });

  // Delete the <li> containing unwanted links 
  unwantedLinks.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      const listItem = element.closest('li'); // Tìm thẻ <li> cha gần nhất
      if (listItem) {
        listItem.remove(); // Remove the whole <li> from DOM 
      }
    });
  });
}

function monitorAdsAdvanced() {
  const observer = new MutationObserver(() => {
    removeAdsAndAttributes();
  });

  function startObserver() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true, // Listen to change the list 
        subtree: true,   // Track all branches in DOM 
      });
      removeAdsAndAttributes(); // Delete elements immediately at the start 
    } else {
      setTimeout(startObserver, 50); // Try again later if 'document.body' is not ready 
    }
  }

  startObserver();
}

// Run the script
monitorAdsAdvanced();
