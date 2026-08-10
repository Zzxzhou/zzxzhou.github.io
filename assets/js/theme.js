(function () {
  "use strict";

  const storageKey = "zixi-zhou-theme";
  const root = document.documentElement;
  const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredTheme() {
    try {
      const theme = window.localStorage.getItem(storageKey);
      return theme === "light" || theme === "dark" ? theme : null;
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      // The selected theme still applies when browser storage is unavailable.
    }
  }

  function updateToggle(theme) {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    const isDark = theme === "dark";
    const nextTheme = isDark ? "light" : "dark";
    const icon = toggle.querySelector("[data-theme-icon]");

    toggle.setAttribute("aria-label", `Use ${nextTheme} theme`);
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.title = `Use ${nextTheme} theme`;

    if (icon) {
      icon.textContent = isDark ? "☀︎" : "☾";
    }
  }

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = theme === "dark" ? "#101418" : "#ffffff";
    }

    updateToggle(theme);

    if (persist) {
      storeTheme(theme);
    }
  }

  const initialTheme = getStoredTheme() || (colorSchemeQuery.matches ? "dark" : "light");
  applyTheme(initialTheme, false);

  function initializeToggle() {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    updateToggle(root.dataset.theme);
    toggle.addEventListener("click", function () {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeToggle, { once: true });
  } else {
    initializeToggle();
  }

  colorSchemeQuery.addEventListener("change", function (event) {
    if (!getStoredTheme()) {
      applyTheme(event.matches ? "dark" : "light", false);
    }
  });
})();
