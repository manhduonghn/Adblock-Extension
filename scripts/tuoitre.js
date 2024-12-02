// Inject CSS to hide ad elements
const css = `
    .box-raovat,
    .overlay-ad,
    #LeaderBoardTop,
    .footer__register,
    .footer__m-right,
    .detail__cmain .detail-follow-gg {
        display: none !important;
    }
`;

// Add the defined CSS to the document
const style = document.createElement('style');
style.textContent = css;
document.documentElement.appendChild(style);

// Hàm loại bỏ phần tử dựa trên từ khóa "Rao vặt"
function removeRaoVat() {
    document.querySelectorAll('div.boxraovat_catedetail.mt-20').forEach(function(element) {
        if (element.textContent.includes('Rao vặt')) {
            element.remove();
        }
    });
}

// Gọi hàm lần đầu để xóa các phần tử hiện tại
removeRaoVat();

// Quan sát các thay đổi trong DOM
const observer = new MutationObserver(() => {
    removeRaoVat(); // Xóa nếu phát hiện phần tử mới xuất hiện
});

// Bắt đầu quan sát toàn bộ body
observer.observe(document.body, { childList: true, subtree: true });
