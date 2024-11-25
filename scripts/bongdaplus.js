// CSS rules to hide specific sections initially if they are likely to contain unwanted content
const css = `
    .clz,
    .relates,
    .tip-lst,
    .mix-tags,
    .mix-story,
    .mix-stars,
    .mix-specs,
    .email-box,
    .mix-predict,
    .tx-cen.emobar,
    #ADMTOP,
    #aplbshare.prescript,
    div.clz:nth-of-type(1),
    div.clx:nth-of-type(14),
    div.clx:nth-of-type(16),
    div.row:nth-of-type(15),
    div.row:nth-of-type(17) {
        display: none !important;
    }
`;

// Add initial CSS
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);

// Selectively remove elements containing unwanted content
function removeUnwantedElements() {
    // Select specific elements to check for unwanted links or keywords
    const elements = document.querySelectorAll('a, li, div, section');

    const unwantedPaths = [
        "goc-check-var",
        "hau-truong-bong-da",
        "ben-ngoai-duong-piste",
        "hotgirl",
        "esports",
        "soi-keo",
        "dam-me",
        "tran-cau-vang",
        "keo-xien-tags",
        "phao-cuu-sinh-tags",
        "bong-da-phong-trao",
        "bet-of-the-day-tags",
        "nhan-dinh"
    ];

    elements.forEach(element => {
        // Check if the href or text content contains any unwanted path or keyword
        if (
            (element.href && unwantedPaths.some(path => element.href.includes(path))) ||
            unwantedPaths.some(path => element.textContent.includes(path.replace(/-/g, ' ')))
        ) {
            // Remove only the closest container of type li, div, or section
            const closestContainer = element.closest('li, div, section');
            if (closestContainer) {
                closestContainer.remove();
            } else {
                element.remove();
            }
        }
    });
}

// Run the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', removeUnwantedElements);
