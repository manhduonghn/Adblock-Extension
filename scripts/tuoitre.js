// Inject CSS to hide ad elements
const css = `
    .box-raovat,
    .overlay-ad,
    .leaderboardtop,
    .footer__register {
        display: none !important;
    }
`;

// Add the defined CSS to the document
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);

document.querySelectorAll('div.boxraovat_catedetail.mt-20').forEach(function(element) {
    if (element.textContent.includes('Rao vặt')) {
        element.remove();
    }
});
