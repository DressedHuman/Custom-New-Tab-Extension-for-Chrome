const root = document.documentElement;
const avatarImg = document.getElementById("avatarImg");
const avatarInput = document.getElementById("avatarInput");
const avatarAddBtn = document.getElementById("avatarAddBtn");
const searchInput = document.querySelector(".search-orb-input");

// Focus search bar on '/' key press
window.addEventListener('keydown', (e) => {
  // Ignore if typing in an input, textarea, or contenteditable
  const active = document.activeElement;
  if (
    e.key === '/' &&
    !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey &&
    active !== searchInput &&
    !(active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable))
  ) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select && searchInput.select();
  }
});
const suggestions = document.getElementById("suggestions");
const avatarFrame = document.querySelector('.avatar-frame');
const DEFAULT_NAME = 'New Tab User';
const DEFAULT_TITLE = 'Web Developer';
const profileName = document.getElementById('profileName');
const profileTitle = document.getElementById('profileTitle');

const terminal = document.getElementById("terminal");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

let spaceHeld = false;
let spaceTimer = null;
let blobsEnabled = true;
let particlesEnabled = true;

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
blobsEnabled = true;
let blobsMovementEnabled = true;
let blobsInteractionEnabled = true;
let blobsRandomPositionEnabled = true;

const DEFAULT_BLOB_POSITIONS = [
  { x: 10, y: 15 },
  { x: 85, y: 10 },
  { x: 15, y: 85 },
  { x: 90, y: 80 },
  { x: 30, y: 50 },
  { x: 70, y: 45 }
];

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
  blob.style.filter = `blur(${blob.blur}px) drop-shadow(0 0 ${blob.glow
    }px rgba(${color.join(",")},0.5))`;

  // Initial position
  const savedRandom = localStorage.getItem("blobsRandomPositionEnabled");
  blobsRandomPositionEnabled = savedRandom === null ? true : (savedRandom === "true");

  if (blobsRandomPositionEnabled) {
    blob.x = Math.random() * window.innerWidth;
    blob.y = Math.random() * window.innerHeight;
  } else {
    const pos = DEFAULT_BLOB_POSITIONS[i % DEFAULT_BLOB_POSITIONS.length];
    blob.x = (pos.x / 100) * window.innerWidth;
    blob.y = (pos.y / 100) * window.innerHeight;
  }

  // Random drift speed and direction
  blob.vx = (Math.random() - 0.5) * 0.3;
  blob.vy = (Math.random() - 0.5) * 0.3;

  // Rotation and scale
  blob.angle = Math.random() * 360;
  blob.vr = (Math.random() - 0.5) * 0.1; // rotation speed
  blob.scale = 1 + Math.random() * 0.1; // initial scale
  blob.vs = (Math.random() - 0.5) * 0.002; // scale speed

  blob.style.left = "0px";
  blob.style.top = "0px";
  blob.style.transform = `translate3d(${blob.x}px, ${blob.y}px, 0) translate(-50%, -50%) scale(${blob.scale})`;

  document.body.appendChild(blob);
  blobs.push(blob);
}

// Animate blobs
function animateBlobs() {
  if (!blobsEnabled) {
    requestAnimationFrame(animateBlobs);
    return;
  }
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const dx = blob.x - mouse.x;
    const dy = blob.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;

    if (blobsInteractionEnabled) {
      if (dist < 150) {
        const force = (150 - dist) * 0.05;
        blob.vx += (dx / dist) * force;
        blob.vy += (dy / dist) * force;
      } else if (dist < 300) {
        const force = (dist - 150) * 0.002;
        blob.vx -= (dx / dist) * force;
        blob.vy -= (dy / dist) * force;
      }
    }

    if (blobsMovementEnabled) {
      blob.x += blob.vx;
      blob.y += blob.vy;
      blob.vx *= 0.92;
      blob.vy *= 0.92;

      if (blob.x < 0 || blob.x > window.innerWidth) blob.vx *= -1;
      if (blob.y < 0 || blob.y > window.innerHeight) blob.vy *= -1;

      blob.angle += blob.vr;
      blob.scale += blob.vs;
      if (blob.scale > 1.2 || blob.scale < 0.8) blob.vs *= -1;
    }

    blob.style.transform = `translate3d(${blob.x}px, ${blob.y}px, 0) translate(-50%, -50%) rotate(${blob.angle}deg) scale(${blob.scale})`;
  }
  requestAnimationFrame(animateBlobs);
}
animateBlobs();



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

