// List of elements to hide or remove
const elementsToHideOrRemove = [
  '[class*="inner_section section_wrap_poll mb20"]',
  '[class*="item-box-cate"]',
  '[class*="box-category box-ebank-qt"]',
  '[class*="menu_grid2 width_common"]',
  '[class*="contact downloadapp"]',
  '[class*="guitoasoan_btn ads_btn"]',
  '[class*="mb30 guitoasoan_btn ads_btn"]',
  '[class*="list_item_panel width_common"]',
  '[class*="ads"]',
  '[class*="list-link"]',
  '[class*="container box-news-other-site"]',
  '[class*="width_common app_info vne_app"]',
  '[class*="section box_300_targer clearfix"]',
  '[class*="newsletters_footer_mb coppy_right_info width_common"]',
  '[class*="installvneapp installvneapp--small js_installvneapp"]',
  '[id*="newsletters"]',
  '[id*="podcastIcon"]',
  '[class*="inner_ads"]',
  '[id*="banner_top"]',
  '[id*="raovat"]',
  '[id*="thongtindoanhnghiep"]',
];

// List of unwanted links to remove
const unwantedLinks = [
  'li.item-menu > a[href*="raovat.vnexpress.net"]',
  'li.item-menu > a[href*="startup.vnexpress.net"]',
  'li.link > a[href*="raovat.vnexpress.net"]',
  'li.link > a[href*="startup.vnexpress.net"]',
];

// Function to hide elements by applying CSS rules
function hideElementsWithCSS(selectors) {
  const style = document.createElement("style");
  style.textContent = selectors
    .map((selector) => `${selector} { display: none !important; }`)
    .join(" ");
  document.head.appendChild(style);
}

// Function to completely remove elements from the DOM
function removeElements(selectors) {
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      try {
        element.remove(); // Remove the element from the DOM
      } catch (err) {
        console.error(`Error removing element: ${selector}`, err);
      }
    });
  });
}

// Function to remove unwanted links and their parent <li>
function removeUnwantedLinks(selectors) {
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      try {
        const listItem = element.closest("li"); // Find the closest <li> parent
        if (listItem) {
          listItem.remove(); // Remove the entire <li>
        }
      } catch (err) {
        console.error(`Error removing list item: ${selector}`, err);
      }
    });
  });
}

// Main function to hide and remove elements
function hideAndRemoveAds() {
  // Apply CSS to hide elements
  hideElementsWithCSS(elementsToHideOrRemove);

  // Remove elements from the DOM
  removeElements(elementsToHideOrRemove);

  // Remove unwanted links
  removeUnwantedLinks(unwantedLinks);
}

// Function to monitor DOM changes and reapply removal logic
function monitorAdsWithObserver() {
  const observer = new MutationObserver(() => {
    hideAndRemoveAds();
  });

  function startObserver() {
    if (document.body) {
      // Start observing DOM changes
      observer.observe(document.body, {
        childList: true, // Watch for changes in child elements
        subtree: true,   // Monitor the entire DOM tree
      });

      // Initial run to remove ads
      hideAndRemoveAds();
    } else {
      // Retry if document.body is not ready
      setTimeout(startObserver, 50);
    }
  }

  startObserver();
}

// Run the script
monitorAdsWithObserver();
