const CONFIG = window.RSBG_CONFIG || {};
const SITE_URL = CONFIG.SITE_URL || window.location.origin;
const PROXY_URL = CONFIG.HISCORES_PROXY_URL || "/proxy.php";
const TEMPLATE_PATH = "your-template.html";
const BANNER_SIZES = {
  rs3: { width: 500, height: 260 },
  osrs: { width: 400, height: 270 }
};
const DISPLAY_MODE = "icons";

const form = document.getElementById("generatorForm");
const usernameInput = document.getElementById("username");
const gameInputs = [...document.querySelectorAll('input[name="game"]')];
const generateBtn = document.getElementById("generateBtn");
const preview = document.getElementById("preview");
const embedCodeArea = document.getElementById("embedCode");
const copyEmbedBtn = document.getElementById("copyEmbedBtn");
const statusPill = document.getElementById("statusPill");
const toast = document.getElementById("toast");

let iframeCode = "";

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await generateBanner();
});

gameInputs.forEach((input) => {
  input.addEventListener("change", () => {
    document.body.dataset.game = getSelectedGame();
    resetResult();
  });
});

usernameInput.addEventListener("input", resetResult);
embedCodeArea.addEventListener("click", copyEmbedCode);
copyEmbedBtn.addEventListener("click", copyEmbedCode);

function getSelectedGame() {
  return document.querySelector('input[name="game"]:checked').value;
}

function getBannerSize() {
  return BANNER_SIZES[getSelectedGame()] || BANNER_SIZES.rs3;
}

function getUsername() {
  return usernameInput.value.trim();
}

function getBannerParams() {
  return new URLSearchParams({
    username: getUsername(),
    game: getSelectedGame(),
    mode: DISPLAY_MODE
  });
}

function buildTemplateSrc(baseUrl) {
  return `${baseUrl}?${getBannerParams().toString()}`;
}

function buildIframeCode() {
  const baseUrl = `${SITE_URL.replace(/\/$/, "")}/${TEMPLATE_PATH}`;
  const src = buildTemplateSrc(baseUrl);
  const { width, height } = getBannerSize();
  return `<iframe src="${src}" width="${width}" height="${height}" style="border:none; overflow:hidden;" scrolling="no" loading="lazy"></iframe>`;
}

async function generateBanner() {
  const username = getUsername();

  if (!username) {
    showError("Enter a username first.");
    usernameInput.focus();
    return;
  }

  setLoading();

  try {
    await prefetchStats(username, getSelectedGame());
    renderIframe();
    statusPill.textContent = "Generated";
    statusPill.className = "status-pill success";
  } catch (err) {
    showError(err.message || "Unable to load this player.");
  }
}

async function prefetchStats(username, game) {
  const url = `${PROXY_URL}?player=${encodeURIComponent(username)}&game=${game}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Player not found or HiScores unavailable.");
  }

  const text = await res.text();
  if (!/^-?\d+,/.test(text.trim())) {
    throw new Error("The stats response was not valid.");
  }

  return text;
}

function renderIframe() {
  generateBtn.disabled = false;
  generateBtn.classList.remove("is-loading");
  const src = buildTemplateSrc(TEMPLATE_PATH);
  const { width, height } = getBannerSize();
  preview.className = "preview-box has-result";
  preview.innerHTML = `<iframe src="${src}" width="${width}" height="${height}" scrolling="no" title="RuneScape banner preview"></iframe>`;

  iframeCode = buildIframeCode();
  embedCodeArea.value = iframeCode;
  copyEmbedBtn.disabled = false;
}

function setLoading() {
  generateBtn.disabled = true;
  generateBtn.classList.add("is-loading");
  statusPill.textContent = "Loading";
  statusPill.className = "status-pill loading";
  copyEmbedBtn.disabled = true;
  embedCodeArea.value = "";
  iframeCode = "";
  preview.className = "preview-box loading";
  preview.innerHTML = `
    <div class="loader-card">
      <span class="loader-ring"></span>
      <p>Fetching live HiScores...</p>
    </div>
  `;
}

function showError(message) {
  generateBtn.disabled = false;
  generateBtn.classList.remove("is-loading");
  statusPill.textContent = "Error";
  statusPill.className = "status-pill error";
  copyEmbedBtn.disabled = true;
  iframeCode = "";
  embedCodeArea.value = "";
  preview.className = "preview-box error";
  preview.innerHTML = `
    <div class="error-card">
      <strong>Could not generate banner</strong>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function resetResult() {
  if (!iframeCode && preview.classList.contains("placeholder")) return;

  generateBtn.disabled = false;
  generateBtn.classList.remove("is-loading");
  statusPill.textContent = "Ready";
  statusPill.className = "status-pill";
  copyEmbedBtn.disabled = true;
  iframeCode = "";
  embedCodeArea.value = "";
  preview.className = "preview-box placeholder";
  preview.innerHTML = `
    <div class="placeholder-content">
      <span class="placeholder-mark" aria-hidden="true"></span>
      <p>Enter a username and generate your banner.</p>
    </div>
  `;
}

async function copyEmbedCode() {
  if (!iframeCode) return;

  try {
    await navigator.clipboard.writeText(iframeCode);
  } catch {
    embedCodeArea.select();
    document.execCommand("copy");
  }

  embedCodeArea.classList.add("copied");
  copyEmbedBtn.classList.add("copied");
  copyEmbedBtn.textContent = "Copied";
  showToast();

  window.setTimeout(() => {
    embedCodeArea.classList.remove("copied");
    copyEmbedBtn.classList.remove("copied");
    copyEmbedBtn.textContent = "Copy Embed";
  }, 1400);
}

function showToast() {
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}
