(function () {
  "use strict";

  const publicThreshold = 1000;

  function parseCount(value) {
    const digits = String(value || "").replace(/[^0-9]/g, "");
    if (!digits) return null;

    const count = Number.parseInt(digits, 10);
    return Number.isFinite(count) ? count : null;
  }

  function initializeVisitCounter() {
    const counter = document.querySelector("[data-visit-counter]");
    const countElement = document.querySelector("[data-visit-count]");
    if (!counter || !countElement) return;

    const updateCounter = function () {
      const count = parseCount(countElement.textContent);
      if (count === null || count < publicThreshold) return;

      countElement.textContent = new Intl.NumberFormat("en-US").format(count);
      counter.hidden = false;
      observer.disconnect();
    };

    const observer = new MutationObserver(updateCounter);
    observer.observe(countElement, {
      childList: true,
      characterData: true,
      subtree: true
    });

    updateCounter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeVisitCounter, { once: true });
  } else {
    initializeVisitCounter();
  }
})();
