/**
 * Scroll monitor script for Flash template
 * Sends scroll events to parent window via postMessage
 */

(function () {
  "use strict";

  let lastScrollY = 0;
  let ticking = false;

  function sendScrollEvent(scrollY) {
    // Send message to parent window
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "TEMPLATE_SCROLL_EVENT",
          scrollY: scrollY,
        },
        "*"
      );
    }
  }

  function handleScroll() {
    lastScrollY = window.scrollY || window.pageYOffset || 0;

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

  // Send initial scroll position after a brief delay
  setTimeout(() => {
    sendScrollEvent(window.scrollY || window.pageYOffset || 0);
  }, 500);
})();
