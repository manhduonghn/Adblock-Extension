let blockList = [];

// Hàm tải danh sách chặn từ tệp custom_rules.txt
async function loadBlockList() {
  try {
    // Đọc tệp từ thư mục custom_rules
    const response = await fetch(chrome.runtime.getURL("custom_rules/block_list.txt"));
    const text = await response.text();
    blockList = text.split("\n").map(line => line.trim()).filter(line => line); // Loại bỏ dòng trống
    console.log("Danh sách chặn đã tải:", blockList);

    // Chuyển đổi blockList thành định dạng của declarativeNetRequest
    const rules = blockList.map(rule => ({
      id: blockList.indexOf(rule),
      action: { type: "block" },
      condition: {
        urlFilter: rule,
        resourceTypes: ["main_frame", "sub_frame", "script", "image", "stylesheet"]
      }
    }));

    // Áp dụng các quy tắc chặn
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: [] // Remove existing rules if necessary
    });
  } catch (error) {
    console.error("Không thể tải danh sách chặn:", error);
  }
}

// Tải danh sách chặn khi extension khởi động
chrome.runtime.onStartup.addListener(loadBlockList);
chrome.runtime.onInstalled.addListener(loadBlockList);
