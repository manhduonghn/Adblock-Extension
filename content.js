// Mapping between hostname and script paths
const scriptMap = {
  "phimmoichilltv.net": "scripts/phimmoichill.js",
  "bongdaplus.vn": "scripts/bongdaplus.js",
  "vnexpress.net": "scripts/vnexpress.js",
  "youtube.com": "scripts/youtube.js",
  "phimnhanhz.com": "scripts/phimnhanh.js",
  "truyensex": {
    // Multiple domains point to the same script
    domains: ["truyensex.moe", "truyensextv1.com"],
    script: "scripts/truyensex.js"
  }
};

// Get the current hostname
const hostname = location.hostname;

// Find the matching script for the current page
let scriptToInject = null;

Object.keys(scriptMap).forEach((key) => {
  const mapping = scriptMap[key];

  if (typeof mapping === "string") {
    // Single domain case
    if (hostname.includes(key)) {
      scriptToInject = mapping;
    }
  } else if (typeof mapping === "object" && mapping.domains) {
    // Multiple domains case
    if (mapping.domains.some((domain) => hostname.includes(domain))) {
      scriptToInject = mapping.script;
    }
  }
});

// Inject the matching script if found
if (scriptToInject) {
  const scriptPath = chrome.runtime.getURL(scriptToInject);

  // Create and inject the script
  const script = document.createElement("script");
  script.src = scriptPath;
  script.type = "text/javascript";
  script.async = false; // Ensure script runs in order
  document.documentElement.appendChild(script);

  console.log(`Injected script: ${scriptPath} for host: ${hostname}`);
} else {
  console.log(`No matching script found for host: ${hostname}`);
}