// Load saved profile name and title
function loadProfile() {
  chrome.storage.local.get(["userName", "userTitle"], (data) => {
    if (profileName) profileName.textContent = data.userName || DEFAULT_NAME;
    if (profileTitle) profileTitle.textContent = data.userTitle || DEFAULT_TITLE;
  });
}
loadProfile();

// Save helpers
function saveProfileName() {
  if (!profileName) return;
  const val = profileName.textContent.trim() || DEFAULT_NAME;
  profileName.textContent = val;
  chrome.storage.local.set({ userName: val });
  showToast("Name saved", 1200);
}

function saveProfileTitle() {
  if (!profileTitle) return;
  const val = profileTitle.textContent.trim() || DEFAULT_TITLE;
  profileTitle.textContent = val;
  chrome.storage.local.set({ userTitle: val });
  showToast("Title saved", 1200);
}

// Inline editing: save on blur or Enter
if (profileName) {
  profileName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      profileName.blur();
    }
  });
  profileName.addEventListener('blur', saveProfileName);
}

if (profileTitle) {
  profileTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      profileTitle.blur();
    }
  });
  profileTitle.addEventListener('blur', saveProfileTitle);
}



// SEARCH SUGGESTIONS
// SEARCH SUGGESTIONS
let debounceTimer;

async function fetchSuggestions(query) {
  if (!query) return [];
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "fetchSuggestions", query }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Runtime error:", chrome.runtime.lastError);
        resolve([]);
        return;
      }
      if (response && response.success) {
        resolve(response.data);
      } else {
        console.error("Background fetch failed:", response ? response.error : "Unknown error");
        resolve([]);
      }
    });
  });
}

searchInput.addEventListener("input", () => {
  const val = searchInput.value.trim();
  if (!val) {
    suggestions.classList.remove("show");
    return;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const matches = await fetchSuggestions(val);
    if (matches.length > 0) {
      suggestions.innerHTML = matches.map((m) => `<div class='s-item'>${m}</div>`).join("");
      suggestions.classList.add("show");
      document.querySelectorAll(".s-item").forEach((item) => item.addEventListener("click", () => {
        searchInput.value = item.textContent;
        suggestions.classList.remove("show");
        // Optional: Auto-submit on click
        // searchForm.submit(); 
      }));
    } else {
      suggestions.classList.remove("show");
    }
  }, 300); // 300ms debounce
});

// Search form behavior: if input is a URL, navigate directly; otherwise search on StartPage
const searchForm = document.querySelector('.search-orb-wrapper');
// Validate whether a string is a syntactically valid URL (try strict parsing first,
// then attempt with an https:// prefix for host-only inputs like example.com).
function isValidURL(q) {
  if (!q) return false;
  // direct parse (requires protocol)
  try { new URL(q); return true; } catch (e) { }
  // reject obvious non-URLs with spaces
  if (/\s/.test(q)) return false;
  // basic domain-like check (contains a dot and at least 2 char TLD)
  if (!/^[^\s]+\.[^\s]{2,}$/i.test(q)) return false;
  // attempt to parse with https://
  try {
    const u = new URL('https://' + q);
    // validate the TLD/last label conservatively: allow 2-letter ccTLDs or a small allowlist
    const hostParts = u.hostname.split('.');
    const last = hostParts[hostParts.length - 1].toLowerCase();
    // allow two-letter country codes
    if (/^[a-z]{2}$/.test(last)) return true;
    // common TLD allowlist (keeps list small to avoid false positives like 'vercel')
    const allowed = new Set(['com', 'net', 'org', 'io', 'app', 'dev', 'tech', 'ai', 'co', 'me', 'info', 'biz', 'edu', 'gov', 'xyz', 'online', 'site', 'cloud', 'store']);
    if (allowed.has(last)) return true;
    return false;
  } catch (e) { return false; }
}

