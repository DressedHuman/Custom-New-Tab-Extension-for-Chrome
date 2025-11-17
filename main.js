const root = document.documentElement;
const themeBtn = document.getElementById("themeSwitcher");
const avatarImg = document.getElementById("avatarImg");
const avatarInput = document.getElementById("avatarInput");
const avatarAddBtn = document.getElementById("avatarAddBtn");
const searchInput = document.querySelector(".search-orb-input");
const suggestions = document.getElementById("suggestions");
const themeWheel = document.getElementById("theme-wheel");

const terminal = document.getElementById("terminal");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

let spaceHeld = false;
let spaceTimer = null;

const themes = [
  "theme-neon",
  "theme-sunset",
  "theme-forest",
  "theme-cyber",
  "theme-volcano",
  "theme-lunar",
  "theme-royal",
];

const blobColors = [
  [0, 255, 247], // neon
  [82, 255, 106], // forest
  [255, 58, 31], // volcano
  [110, 160, 255], // royal
  [255, 174, 111], // sunset
  [201, 201, 201], // lunar
];

const blobs = [];

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

for (let i = 0; i < 6; i++) {
  const blob = document.createElement("div");
  blob.classList.add("neon-blob");

  // Random initial color
  const color = blobColors[Math.floor(Math.random() * blobColors.length)];
  blob.dataset.color = color.join(",");

  // Random glow, blur, and opacity
  blob.glow = 15 + Math.random() * 30; // px
  blob.blur = 20 + Math.random() * 40; // px
  blob.opacity = 0.2 + Math.random() * 0.2;

  blob.style.background = `rgba(${color.join(",")},${blob.opacity})`;
  blob.style.filter = `blur(${blob.blur}px) drop-shadow(0 0 ${
    blob.glow
  }px rgba(${color.join(",")},0.5))`;

  // Random initial position
  blob.x = Math.random() * window.innerWidth;
  blob.y = Math.random() * window.innerHeight;

  // Random drift speed and direction
  blob.vx = (Math.random() - 0.5) * 0.3;
  blob.vy = (Math.random() - 0.5) * 0.3;

  // Rotation and scale
  blob.angle = Math.random() * 360;
  blob.vr = (Math.random() - 0.5) * 0.1; // rotation speed
  blob.scale = 1 + Math.random() * 0.1; // initial scale
  blob.vs = (Math.random() - 0.5) * 0.002; // scale speed

  blob.style.left = blob.x + "px";
  blob.style.top = blob.y + "px";

  document.body.appendChild(blob);
  blobs.push(blob);
}

// Animate blobs
function animateBlobs() {
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const dx = blob.x - mouse.x;
    const dy = blob.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;

    if (dist < 150) {
      const force = (150 - dist) * 0.05;
      blob.vx += (dx / dist) * force;
      blob.vy += (dy / dist) * force;
    } else if (dist < 300) {
      const force = (dist - 150) * 0.002;
      blob.vx -= (dx / dist) * force;
      blob.vy -= (dy / dist) * force;
    }

    blob.x += blob.vx;
    blob.y += blob.vy;
    blob.vx *= 0.92;
    blob.vy *= 0.92;

    if (blob.x < 0 || blob.x > window.innerWidth) blob.vx *= -1;
    if (blob.y < 0 || blob.y > window.innerHeight) blob.vy *= -1;

    blob.angle += blob.vr;
    blob.scale += blob.vs;
    if (blob.scale > 1.2 || blob.scale < 0.8) blob.vs *= -1;

    blob.style.left = blob.x + "px";
    blob.style.top = blob.y + "px";
    blob.style.transform = `translate(-50%, -50%) rotate(${blob.angle}deg) scale(${blob.scale})`;
  }
  requestAnimationFrame(animateBlobs);
}
animateBlobs();

// Animate color changes every 5 seconds with new glow/blur
setInterval(() => {
  blobs.forEach((blob) => {
    const newColor = blobColors[Math.floor(Math.random() * blobColors.length)];
    blob.glow = 15 + Math.random() * 30;
    blob.blur = 20 + Math.random() * 40;
    blob.opacity = 0.2 + Math.random() * 0.2;

    blob.style.background = `rgba(${newColor.join(",")},${blob.opacity})`;
    blob.style.filter = `blur(${blob.blur}px) drop-shadow(0 0 ${blob.glow}px rgba(${newColor.join(",")},0.5))`;
  });
}, 5000);

