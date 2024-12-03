// Hàm gỡ bỏ các phần tử chứa quảng cáo
function removeSponsoredElements() {
    // Tìm các thẻ <a> với thuộc tính `rel="sponsored"`
    const sponsoredLinks = document.querySelectorAll('a[rel="sponsored"]');
    sponsoredLinks.forEach(link => link.remove());

    // Tìm các phần tử có nội dung chứa "Tin tài trợ"
    const sponsoredTexts = document.querySelectorAll('span, div, p');
    sponsoredTexts.forEach(element => {
        if (element.textContent.trim().includes("Tin tài trợ")) {
            element.remove(); // Xóa phần tử nếu nội dung chứa "Tin tài trợ"
        }
    });
}

// Sử dụng MutationObserver để xử lý phần tử được tải động
const observer = new MutationObserver(() => {
    removeSponsoredElements();
});

// Quan sát toàn bộ body để phát hiện các thay đổi trong DOM
observer.observe(document.body, { childList: true, subtree: true });

// Chạy ngay khi tải trang
removeSponsoredElements();
