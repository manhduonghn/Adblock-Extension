// Hàm xóa quảng cáo
function removeSponsoredElements() {
  // 1. Xóa các thẻ <a> có `rel="sponsored"`
  document.querySelectorAll('a[rel="sponsored"]').forEach((ad) => ad.remove());

  // 2. Xóa các thẻ <span> có chứa "Tin tài trợ"
  document.querySelectorAll('span').forEach((span) => {
    if (span.textContent.includes("Tin tài trợ")) {
      // Xóa phần tử cha hoặc cả vùng chứa quảng cáo
      const parent = span.closest('div'); // Tìm thẻ cha gần nhất chứa nội dung
      if (parent) parent.remove(); // Xóa vùng chứa nếu có
      else span.remove(); // Nếu không có thẻ cha, chỉ xóa span
    }
  });
}

// Quan sát DOM để phát hiện thay đổi (lazy-loading hoặc dynamic ads)
const observer = new MutationObserver(() => {
  removeSponsoredElements();
});

// Bắt đầu quan sát toàn bộ body
observer.observe(document.body, { childList: true, subtree: true });

// Chạy hàm ngay khi tải trang
removeSponsoredElements();
