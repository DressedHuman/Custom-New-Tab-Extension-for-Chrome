// GLOBALS
const root = document.documentElement;
const themeBtn = document.getElementById("themeSwitcher");
const searchInput = document.querySelector(".search-orb-input");
const suggestions = document.getElementById("suggestions");
const themeWheel = document.getElementById("theme-wheel");

// Terminal
const terminal = document.getElementById("terminal");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

let spaceHeld = false;
let spaceTimer = null;

// LOADING SCREEN
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loading-screen");
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 1200);
});

// THEME SYSTEM
const themes = [
  "theme-forest",
  "theme-volcano",
  "theme-royal",
  "theme-aurora",
  "theme-ocean",
  "theme-sakura",
];

// Apply theme correctly
function applyTheme(theme) {
  // Remove any class starting with "theme-"
  root.classList.forEach((cls) => {
    if (cls.startsWith("theme-")) {
      root.classList.remove(cls);
    }
  });
  // Apply new theme
  root.classList.add(theme);
  localStorage.setItem("selectedTheme", theme);
}

// Load saved theme
function loadTheme() {
  const saved = localStorage.getItem("selectedTheme");
  if (themes.includes(saved)) applyTheme(saved);
  else applyTheme("theme-forest");
}
loadTheme();

// RADIAL THEME MENU
themeBtn.addEventListener("click", () => {
  themeWheel.classList.toggle("active");

  const nodes = themeWheel.querySelectorAll(".theme-node");
  const radius = 75; // slightly smaller radius

  nodes.forEach((node, i) => {
    const angle = (i / nodes.length) * (Math.PI * 2);
    if (themeWheel.classList.contains("active")) {
      node.style.left = 110 + Math.cos(angle) * radius + "px";
      node.style.top = 110 + Math.sin(angle) * radius + "px";
    } else {
      node.style.left = "110px";
      node.style.top = "110px";
    }
  });
});

themeWheel.querySelectorAll(".theme-node").forEach((node) => {
  node.addEventListener("click", () => {
    applyTheme(node.dataset.theme);
  });
});

// SEARCH SUGGESTIONS
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
  if (!val) {
    suggestions.classList.remove("show");
    return;
  }

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

// PARTICLE ENGINE
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

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

window.addEventListener("mousemove", (e) => {
  spawnParticle(e.clientX, e.clientY);
});

function particleLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    ctx.fillStyle = `rgba(0,255,255,${p.life / 60})`;
    ctx.fillRect(p.x, p.y, 2, 2);
    if (p.life <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(particleLoop);
}
particleLoop();

// TERMINAL
function openTerminal() {
  terminal.classList.remove("hidden");
  terminalInput.focus();
  terminalOutput.innerHTML +=
    "Cyber Terminal v1.0\nType 'help' for commands.\n\n";
}
function closeTerminal() {
  terminal.classList.add("hidden");
  terminalInput.blur();
}

terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = terminalInput.value.trim();
    terminalOutput.innerHTML += "> " + cmd + "\n";

    if (cmd === "help") {
      terminalOutput.innerHTML +=
        "Commands: theme <name>, search <query>, clear, exit\n\n";
    } else if (cmd.startsWith("theme ")) {
      const name = cmd.split(" ")[1];
      if (themes.includes("theme-" + name)) {
        applyTheme("theme-" + name);
        terminalOutput.innerHTML += "Theme changed.\n\n";
      } else {
        terminalOutput.innerHTML += "Theme not found.\n\n";
      }
    } else if (cmd.startsWith("search ")) {
      const q = cmd.replace("search ", "");
      window.location.href =
        "https://startpage.com/sp/search?query=" + encodeURIComponent(q);
    } else if (cmd === "clear") terminalOutput.innerHTML = "";
    else if (cmd === "exit") closeTerminal();
    else terminalOutput.innerHTML += "Unknown command.\n\n";

    terminalInput.value = "";
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
});

// SPACE HOLD TO OPEN TERMINAL
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !spaceHeld) {
    spaceHeld = true;
    spaceTimer = setTimeout(() => {
      openTerminal();
    }, 2000);
  }
});
window.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    spaceHeld = false;
    clearTimeout(spaceTimer);
  }
});