// Apply theme correctly
function applyTheme(theme) {
  Array.from(root.classList).forEach((cls) => {
    if (cls.startsWith("theme-")) root.classList.remove(cls);
  });
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
const themeNodes = themeWheel.querySelectorAll(".theme-node");
themeBtn.addEventListener("click", () => {
  themeWheel.classList.toggle("active");
  const radius = 75;
  themeNodes.forEach((node, i) => {
    const angle = (i / themeNodes.length) * (Math.PI * 2);
    if (themeWheel.classList.contains("active")) {
      node.style.left = 110 + Math.cos(angle) * radius + "px";
      node.style.top = 110 + Math.sin(angle) * radius + "px";
      node.style.opacity = 1;
      node.style.pointerEvents = "auto";
      node.style.transform = "scale(1)";
    } else {
      node.style.left = "110px";
      node.style.top = "110px";
      node.style.opacity = 0;
      node.style.pointerEvents = "none";
      node.style.transform = "scale(0.5)";
    }
  });
});

// Apply theme on node click
themeNodes.forEach((node) => node.addEventListener("click", () => applyTheme(node.dataset.theme)));

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
  if (!val) return suggestions.classList.remove("show");

  const matches = presetSuggestions.filter((s) => s.toLowerCase().includes(val.toLowerCase()));
  suggestions.innerHTML = matches.map((m) => `<div class='s-item'>${m}</div>`).join("");
  suggestions.classList.add("show");
  document.querySelectorAll(".s-item").forEach((item) => item.addEventListener("click", () => {
    searchInput.value = item.textContent;
    suggestions.classList.remove("show");
  }));
});

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

window.addEventListener("mousemove", (e) => spawnParticle(e.clientX, e.clientY));

function particleLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    ctx.fillStyle = `rgba(0,255,255,${Math.max(0, p.life / 60)})`;
    ctx.fillRect(p.x, p.y, 2, 2);
  }
  particles = particles.filter((p) => p.life > 0);
  requestAnimationFrame(particleLoop);
}
particleLoop();

// keep canvas sized to window
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

// TERMINAL
function openTerminal() {
  terminal.classList.remove("hidden");
  terminalInput.focus();
  terminalOutput.innerHTML += "Cyber Terminal v1.0\nType 'help' for commands.\n\n";
}
function closeTerminal() {
  terminal.classList.add("hidden");
  terminalInput.blur();
}

terminalInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const cmd = terminalInput.value.trim();
  terminalOutput.innerHTML += "> " + cmd + "\n";
  if (cmd === "help") terminalOutput.innerHTML += "Commands: theme <name>, search <query>, clear, exit\n\n";
  else if (cmd.startsWith("theme ")) {
    const name = cmd.split(" ")[1];
    const fullTheme = "theme-" + name;
    if (themes.includes(fullTheme)) {
      applyTheme(fullTheme);
      terminalOutput.innerHTML += "Theme changed.\n\n";
    } else terminalOutput.innerHTML += "Theme not found.\n\n";
  } else if (cmd.startsWith("search ")) {
    const q = cmd.replace("search ", "");
    window.location.href = "https://startpage.com/sp/search?query=" + encodeURIComponent(q);
  } else if (cmd === "clear") terminalOutput.innerHTML = "";
  else if (cmd === "exit") closeTerminal();
  else terminalOutput.innerHTML += "Unknown command.\n\n";
  terminalInput.value = "";
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
});

// SPACE HOLD TO OPEN TERMINAL
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !spaceHeld) {
    spaceHeld = true;
    spaceTimer = setTimeout(openTerminal, 2000);
  }
});
window.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    spaceHeld = false;
    clearTimeout(spaceTimer);
  }
});

// TOAST NOTIFICATIONS
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, duration);
}

// Avatar system
// Maximum avatar dimensions and file size
const MAX_AVATAR_WIDTH = 1024;
const MAX_AVATAR_HEIGHT = 1024;
const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

avatarAddBtn.addEventListener("click", () => {
  avatarInput.click();
});

// When user selects an image
avatarInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > MAX_AVATAR_WIDTH || height > MAX_AVATAR_HEIGHT) {
        const scale = Math.min(MAX_AVATAR_WIDTH / width, MAX_AVATAR_HEIGHT / height);
        width *= scale;
        height *= scale;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      let quality = 0.9;
      let base64Image = canvas.toDataURL("image/jpeg", quality);
      while (base64Image.length > MAX_FILE_SIZE * 1.37 && quality > 0.4) {
        quality -= 0.05;
        base64Image = canvas.toDataURL("image/jpeg", quality);
      }
      if (base64Image.length > MAX_FILE_SIZE * 1.37) {
        showToast("Avatar is too large even after resizing. Please choose a smaller image.");
        return;
      }
      avatarImg.style.opacity = 0;
      avatarImg.src = base64Image;
      avatarImg.onload = () => {
        avatarImg.style.transition = "opacity 0.5s";
        avatarImg.style.opacity = 1;
      };
      chrome.storage.local.set({ userAvatar: base64Image });
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Load saved avatar
chrome.storage.local.get("userAvatar", (data) => {
  if (data.userAvatar) avatarImg.src = data.userAvatar;
});
