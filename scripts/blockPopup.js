(function () {
    // Theo dõi các sự kiện mở cửa sổ hoặc điều hướng
    const blockedPatterns = [
        /https?:\/\/[a-z]{8,15}\.(com|net)\/(?:\d{1,3}\/)?tag\.min\.js/,
        /\/ads\/popup/,
        /https?:\/\/[a-z-]{6,15}\.(com|net|tv|xyz)\/(?:40[01]|50?0?)\/\d{6,7}/
    ];

    // Chặn hành vi mở cửa sổ mới (pop-up)
    window.open = function (url) {
        if (blockedPatterns.some((pattern) => pattern.test(url))) {
            console.warn("Blocked pop-up: " + url);
            return null;
        }
        return window.open(url);
    };

    // Theo dõi thay đổi DOM để phát hiện các iframe hoặc thẻ script độc hại
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === "IFRAME" || node.tagName === "SCRIPT") {
                    const src = node.src || "";
                    if (blockedPatterns.some((pattern) => pattern.test(src))) {
                        console.warn("Blocked element: " + src);
                        node.remove();
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Theo dõi các yêu cầu chuyển hướng
    window.addEventListener("beforeunload", (e) => {
        const redirectURL = e.target.URL;
        if (blockedPatterns.some((pattern) => pattern.test(redirectURL))) {
            console.warn("Blocked redirect: " + redirectURL);
            e.preventDefault();
        }
    });
})();