if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (searchInput && searchInput.value || '').trim();
    if (!q) return;
    if (isValidURL(q)) {
      const final = /^https?:\/\//i.test(q) ? q : 'https://' + q;
      window.location.href = final;
      return;
    }
    // fallback: search on StartPage
    window.location.href = 'https://www.startpage.com/sp/search?query=' + encodeURIComponent(q);
  });
}


const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

particlesEnabled = true;
let mouseParticlesEnabled = true;
let autoParticlesEnabled = true;
let particles = [];

// --- Invisible random walker for particle trail ---
const walker = {
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  angle: Math.random() * Math.PI * 2,
  speed: 2.2,
  turnRate: 0.12 + Math.random() * 0.08,
};

function moveWalker() {
  // Randomly change direction a bit
  walker.angle += (Math.random() - 0.5) * walker.turnRate;
  walker.x += Math.cos(walker.angle) * walker.speed;
  walker.y += Math.sin(walker.angle) * walker.speed;
  // Bounce off edges
  if (walker.x < 0) { walker.x = 0; walker.angle = Math.PI - walker.angle; }
  if (walker.x > canvas.width) { walker.x = canvas.width; walker.angle = Math.PI - walker.angle; }
  if (walker.y < 0) { walker.y = 0; walker.angle = -walker.angle; }
  if (walker.y > canvas.height) { walker.y = canvas.height; walker.angle = -walker.angle; }
}


function spawnParticle(x, y, color = '0,255,255', randomVel = false) {
  particles.push({
    x,
    y,
    vx: randomVel ? (Math.random() - 0.5) * 2 : 0,
    vy: randomVel ? (Math.random() - 0.5) * 2 : 0,
    life: 60,
    color,
  });
}


// Mouse trail as before (cyan, random velocity)
window.addEventListener("mousemove", (e) => {
  if (particlesEnabled && mouseParticlesEnabled) {
    spawnParticle(e.clientX, e.clientY, '0,255,255', true);
  }
});

function particleLoop() {
  if (!particlesEnabled) {
    requestAnimationFrame(particleLoop);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Move walker and spawn a particle at its position (same as mouse: cyan, random velocity)
  if (autoParticlesEnabled) {
    moveWalker();
    spawnParticle(walker.x, walker.y, '0,255,255', true);
  }
  // Draw and update all particles
  // Draw and update all particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.fillStyle = `rgba(${p.color},${Math.max(0, p.life / 60)})`;
    ctx.fillRect(p.x, p.y, 2, 2);
  }
  // particles = particles.filter((p) => p.life > 0); // Removed for performance
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
      if (avatarFrame) avatarFrame.classList.add('has-avatar');
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
  if (data.userAvatar) {
    avatarImg.src = data.userAvatar;
    if (avatarFrame) avatarFrame.classList.add('has-avatar');
  }
});

// --- SETTINGS LOGIC ---
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");
const blobToggle = document.getElementById("blobToggle");
const blobMovementToggle = document.getElementById("blobMovementToggle");
const blobInteractionToggle = document.getElementById("blobInteractionToggle");
const blobRandomPositionToggle = document.getElementById("blobRandomPositionToggle");
const blobSubSettings = document.getElementById("blobSubSettings");

const particleToggle = document.getElementById("particleToggle");
const mouseParticleToggle = document.getElementById("mouseParticleToggle");
const autoParticleToggle = document.getElementById("autoParticleToggle");
const particleSubSettings = document.getElementById("particleSubSettings");
const themeOptions = document.querySelectorAll(".theme-option");

