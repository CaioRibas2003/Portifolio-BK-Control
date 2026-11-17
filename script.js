// ================== CONFIGURAÇÃO ==================
// Preencha quando tiver os links (deixe "" enquanto não houver).
// Vídeo: link do YouTube (watch?v=... ou youtu.be/...) ou do Google Drive (file/d/.../view).
const VIDEO_URL = "https://youtu.be/c0Ponz3Zxi8";
// Relatório de estágio em PDF (link público, ex.: Google Drive "qualquer pessoa com o link").
const RELATORIO_PDF_URL = "https://drive.google.com/file/d/1F1OIui5PWqDQS7JaY58FF6FR6MvEWub9/view?usp=sharing";
// ==================================================

function embedUrl(url) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return null;
}

// Vídeo
if (VIDEO_URL) {
  const src = embedUrl(VIDEO_URL);
  const frame = document.getElementById("video-frame");
  if (/\.(mp4|webm)$/i.test(VIDEO_URL)) {
    frame.innerHTML = `<video src="${VIDEO_URL}" controls preload="metadata" playsinline title="Vídeo de demonstração do BK Control"></video>`;
  } else if (src) {
    frame.innerHTML = `<iframe src="${src}" title="Vídeo de demonstração do BK Control" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  }
  document.getElementById("video-link").href = VIDEO_URL;
  document.getElementById("video-link-wrap").hidden = false;
}

// Relatório
const reportLink = document.getElementById("report-link");
if (RELATORIO_PDF_URL) {
  reportLink.href = RELATORIO_PDF_URL;
} else {
  reportLink.textContent = "PDF em breve";
  reportLink.removeAttribute("href");
  reportLink.setAttribute("aria-disabled", "true");
  reportLink.style.opacity = ".55";
  reportLink.style.pointerEvents = "none";
}

// Carrossel da stack: duplica os itens para o loop contínuo
const track = document.querySelector(".marquee-track");
if (track) {
  [...track.children].forEach((li) => {
    const clone = li.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
}

// Menu mobile
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
});

// Seção ativa no menu
const links = [...menu.querySelectorAll("a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => s && spy.observe(s));

// Animação de entrada
const reveal = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("in"); reveal.unobserve(entry.target); } });
}, { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

// Filtro das capturas
const filterButtons = document.querySelectorAll(".filter-bar button");
filterButtons.forEach((btn) => btn.addEventListener("click", () => {
  filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
  const f = btn.dataset.filter;
  document.querySelectorAll(".shot").forEach((s) => { s.hidden = f !== "all" && s.dataset.cat !== f; });
}));

// Lightbox
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");
const lbText = lb.querySelector("p");
let lastFocus = null;
function openLightbox(src, title) {
  lastFocus = document.activeElement;
  lbImg.src = src; lbImg.alt = title; lbText.textContent = title;
  lb.classList.add("open");
  document.getElementById("lightbox-close").focus();
}
function closeLightbox() { lb.classList.remove("open"); lbImg.src = ""; lastFocus && lastFocus.focus(); }
document.querySelectorAll("[data-full]").forEach((el) =>
  el.addEventListener("click", () => openLightbox(el.dataset.full, el.dataset.title || "")));
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lb.classList.contains("open")) closeLightbox(); });
