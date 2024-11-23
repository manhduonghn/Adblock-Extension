const filePath = chrome.runtime.getURL("custom_rules/block_list.txt");

fetch(filePath)
  .then((response) => response.text())
  .then((text) => {
    const urlFilters = text
      .split("\n")
      .filter((line) => line && !line.startsWith("!") && !line.startsWith("["))
      .map((line) => line.trim());

    const rules = urlFilters.map((filter, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: filter },
    }));

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: rules.map((rule) => rule.id),
    });
  })
  .catch((error) => console.error("Error fetching adblock list:", error));