// Open/Close Settings
settingsBtn.addEventListener("click", () => {
  settingsModal.classList.remove("hidden");
  // Update UI state to match current settings
  updateSettingsUI();
});

closeSettings.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.add("hidden");
  }
});

function updateSettingsUI() {
  // Update animation toggles
  blobToggle.checked = blobsEnabled;
  blobMovementToggle.checked = blobsMovementEnabled;
  blobInteractionToggle.checked = blobsInteractionEnabled;
  blobRandomPositionToggle.checked = blobsRandomPositionEnabled;

  particleToggle.checked = particlesEnabled;
  mouseParticleToggle.checked = mouseParticlesEnabled;
  autoParticleToggle.checked = autoParticlesEnabled;

  // Handle sub-settings visibility/state
  if (blobsEnabled) {
    blobSubSettings.classList.remove("disabled-setting");
  } else {
    blobSubSettings.classList.add("disabled-setting");
  }

  if (particlesEnabled) {
    particleSubSettings.classList.remove("disabled-setting");
  } else {
    particleSubSettings.classList.add("disabled-setting");
  }

  // Update active theme
  const currentTheme = localStorage.getItem("selectedTheme") || "theme-forest";
  themeOptions.forEach(opt => {
    if (opt.dataset.theme === currentTheme) {
      opt.classList.add("active");
    } else {
      opt.classList.remove("active");
    }
  });
}

// Theme Selection in Settings
themeOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    const theme = opt.dataset.theme;
    applyTheme(theme);
    updateSettingsUI();
  });
});

// Animation Toggles
blobToggle.addEventListener("change", (e) => {
  blobsEnabled = e.target.checked;
  localStorage.setItem("blobsEnabled", blobsEnabled);
  toggleBlobs(blobsEnabled);
  updateSettingsUI();
});

blobMovementToggle.addEventListener("change", (e) => {
  blobsMovementEnabled = e.target.checked;
  localStorage.setItem("blobsMovementEnabled", blobsMovementEnabled);
});

blobInteractionToggle.addEventListener("change", (e) => {
  blobsInteractionEnabled = e.target.checked;
  localStorage.setItem("blobsInteractionEnabled", blobsInteractionEnabled);
});

blobRandomPositionToggle.addEventListener("change", (e) => {
  blobsRandomPositionEnabled = e.target.checked;
  localStorage.setItem("blobsRandomPositionEnabled", blobsRandomPositionEnabled);
});

particleToggle.addEventListener("change", (e) => {
  particlesEnabled = e.target.checked;
  localStorage.setItem("particlesEnabled", particlesEnabled);
  toggleParticles(particlesEnabled);
  updateSettingsUI();
});

mouseParticleToggle.addEventListener("change", (e) => {
  mouseParticlesEnabled = e.target.checked;
  localStorage.setItem("mouseParticlesEnabled", mouseParticlesEnabled);
});

autoParticleToggle.addEventListener("change", (e) => {
  autoParticlesEnabled = e.target.checked;
  localStorage.setItem("autoParticlesEnabled", autoParticlesEnabled);
});

function toggleBlobs(enabled) {
  if (enabled) {
    document.body.classList.remove("no-blob-anim");
  } else {
    document.body.classList.add("no-blob-anim");
  }
}

function toggleParticles(enabled) {
  if (enabled) {
    document.body.classList.remove("no-particle-anim");
  } else {
    document.body.classList.add("no-particle-anim");
  }
}

