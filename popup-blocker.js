/* Constants and Globals */
const CONSTANTS = {
  TIMEOUT_SECONDS: 15,
  TRUNCATE_LENGTH: 50,
  MODAL_WIDTH: '400px'
}

// Store reference to original window.open
const realWindowOpen = window.open;

// Fake window object to prevent JS errors
const FakeWindow = {
  blur: () => false,
  focus: () => false
};

/* Popup Blocker */
class PopupBlocker {
  static async initialize() {
    if (window.open !== realWindowOpen) return;

    // Block all popups
    window.open = (url, target, features) => {
      console.log(`[UPB] Popup blocked: ${url}`);
      return FakeWindow;
    };
  }
}

/* Initialize */
window.addEventListener('load', () => PopupBlocker.initialize());
