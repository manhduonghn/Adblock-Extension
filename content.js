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

// Get the current hostname
const hostname = location.hostname;

// List of excluded hostnames
const excludedHostnames = [
  "revanced-nonroot.timie.workers.dev",
  "github.com"
];

// Function to inject script
function injectScript(scriptPath) {
  const script = document.createElement("script");
  script.src = scriptPath;
  script.type = "text/javascript";
  script.async = false; // Ensure the script runs in order
  document.documentElement.appendChild(script);
  console.log(`Injected script: ${scriptPath} for host: ${hostname}`);
}

// If hostname is not excluded, determine script to inject
if (!excludedHostnames.includes(hostname)) {
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

  if (scriptToInject) {
    const scriptPath = chrome.runtime.getURL(`scripts/${scriptToInject}`);
    injectScript(scriptPath);
  } else {
    // Default to cosmetic.js if no match found
    const scriptPath = chrome.runtime.getURL("scripts/cosmetic.js");
    injectScript(scriptPath);
    console.log("No specific script found. Injected cosmetic.js.");
  }
} else {
  console.log(`Hostname ${hostname} is excluded. No script injected.`);
}