// Load Settings
function loadSettings() {
  const savedBlobs = localStorage.getItem("blobsEnabled");
  blobsEnabled = savedBlobs === null ? true : (savedBlobs === "true");
  toggleBlobs(blobsEnabled);

  const savedParticles = localStorage.getItem("particlesEnabled");
  particlesEnabled = savedParticles === null ? true : (savedParticles === "true");
  toggleParticles(particlesEnabled);

  const savedMouseP = localStorage.getItem("mouseParticlesEnabled");
  mouseParticlesEnabled = savedMouseP === null ? true : (savedMouseP === "true");

  const savedAutoP = localStorage.getItem("autoParticlesEnabled");
  autoParticlesEnabled = savedAutoP === null ? true : (savedAutoP === "true");

  const savedInteraction = localStorage.getItem("blobsInteractionEnabled");
  blobsInteractionEnabled = savedInteraction === null ? true : (savedInteraction === "true");

  const savedMovement = localStorage.getItem("blobsMovementEnabled");
  blobsMovementEnabled = savedMovement === null ? true : (savedMovement === "true");

  const savedRandomPos = localStorage.getItem("blobsRandomPositionEnabled");
  blobsRandomPositionEnabled = savedRandomPos === null ? true : (savedRandomPos === "true");
}

// Modify existing loops to respect the flag

// --- OVERRIDE EXISTING LOOPS ---
// We need to redefine animateBlobs and particleLoop or wrap them.
// Since we are appending code, we can't easily replace the functions defined above without replacing the whole file 
// or using a more complex replace strategy. 
// However, since I am replacing the END of the file, I can't redefine consts or functions declared with const/let easily if they are in the same scope.
// BUT, the previous functions `animateBlobs` and `particleLoop` are defined in the global scope.
// I will modify the original function definitions in a separate edit to include the check.

loadSettings();

// --- ACTIVATION SYSTEM ---
const activationModal = document.getElementById("activationModal");
const activationInput = document.getElementById("activationInput");
const activateBtn = document.getElementById("activateBtn");
const activationError = document.getElementById("activationError");

function checkActivation() {
  const isActivated = localStorage.getItem("isActivated");
  const expiryDate = localStorage.getItem("subscriptionExpiry");

  // Check if subscription has expired
  if (isActivated && expiryDate) {
    const expiry = new Date(expiryDate);
    const now = new Date();

    if (now > expiry) {
      // Subscription expired, lock the extension
      localStorage.removeItem("isActivated");
      localStorage.removeItem("subscriptionExpiry");
      activationModal.classList.remove("hidden");

      // Show expiry message but keep error hidden initially
      // It will show when user tries to activate

      // Blur everything except the modal
      Array.from(document.body.children).forEach(child => {
        if (child.id !== "activationModal" && child.id !== "toast") {
          child.classList.add("locked-blur");
        }
      });
      return;
    }
  }

  if (!isActivated) {
    activationModal.classList.remove("hidden");
    // Blur everything except the modal
    Array.from(document.body.children).forEach(child => {
      if (child.id !== "activationModal" && child.id !== "toast") {
        child.classList.add("locked-blur");
      }
    });
  }
}

