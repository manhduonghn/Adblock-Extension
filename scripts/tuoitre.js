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
