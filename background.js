let blockList = [];

// Hàm tải block_list.txt
async function loadBlockList() {
  try {
    const response = await fetch(chrome.runtime.getURL("custom_rules/block_list.txt"));
    const text = await response.text();
    blockList = text.split("\n").map(line => line.trim()).filter(line => line); // Loại bỏ dòng trống
    console.log("Danh sách chặn đã tải:", blockList);
  } catch (error) {
    console.error("Không thể tải block_list.txt:", error);
  }
}

// Lắng nghe và chặn các URL khớp với danh sách
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (blockList.some(rule => details.url.includes(rule))) {
      console.log(`Chặn URL: ${details.url}`);
      return { cancel: true };
    }
    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Tải block_list.txt khi extension được khởi động
chrome.runtime.onStartup.addListener(loadBlockList);
chrome.runtime.onInstalled.addListener(loadBlockList);
