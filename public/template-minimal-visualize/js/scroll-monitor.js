/**
 * Scroll monitor script for Minimal template
 * Sends scroll events to parent window via postMessage
 */

(function () {
  "use strict";

  console.log("🔍 [MINIMAL-VIZ] Scroll monitor loaded");

  let lastScrollY = 0;
  let ticking = false;

  function sendScrollEvent(scrollY) {
    console.log("📤 [MINIMAL-VIZ] Sending scroll event:", scrollY);
    // Send message to parent window
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "TEMPLATE_SCROLL_EVENT",
          scrollY: scrollY,
        },
        "*"
      );
      console.log("✅ [MINIMAL-VIZ] Message sent to parent");
    } else {
      console.warn("⚠️ [MINIMAL-VIZ] No parent window found");
    }
  }

  function handleScroll() {
    lastScrollY = window.scrollY || window.pageYOffset || 0;
    console.log("🖱️ [MINIMAL-VIZ] Scroll detected:", lastScrollY);

    if (!ticking) {
      window.requestAnimationFrame(() => {
        sendScrollEvent(lastScrollY);
        ticking = false;
      });

      ticking = true;
    }
  }

  // Listen to scroll events
  window.addEventListener("scroll", handleScroll, { passive: true });
  console.log("👂 [MINIMAL-VIZ] Scroll listener attached");

  // Send initial scroll position after a brief delay
  setTimeout(() => {
    console.log("⏰ [MINIMAL-VIZ] Sending initial scroll position");
    sendScrollEvent(window.scrollY || window.pageYOffset || 0);
  }, 500);
})();

