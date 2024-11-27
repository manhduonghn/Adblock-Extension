// Define initial CSS rules to hide specific sections immediately
const css = `
    .clz, .relates, .tip-lst,
    .mix-tags, .mix-story, .mix-stars,
    .mix-specs, .email-box, .mix-predict,
    .tx-cen.emobar, #ADMTOP,
    #aplbshare.prescript,
    div.clz:nth-of-type(1),
    div.clx:nth-of-type(14),
    div.clx:nth-of-type(16),
    div.row:nth-of-type(15),
    div.row:nth-of-type(17),
    main:nth-child(3) > 
    section:last-child > 
    div.cont-wrap > 
    div.row:first-child > 
    div.col.pad-300:first-child > 
    div.mix-cats:nth-child(6) > 
    div.row:nth-child(12) > 
    div.col.m12.w6:last-child > 
    div.capt-cover.ex-nav:first-child {
        display: none !important;
    }
`;

// Inject CSS into the document to hide elements
function injectCSS(cssRules) {
    const style = document.createElement('style');
    style.textContent = cssRules;
    document.documentElement.appendChild(style);
}

// Function to remove unwanted content dynamically
function removeUnwantedContent() {
    // Keywords to identify unwanted elements based on their class, ID, or href attributes
    const keywords = [
        "phui.bongdaplus.vn", "mansion-sports",
        "chuyen-de/phong-trao", "/tip-tu-chuyen-gia",
        "/goc-check-var", "/hau-truong-bong-da",
        "/ben-ngoai-duong-piste", "/hotgirl", "/esports",
        "/soi-keo", "/dam-me", "/tran-cau-vang",
        "/keo-xien-tags", "/phao-cuu-sinh-tags", "/bong-da-phong-trao",
        "/bet-of-the-day-tags", "/nhan-dinh-bong-da"
    ];

    // Array to store CSS selectors for removal
    const selectorsToRemove = [];

    // Generate CSS selectors for keywords
    keywords.forEach(keyword => {
        selectorsToRemove.push(
            `[class*="${keyword}"]`,    // Matches elements with a class containing the keyword
            `[id*="${keyword}"]`,       // Matches elements with an ID containing the keyword
            `a[href*="${keyword}"]`     // Matches anchor tags with href containing the keyword
        );
    });

    // Remove elements matching the generated selectors
    selectorsToRemove.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            const parent = element.parentElement; // Save the parent element before removal
            element.remove(); // Remove the element

            // If the parent has no remaining children, remove it as well
            if (parent && parent.children.length === 0) {
                parent.remove();
            }
        });
    });

    // Remove <li> elements containing unwanted links
    keywords.forEach(keyword => {
        document.querySelectorAll(`a[href*="${keyword}"]`).forEach(element => {
            const listItem = element.closest('li'); // Find the nearest <li> ancestor
            if (listItem) {
                const parent = listItem.parentElement; // Save the parent element
                listItem.remove(); // Remove the <li> element

                // Remove the parent if it has no remaining children
                if (parent && parent.children.length === 0) {
                    parent.remove();
                }
            }
        });
    });
}

// Function to monitor changes in the DOM and remove unwanted content dynamically
function monitorContentChanges() {
    const observer = new MutationObserver(() => {
        removeUnwantedContent(); // Remove unwanted elements whenever the DOM changes
    });

    // Start observing DOM changes
    function startObserver() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true, // Monitor changes to direct children
                subtree: true    // Monitor changes across all descendants
            });

            // Perform an initial cleanup when the observer starts
            removeUnwantedContent();
        } else {
            // Retry after a short delay if the document body is not ready
            setTimeout(startObserver, 50);
        }
    }

    startObserver(); // Initialize the observer
}

// Inject CSS to hide elements immediately
injectCSS(css);

// Run the script
monitorContentChanges();
