const filePath = chrome.runtime.getURL("custom_rules/block_list.txt");
const existingRulesPath = chrome.runtime.getURL("rules/custom_rules.json");

Promise.all([
  fetch(filePath).then((response) => response.text()),
  fetch(existingRulesPath).then((response) => response.json()).catch(() => []), // Trường hợp file không tồn tại
])
  .then(([blockListText, existingRules]) => {
    // Parse block list
    const urlFilters = blockListText
      .split("\n")
      .filter((line) => line && !line.startsWith("!") && !line.startsWith("["))
      .map((line) => line.trim());

    // Extract existing rules and create a Set for deduplication
    const existingFilters = new Set(existingRules.map((rule) => rule.condition.urlFilter));

    // Map new URL filters to rules, skipping duplicates
    const newRules = urlFilters
      .filter((filter) => !existingFilters.has(filter)) // Add only non-existent filters 
      .map((filter, index) => ({
        id: existingRules.length + index + 1,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: filter },
      }));

    // Combine new rules with existing ones
    const updatedRules = [...existingRules, ...newRules];

    // Update dynamic rules in Chrome
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: newRules,
      removeRuleIds: [], // Do not delete existing rules 
    });

    // Save updated rules.json (requires file system handling)
    saveRulesJson(updatedRules);
  })
  .catch((error) => console.error("Error processing block list:", error));

// Function to save updated custom_rules.json
function saveRulesJson(rules) {
  const jsonBlob = new Blob([JSON.stringify(rules, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(jsonBlob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "custom_rules.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
