// Inject CSS to hide ad elements
const css = `
    .leaderboardtop,
    .footer__register {
        display: none !important;
    }
`;
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);
