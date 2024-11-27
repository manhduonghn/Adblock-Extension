// Function to load and process rules
function loadAndProcessRules() {
    fetch('/custom_rules/block_list.txt')
        .then(response => response.text())
        .then(text => {
            const abpRules = text.split('\n');

            // Load rules from the files rules/rules.json and rules/custom_rules.json
            Promise.all([
                fetch('/rules/rules.json').then(res => res.json()).catch(() => []),
                fetch('/rules/custom_rules.json').then(res => res.json()).catch(() => [])
            ]).then(([rulesFromJson, customRulesFromJson]) => {
                const allExistingRules = [...rulesFromJson, ...customRulesFromJson];
                const existingRuleIds = allExistingRules.map(rule => rule.id);

                const convertedRules = convertABPtoDNR(abpRules, getMaxIdFromRules(allExistingRules) + 1);

                // Remove duplicate rules
                const uniqueRules = convertedRules.filter(rule => !existingRuleIds.includes(rule.id));

                if (uniqueRules.length > 0) {
                    // Update the new rules
                    chrome.declarativeNetRequest.updateDynamicRules({
                        removeRuleIds: allExistingRules.map(rule => rule.id),
                        addRules: uniqueRules
                    }).then(() => {
                        console.log(`Added ${uniqueRules.length} new rules from block_list.txt.`);
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
    return rules.length > 0 ? Math.max(...rules.map(rule => rule.id)) : 0;
}

// Function to convert ABP rules to DNR format
function convertABPtoDNR(abpRules, startId) {
    const dnrRules = [];
    let currentId = startId;

    abpRules.forEach(rule => {
        rule = rule.trim();

        // Skip comments or empty lines
        if (rule.startsWith('!') || rule === '') return;

        // Check and skip rules with invalid characters (non-ASCII)
        if (!/^[\x00-\x7F]+$/.test(rule)) {
            console.warn(`Skipping invalid (non-ASCII) rule: ${rule}`);
            return;
        }

        const isAllowRule = rule.startsWith('@@');
        const isCSSRule = rule.startsWith('##') || rule.startsWith('#@#');

        if (isCSSRule) {
            console.warn(`Skipping incompatible CSS rule: ${rule}`);
            return;
        }

        let urlFilter = rule.replace(/^@@/, '').replace(/^\|\|/, '').replace(/\^$/, ''); // Remove unnecessary prefixes

        const condition = {};

        // Process `$option` (e.g., `$script`, `$image`, `$third-party`)
        if (rule.includes('$')) {
            const options = rule.split('$')[1];
            const resourceTypes = [];

            if (options.includes('script')) resourceTypes.push('script');
            if (options.includes('image')) resourceTypes.push('image');
            if (options.includes('stylesheet')) resourceTypes.push('stylesheet');
            if (options.includes('subdocument')) resourceTypes.push('sub_frame');
            if (options.includes('xmlhttprequest')) resourceTypes.push('xmlhttprequest');

            if (resourceTypes.length > 0) condition.resourceTypes = resourceTypes;

            // Process domain
            if (options.includes('domain=')) {
                const domains = options.match(/domain=([^,$]+)/)[1];
                const excludedDomains = domains
                    .split('|')
                    .filter(domain => domain.startsWith('~'))
                    .map(domain => domain.replace('~', ''));

                const includedDomains = domains
                    .split('|')
                    .filter(domain => !domain.startsWith('~'));

                if (includedDomains.length > 0) condition.domains = includedDomains;
                if (excludedDomains.length > 0) condition.excludedDomains = excludedDomains;
            }

            // Process flags `~third-party` or `third-party`
            if (options.includes('third-party')) condition.domainType = 'thirdParty';
            if (options.includes('~third-party')) condition.domainType = 'firstParty';
        }

        // Process domain exclusion with `$domain=~`
        if (rule.includes('$domain=~')) {
            const excludedDomain = rule.match(/\$domain=~([^,]+)/);
            if (excludedDomain) {
                condition.excludedDomains = excludedDomain[1].split('|');
            }
        }

        // Process wildcard string conditions (*)
        if (urlFilter.includes('*')) {
            urlFilter = urlFilter.replace('*', '.*');
        }

        // Process special rules (e.g., $xmlhttprequest)
        if (rule.match(/^\/.*\$/)) {
            const specialRule = {
                id: currentId++,  // Calculate ID based on the incremented `currentId`
                priority: 1,
                action: isAllowRule ? { type: 'allow' } : { type: 'block' },
                condition: { urlFilter, ...condition }
            };
            dnrRules.push(specialRule);
        } else {
            // Process simple rules without special characters
            const simpleRule = {
                id: currentId++,  // Calculate ID based on the incremented `currentId`
                priority: 1,
                action: isAllowRule ? { type: 'allow' } : { type: 'block' },
                condition: { urlFilter }
            };
            dnrRules.push(simpleRule);
        }
    });

    console.log(`Converted ${dnrRules.length} rules from block_list.txt.`);
    return dnrRules;
}

// Run when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    loadAndProcessRules();
});
