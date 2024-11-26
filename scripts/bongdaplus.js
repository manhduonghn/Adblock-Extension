// CSS rules to hide specific sections initially if they are likely to contain unwanted content
const css = `
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

(function removeUnwantedElements() {
    const unwantedPaths = [
        "phui.bongdaplus.vn", "mansion-sports",
        "chuyen-de/phong-trao", "tip-tu-chuyen-gia",
        "goc-check-var", "hau-truong-bong-da",
        "ben-ngoai-duong-piste", "hotgirl", "esports",
        "soi-keo", "dam-me", "tran-cau-vang",
        "keo-xien-tags", "phao-cuu-sinh-tags",
        "bong-da-phong-trao", "bet-of-the-day-tags", "nhan-dinh"
    ];

    // Observe DOM as changes occur
    const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll('a, li, div, section');
        elements.forEach(element => {
            if (
                (element.href && unwantedPaths.some(path => element.href.includes(path))) ||
                unwantedPaths.some(path => element.textContent.includes(path.replace(/-/g, ' ')))
            ) {
                const closestContainer = element.closest('li, div, section');
                if (closestContainer) {
                    closestContainer.remove();
                } else {
                    element.remove();
                }
            }
        });
    });

    // View the entire document
    observer.observe(document, { childList: true, subtree: true });
})();
