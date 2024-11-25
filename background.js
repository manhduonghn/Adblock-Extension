let blockList = [];

// Hàm tải danh sách chặn từ tệp hoặc URL (ví dụ từ EasyList)
async function loadBlockList() {
  try {
    // Đọc tệp từ thư mục custom_rules hoặc tải từ URL công cộng (ví dụ EasyList)
    const response = await fetch("https://easylist.to/easylist/easylist.txt");  // URL của EasyList hoặc một danh sách khác
    const text = await response.text();
    blockList = text.split("\n").map(line => line.trim()).filter(line => line && !line.startsWith("!")); // Loại bỏ dòng chú thích
    console.log("Danh sách chặn đã tải:", blockList);

    // Chuyển đổi blockList thành định dạng của declarativeNetRequest với ID duy nhất
    const rules = blockList.map((rule, index) => ({
      id: `easylist_${index}`,  // Thêm tiền tố để đảm bảo ID duy nhất
      action: { type: "block" },
      condition: {
        urlFilter: rule,
        resourceTypes: ["main_frame", "sub_frame", "script", "image", "stylesheet"]
      }
    }));

    // Áp dụng các quy tắc chặn
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: [] // Xóa các quy tắc cũ nếu cần
    });
  } catch (error) {
    console.error("Không thể tải danh sách chặn:", error);
  }
}

// Tải danh sách chặn khi extension khởi động
chrome.runtime.onStartup.addListener(loadBlockList);
chrome.runtime.onInstalled.addListener(loadBlockList);
