// Function to load and process rules
function loadAndProcessRules() {
    fetch('/custom_rules/block_list.txt')
        .then(response => response.text())
        .then(text => {
            const abpRules = text.split('\n');

            // Load rules from the files rules/rules.json and rules/custom_rules.json
            Promise.all([
                fetch('/rules/rules.json').then(res => res.json()).catch(() => []),
                fetch('/rules/custom_rules.json').then(res => res.json()).catch(() => []),
                // Load previously added rule IDs from storage
                new Promise(resolve => {
                    chrome.storage.local.get('addedRuleIds', (result) => {
                        resolve(result.addedRuleIds || []);
                    });
                })
            ]).then(([rulesFromJson, customRulesFromJson, addedRuleIds]) => {
                // Combine all existing rules
                const allExistingRules = [...rulesFromJson, ...customRulesFromJson];

                // Convert ABP rules to DNR format
                const convertedRules = convertABPtoDNR(abpRules, getMaxIdFromRules(allExistingRules) + 1);

                // Remove duplicate rules by content or ID
                const uniqueRules = convertedRules.filter(newRule => 
                    !allExistingRules.some(existingRule => areRulesEqual(existingRule, newRule)) &&
                    !addedRuleIds.includes(newRule.id)  // Skip already added rules
                );

                if (uniqueRules.length > 0) {
                    // Update the new rules in Chrome
                    chrome.declarativeNetRequest.updateDynamicRules({
                        removeRuleIds: allExistingRules.map(rule => rule.id),
                        addRules: uniqueRules
                    }).then(() => {
                        console.log(`Added ${uniqueRules.length} new rules from block_list.txt.`);

                        // Store the newly added rule IDs in local storage
                        const updatedAddedRuleIds = [...addedRuleIds, ...uniqueRules.map(rule => rule.id)];
                        chrome.storage.local.set({ addedRuleIds: updatedAddedRuleIds });
                    }).catch(error => {
                        console.error("Error updating rules:", error);
                    });
                } else {
                    console.log("No new rules to add.");
                }
            }).catch(error => {
                console.error("Error loading current rules:", error);
            });
        })
        .catch(error => {
            console.error("Unable to read block_list.txt:", error);
        });
}

// Function to get the highest ID from the current rules
function getMaxIdFromRules(rules) {
    // Return the highest ID found in the rules array, or 0 if no rules exist
    return rules.length > 0 ? Math.max(...rules.map(rule => rule.id)) : 0;
}

// Function to compare two rules for equality
function areRulesEqual(rule1, rule2) {
    // Compare rules based on content, ignoring ID
    return (
        rule1.priority === rule2.priority &&
        JSON.stringify(rule1.action) === JSON.stringify(rule2.action) &&
        JSON.stringify(rule1.condition) === JSON.stringify(rule2.condition)
    );
}

// Function to convert ABP rules to DNR format
function convertABPtoDNR(abpRules, startId) {
    const dnrRules = [];
    let currentId = startId;

    abpRules.forEach(rule => {
        rule = rule.trim();

        // Skip empty lines or comments
        if (rule.startsWith('!') || rule === '') return;

        // Skip invalid (non-ASCII) rules
        if (!/^[\x00-\x7F]+$/.test(rule)) {
            console.warn(`Skipping invalid (non-ASCII) rule: ${rule}`);
            return;
        }

        const isAllowRule = rule.startsWith('@@');
        const isCSSRule = rule.startsWith('##') || rule.startsWith('#@#');

        // Skip CSS rules as they are incompatible with DNR
        if (isCSSRule) {
            console.warn(`Skipping incompatible CSS rule: ${rule}`);
            return;
        }

        // Clean up rule formatting (remove '@@' and '||', handle domain exclusions)
        let urlFilter = rule.replace(/^@@/, '').replace(/^\|\|/, '').replace(/\^$/, '').replace(/\^/, '/');
        const condition = {};

        // Process $options (e.g., $script, $image, $third-party)
        if (rule.includes('$')) {
            const options = rule.split('$')[1];
            const resourceTypes = [];

            if (options.includes('script')) resourceTypes.push('script');
            if (options.includes('image')) resourceTypes.push('image');
            if (options.includes('stylesheet')) resourceTypes.push('stylesheet');
            if (options.includes('subdocument')) resourceTypes.push('sub_frame');
            if (options.includes('xmlhttprequest')) resourceTypes.push('xmlhttprequest');

            if (resourceTypes.length > 0) condition.resourceTypes = resourceTypes;

            // Handle domain inclusion and exclusion
            if (options.includes('domain=')) {
                const domainPart = options.match(/domain=([^,$]+)/)[1];
                const excludedDomains = [];
                const includedDomains = [];

                // Split domains by '|' and separate excluded ones (those starting with '~')
                domainPart.split('|').forEach(domain => {
                    if (domain.startsWith('~')) {
                        excludedDomains.push(domain.slice(1));  // Remove '~'
                    } else {
                        includedDomains.push(domain);
                    }
                });

                if (includedDomains.length > 0) condition.domains = includedDomains;
                if (excludedDomains.length > 0) condition.excludedDomains = excludedDomains;
            }

            // Handle domain type flags
            if (options.includes('third-party')) condition.domainType = 'thirdParty';
            if (options.includes('~third-party')) condition.domainType = 'firstParty';
        }

        // Handle wildcard (*) replacement in URL filters
        if (urlFilter.includes('*')) {
            urlFilter = urlFilter.replace('*', '.*');
        }

        // Create the rule in DNR format, no 'rewrite' property allowed
        const newRule = {
            id: currentId++, // Assign a unique ID
            priority: 1,
            action: isAllowRule ? { type: 'allow' } : { type: 'block' },
            condition: { urlFilter, ...condition }
        };

        dnrRules.push(newRule);
    });

    console.log(`Converted ${dnrRules.length} rules from ABP.`);
    return dnrRules;
}

// Run when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    loadAndProcessRules();
});
