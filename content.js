// Mapping between hostname and script paths
const scriptMap = {
  "phimmoichilltv.net": "phimmoichill.js",
  "bongdaplus.vn": "bongdaplus.js",
  "vnexpress.net": "vnexpress.js",
  "youtube.com": "youtube.js",
  "phimnhanhz.com": "phimnhanh.js",
  "truyensex": {
    domains: ["truyensex.moe", "truyensextv1.com"],
    script: "truyensex.js"
  }
};

// Function to inject script
function injectScript(scriptPath) {
  const script = document.createElement("script");
  script.src = scriptPath;
  script.type = "text/javascript";
  script.async = false; // Ensure the script runs in order
  document.documentElement.appendChild(script);
  console.log(`Injected script: ${scriptPath}`);
}

// Get the current hostname
const hostname = location.hostname;

// Determine script to inject
let scriptToInject = null;

for (const [key, value] of Object.entries(scriptMap)) {
  if (typeof value === "string" && hostname === key) {
    scriptToInject = value;
    break; // Exit loop when match is found
  } else if (typeof value === "object" && value.domains) {
    if (value.domains.includes(hostname)) {
      scriptToInject = value.script;
      break; // Exit loop when match is found
    }
  }
}

// Inject the script if a match is found
if (scriptToInject) {
  const scriptPath = chrome.runtime.getURL(`scripts/${scriptToInject}`);
  injectScript(scriptPath);
}