activateBtn.addEventListener("click", async () => {
  const key = activationInput.value.trim();
  if (!key) return;

  activateBtn.disabled = true;
  activateBtn.textContent = "Verifying...";
  activationError.classList.add("hidden");

  try {
    const response = await fetch("https://customtab.pythonanywhere.com/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });

    const data = await response.json();

    if (data.valid) {
      localStorage.setItem("isActivated", "true");

      // Store expiry date if provided
      if (data.expiry_date) {
        localStorage.setItem("subscriptionExpiry", data.expiry_date);
      }

      activationModal.classList.add("hidden");

      // Unblur everything
      Array.from(document.body.children).forEach(child => {
        child.classList.remove("locked-blur");
      });

      showToast("Activation Successful!", 2000);
    } else {
      throw new Error(data.message || "Invalid key");
    }
  } catch (err) {
    activationError.textContent = err.message || "Server error. Please try again.";
    activationError.classList.remove("hidden");
    activationInput.classList.add("shake");
    setTimeout(() => activationInput.classList.remove("shake"), 500);
  } finally {
    activateBtn.disabled = false;
    activateBtn.textContent = "Activate";
  }
});

// Check on load
checkActivation();

// Check expiry periodically (every hour)
setInterval(checkActivation, 3600000);


// --- BOOKMARKS SYSTEM ---
const bookmarksGrid = document.getElementById("bookmarksGrid");
const addBookmarkBtn = document.getElementById("addBookmarkBtn");
const bookmarkModal = document.getElementById("bookmarkModal");
const closeBookmarkModal = document.getElementById("closeBookmarkModal");
const saveBookmarkBtn = document.getElementById("saveBookmarkBtn");
const bookmarkUrlInput = document.getElementById("bookmarkUrl");
const bookmarkTitleInput = document.getElementById("bookmarkTitle");

let bookmarks = [];

// Load bookmarks
function loadBookmarks() {
  chrome.storage.local.get("bookmarks", (data) => {
    bookmarks = data.bookmarks || [];
    renderBookmarks();
  });
}
loadBookmarks();

// Render bookmarks
function renderBookmarks() {
  // Clear existing bookmarks (except the add button)
  const items = bookmarksGrid.querySelectorAll(".bookmark-item:not(.add-bookmark)");
  items.forEach(item => item.remove());

  bookmarks.forEach((bookmark, index) => {
    const el = document.createElement("a");
    el.href = bookmark.url;
    el.className = "bookmark-item";
    el.innerHTML = `
      <button class="bookmark-delete" data-index="${index}">&times;</button>
      <img src="${bookmark.icon}" class="bookmark-icon" alt="${bookmark.title}" onerror="this.src='default_icon.png'">
      <span class="bookmark-title">${bookmark.title}</span>
    `;

    // Handle delete click
    const deleteBtn = el.querySelector(".bookmark-delete");
    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteBookmark(index);
    });

    bookmarksGrid.insertBefore(el, addBookmarkBtn);
  });
}

// Save bookmark
function saveBookmark() {
  const url = bookmarkUrlInput.value.trim();
  const title = bookmarkTitleInput.value.trim();

  if (!url) {
    showToast("Please enter a URL");
    return;
  }

  // Basic URL validation/formatting
  let finalUrl = url;
  if (!/^https?:\/\//i.test(url)) {
    finalUrl = "https://" + url;
  }

  // Fetch favicon
  // Using Google's favicon service for simplicity and reliability
  // Format: https://www.google.com/s2/favicons?domain=URL&sz=SIZE
  let domain = finalUrl;
  try {
    domain = new URL(finalUrl).hostname;
  } catch (e) {
    // If URL parsing fails, just use the input
  }
  const icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const newBookmark = {
    url: finalUrl,
    title: title || domain,
    icon: icon
  };

  bookmarks.push(newBookmark);
  chrome.storage.local.set({ bookmarks });
  renderBookmarks();

  closeBookmarkModalFn();
  showToast("Bookmark saved!");
}

// Delete bookmark
function deleteBookmark(index) {
  if (confirm("Delete this bookmark?")) {
    bookmarks.splice(index, 1);
    chrome.storage.local.set({ bookmarks });
    renderBookmarks();
    showToast("Bookmark deleted");
  }
}

// Modal Logic
function openBookmarkModal() {
  bookmarkModal.classList.remove("hidden");
  bookmarkUrlInput.value = "";
  bookmarkTitleInput.value = "";
  bookmarkUrlInput.focus();
}

function closeBookmarkModalFn() {
  bookmarkModal.classList.add("hidden");
}

addBookmarkBtn.addEventListener("click", openBookmarkModal);
closeBookmarkModal.addEventListener("click", closeBookmarkModalFn);
saveBookmarkBtn.addEventListener("click", saveBookmark);

// Close modal on outside click
bookmarkModal.addEventListener("click", (e) => {
  if (e.target === bookmarkModal) closeBookmarkModalFn();
});

// Enter key to save
bookmarkUrlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") bookmarkTitleInput.focus();
});
bookmarkTitleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveBookmark();
});
