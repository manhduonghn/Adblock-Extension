const filePath = chrome.runtime.getURL("custom_rules/block_list.txt");

fetch(filePath)
  .then((response) => response.text())
  .then((blockListText) =>
    getExistingRulesFromStorage().then((existingRules) => {
      // Parse block list
      const urlFilters = blockListText
        .split("\n")
        .filter((line) => line && !line.startsWith("!") && !line.startsWith("["))
        .map((line) => line.trim());

      // Extract existing rules and create a Set for deduplication
      const existingFilters = new Set(
        existingRules.map((rule) => rule.condition.urlFilter)
      );

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

      // Save updated rules to chrome.storage
      saveRulesToStorage(updatedRules);
    })
  )
  .catch((error) => console.error("Error processing block list:", error));
