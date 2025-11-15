// Focus search bar on "/"
document.addEventListener("keydown", (e) => {
  if (e.key === "/") {
    e.preventDefault();
    const input = document.querySelector(".search-input");
    if (input) input.focus();
  }
});

// Themes
const themes = [
  "theme-fixed",
  "theme-synthwave",
  "theme-forest",
  "theme-oceanic",
  "theme-volcano",
  "theme-lunar",
  "theme-candy",
  "theme-terminal",
  "theme-sakura",
  "theme-royal",
];

const root = document.documentElement;

function applyTheme(theme) {
  themes.forEach((t) => root.classList.remove(t));
  root.classList.add(theme);
  localStorage.setItem("selectedTheme", theme);
}

function loadTheme() {
  const saved = localStorage.getItem("selectedTheme");
  applyTheme(saved && themes.includes(saved) ? saved : themes[0]);
}

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  document.getElementById("themeSwitcher").addEventListener("click", () => {
    const current = localStorage.getItem("selectedTheme") || themes[0];
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    applyTheme(next);
  });
});
