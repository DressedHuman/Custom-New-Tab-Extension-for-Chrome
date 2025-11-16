// ------------------------------
// GLOBAL ELEMENTS
// ------------------------------

const root = document.documentElement;
const themeBtn = document.getElementById("themeSwitcher");
const searchInput = document.querySelector(".search-orb-input");
const suggestions = document.getElementById("suggestions");
const themeWheel = document.getElementById("theme-wheel");

// Terminal
const terminal = document.getElementById("terminal");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

// ------------------------------
// LOADING SCREEN FIXED
// ------------------------------

window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");
  loader.style.opacity = "0";
  setTimeout(() => (loader.style.display = "none"), 600);
});

// ------------------------------
// THEME SYSTEM
// ------------------------------

const themes = [
  "theme-neon",
  "theme-sunset",
  "theme-forest",
  "theme-cyber",
  "theme-volcano",
  "theme-lunar",
  "theme-royal",
];

function applyTheme(theme) {
  themes.forEach((t) => root.classList.remove(t));
  root.classList.add(theme);
  localStorage.setItem("selectedTheme", theme);
}

(function loadTheme() {
  const saved = localStorage.getItem("selectedTheme");
  applyTheme(themes.includes(saved) ? saved : "theme-neon");
})();

// ------------------------------
// RADIAL THEME MENU (FIXED CENTER)
// ------------------------------

themeBtn.addEventListener("click", () => {
  themeWheel.classList.toggle("active");

  const nodes = themeWheel.querySelectorAll(".theme-node");
  const radius = 90;

  const rect = themeWheel.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  nodes.forEach((node, i) => {
    const angle = (i / nodes.length) * Math.PI * 2;

    node.style.left =
      cx + Math.cos(angle) * radius - node.offsetWidth / 2 + "px";
    node.style.top =
      cy + Math.sin(angle) * radius - node.offsetHeight / 2 + "px";
  });
});

themeWheel.querySelectorAll(".theme-node").forEach((node) => {
  node.addEventListener("click", () => {
    applyTheme(node.dataset.theme);
  });
});

// ------------------------------
// SEARCH SUGGESTIONS (FIXED)
// ------------------------------

const presetSuggestions = [
  "cyber ui",
  "react projects",
  "linux terminal",
  "neon effects css",
  "javascript shortcuts",
  "chrome extension",
];

searchInput.addEventListener("input", () => {
  const val = searchInput.value.trim();
  if (!val) return suggestions.classList.remove("show");

  const matches = presetSuggestions.filter((s) =>
    s.toLowerCase().includes(val.toLowerCase())
  );

  suggestions.innerHTML = matches
    .map((m) => `<div class='s-item'>${m}</div>`)
    .join("");

  suggestions.classList.add("show");

  document.querySelectorAll(".s-item").forEach((item) => {
    item.addEventListener("click", () => {
      searchInput.value = item.textContent;
      suggestions.classList.remove("show");
    });
  });
});

// ------------------------------
// PARTICLE ENGINE (RESIZE FIXED)
// ------------------------------

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

let particles = [];

function spawnParticle(x, y) {
  particles.push({
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    life: 60,
  });
}

window.addEventListener(
  "mousemove",
  (e) => spawnParticle(e.clientX, e.clientY),
  { passive: true }
);

function particleLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    ctx.fillStyle = `rgba(0,255,255,${p.life / 60})`;
    ctx.fillRect(p.x, p.y, 2, 2);

    return p.life > 0;
  });

  requestAnimationFrame(particleLoop);
}
particleLoop();

// ------------------------------
// TERMINAL (BUG-FIXED)
// ------------------------------

function openTerminal() {
  terminal.classList.remove("hidden");
  terminalInput.focus();
  terminalOutput.innerHTML +=
    "Cyber Terminal v1.0\nType 'help' for commands.\n\n";
}

function closeTerminal() {
  terminal.classList.add("hidden");
}

terminalInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  const cmd = terminalInput.value.trim();
  terminalOutput.innerHTML += "> " + cmd + "\n";

  if (cmd === "help") {
    terminalOutput.innerHTML +=
      "Commands: theme <name>, search <query>, clear, exit\n\n";
  } else if (cmd.startsWith("theme ")) {
    const sel = "theme-" + cmd.split(" ")[1];
    if (themes.includes(sel)) {
      applyTheme(sel);
      terminalOutput.innerHTML += "Theme changed.\n\n";
    } else {
      terminalOutput.innerHTML += "Invalid theme.\n\n";
    }
  } else if (cmd.startsWith("search ")) {
    const q = cmd.replace("search ", "");
    window.location.href =
      "https://startpage.com/sp/search?query=" + encodeURIComponent(q);
  } else if (cmd === "clear") {
    terminalOutput.innerHTML = "";
  } else if (cmd === "exit") {
    closeTerminal();
  } else {
    terminalOutput.innerHTML += "Unknown command.\n\n";
  }

  terminalInput.value = "";
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
});

// HOLD SPACE TO OPEN TERMINAL
let spaceDown = false;
let spaceTimer = null;

window.addEventListener("keydown", (e) => {
  if (e.code !== "Space" || spaceDown) return;
  spaceDown = true;
  spaceTimer = setTimeout(() => openTerminal(), 2000);
});

window.addEventListener("keyup", (e) => {
  if (e.code !== "Space") return;
  spaceDown = false;
  clearTimeout(spaceTimer);
});
