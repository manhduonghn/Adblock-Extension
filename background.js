let blockList = [];

// Hàm tải danh sách chặn từ tệp custom_rules.txt
async function loadBlockList() {
  try {
    // Đọc tệp từ thư mục custom_rules
    const response = await fetch(chrome.runtime.getURL("custom_rules/block_list.txt"));
    const text = await response.text();
    blockList = text.split("\n").map(line => line.trim()).filter(line => line); // Loại bỏ dòng trống
    console.log("Danh sách chặn đã tải:", blockList);
  } catch (error) {
    console.error("Không thể tải danh sách chặn:", error);
  }
}

// Chặn các URL khớp với danh sách
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Kiểm tra nếu URL khớp với bất kỳ rule nào trong blockList
    for (let rule of blockList) {
      // Sử dụng biểu thức chính quy để so khớp URL
      const regex = new RegExp(rule, "i"); // "i" là chế độ không phân biệt hoa/thường
      if (regex.test(details.url)) {
        console.log(`Chặn URL: ${details.url}`);
        return { cancel: true };
      }
    }
    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Tải danh sách chặn khi extension khởi động
chrome.runtime.onStartup.addListener(loadBlockList);
chrome.runtime.onInstalled.addListener(loadBlockList);
