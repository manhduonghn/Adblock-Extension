// CSS rules to hide ad elements
const css = ` 
    .banner-top,
    .ad-container,
    #popup-giua-man-hinh {
       display: none !important;
    }
`;

// Create a <style> element
const style = document.createElement('style');
style.textContent = css;

// Inject the style into the HTML head
document.documentElement.appendChild(style);

// Function to redirect if the URL contains "embed.html?link="
function redirectVideoLink() {
    const match = window.location.href.match(/embed\.html\?link=([^&]*)/);
    if (match) {
        const videoLink = decodeURIComponent(match[1]);
        window.location.href = videoLink; // Redirect to the decoded video link
    }
}

// Call the redirect function if necessary
redirectVideoLink();
