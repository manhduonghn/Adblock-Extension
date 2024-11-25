let blockList = [];

// Hàm tải danh sách chặn từ tệp custom_rules hoặc từ URL
async function loadBlockList() {
  try {
    // Đọc tệp từ thư mục custom_rules hoặc tải từ URL công cộng (ví dụ EasyList)
    const response = await fetch(chrome.runtime.getURL("custom_rules/block_list.txt"));  // Đọc từ tệp trong extension
    const text = await response.text();
    
    // Xử lý từng dòng trong tệp và loại bỏ các dòng trống hoặc chú thích
    blockList = text.split("\n").map(line => line.trim()).filter(line => line && !line.startsWith("!"));
    console.log("Danh sách chặn đã tải:", blockList);

    // Lấy các quy tắc hiện tại từ declarativeNetRequest
    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();

    // Tìm ID tiếp theo để tránh trùng lặp
    let nextId = 1;
    if (currentRules.length > 0) {
      nextId = Math.max(...currentRules.map(rule => rule.id)) + 1; // Tìm ID lớn nhất và cộng thêm 1
    }

    // Chuyển đổi danh sách thành các quy tắc cho declarativeNetRequest
    const rules = blockList.map((rule, index) => {
      // Kiểm tra nếu rule là một URL hay tên miền, nếu có "http", thì đây là URL
      let urlFilter;
      if (rule.startsWith("http") || rule.startsWith("www")) {
        // Chuyển đổi URL sang biểu thức chính quy
        urlFilter = `^https?:\/\/.*${rule.replace(/^https?:\/\//, '').replace(/\//g, '\\/').replace(/\./g, '\\.')}$`;
      } else {
        // Nếu chỉ là tên miền, tạo biểu thức chính quy cho tên miền này
        urlFilter = `^https?:\/\/.*${rule.replace(/\./g, '\\.').replace(/\//g, '\\/').replace(/^www\./, '')}$`;
      }

      // Tạo quy tắc với ID duy nhất
      return {
        id: nextId++,  // Tăng ID từ ID cuối cùng đã lấy
        action: { type: "block" },
        condition: {
          urlFilter: urlFilter,
          resourceTypes: ["main_frame", "sub_frame", "script", "image", "stylesheet"]
        }
      };
    });

    // Áp dụng các quy tắc chặn
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: [] // Xóa các quy tắc cũ nếu cần
    });
    
    console.log(`Đã thêm ${rules.length} quy tắc chặn mới.`);
  } catch (error) {
    console.error("Không thể tải danh sách chặn:", error);
  }
}

// Tải danh sách chặn khi extension khởi động
chrome.runtime.onStartup.addListener(loadBlockList);
chrome.runtime.onInstalled.addListener(loadBlockList);
