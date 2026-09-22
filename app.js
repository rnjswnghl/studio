export const RATIOS = {
  "1:1": [1080, 1080],
  "4:5": [1080, 1350],
  "9:16": [1080, 1920],
};

export const DEFAULT_TEMPLATES = [
  { id: "camera-silver", name: "은빛 디카", subtitle: "digital camera", frame: "camera", ratio: "4:5", color: "#d8d3c7", accent: "#b34f45" },
  { id: "life-four", name: "크림 네컷", subtitle: "four cut booth", frame: "fourcut", ratio: "9:16", color: "#f4ead8", accent: "#d16758" },
  { id: "film-noir", name: "필름 다이어리", subtitle: "35mm contact", frame: "film", ratio: "1:1", color: "#26221e", accent: "#dfaa4b" },
  { id: "gingham", name: "피크닉 체크", subtitle: "gingham note", frame: "gingham", ratio: "4:5", color: "#ead0c8", accent: "#a9473e" },
];

export const STICKERS = {
  // Y2K metallic & glass glossy stickers
  "glass-heart": {
    category: "y2k",
    label: "글라스 하트",
    type: "vector-rich",
    svg: `<defs>
      <linearGradient id="gh-g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="35%" stop-color="#b8d4f6"/>
        <stop offset="70%" stop-color="#7ea7d8"/>
        <stop offset="100%" stop-color="#d4e8fc"/>
      </linearGradient>
      <linearGradient id="gh-ring" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="#6a87aa"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <path d="M50 82 C22 62 10 44 18 26 C24 14 38 15 50 30 C62 15 76 14 82 26 C90 44 78 62 50 82 Z" fill="url(#gh-g)" stroke="#6e8ea8" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="36" cy="33" rx="10" ry="5" transform="rotate(-30 36 33)" fill="#ffffff" opacity="0.85"/>
    <circle cx="68" cy="40" r="3.5" fill="#ffffff" opacity="0.9"/>
    <path d="M12 52 C26 44 74 44 88 52" fill="none" stroke="url(#gh-ring)" stroke-width="3.5" stroke-linecap="round"/>`,
    render: (c, s) => {
      c.save();
      const grad = c.createLinearGradient(-s*0.35, -s*0.35, s*0.35, s*0.35);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.35, "#bad8f8");
      grad.addColorStop(0.7, "#769dc9");
      grad.addColorStop(1, "#dcebff");
      c.fillStyle = grad;
      c.strokeStyle = "#5a7a97";
      c.lineWidth = Math.max(2, s * 0.035);
      c.beginPath();
      c.moveTo(0, s * 0.35);
      c.bezierCurveTo(-s * 0.45, s * 0.15, -s * 0.5, -s * 0.25, -s * 0.22, -s * 0.35);
      c.bezierCurveTo(-s * 0.05, -s * 0.42, 0, -s * 0.2, 0, -s * 0.15);
      c.bezierCurveTo(0, -s * 0.2, s * 0.05, -s * 0.42, s * 0.22, -s * 0.35);
      c.bezierCurveTo(s * 0.5, -s * 0.25, s * 0.45, s * 0.15, 0, s * 0.35);
      c.closePath();
      c.fill(); c.stroke();
      // Orbit ring
      c.save();
      c.rotate(-0.25);
      c.strokeStyle = "rgba(255,255,255,0.9)";
      c.lineWidth = Math.max(1.5, s * 0.04);
      c.beginPath();
      c.ellipse(0, s*0.02, s*0.48, s*0.14, 0, 0, Math.PI * 2);
      c.stroke();
      c.strokeStyle = "#4d6b88";
      c.lineWidth = Math.max(1, s * 0.015);
      c.stroke();
      c.restore();
      // Highlights
      c.fillStyle = "rgba(255,255,255,0.85)";
      c.beginPath();
      c.ellipse(-s*0.18, -s*0.18, s*0.11, s*0.055, -Math.PI/4, 0, Math.PI*2);
      c.fill();
      c.beginPath();
      c.arc(s*0.18, -s*0.05, s*0.04, 0, Math.PI*2);
      c.fill();
      c.restore();
    }
  },

  "y2k-star": {
    category: "y2k",
    label: "Y2K 메탈 스타",
    type: "vector-rich",
    svg: `<defs>
      <linearGradient id="ystar-g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="25%" stop-color="#c5d4e6"/>
        <stop offset="50%" stop-color="#687b92"/>
        <stop offset="75%" stop-color="#b8c8dc"/>
        <stop offset="100%" stop-color="#f5f8fc"/>
      </linearGradient>
    </defs>
    <path d="M50 5 Q50 50 95 50 Q50 50 50 95 Q50 50 5 50 Q50 50 50 5 Z" fill="url(#ystar-g)" stroke="#3a4959" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="50" cy="50" r="7" fill="#ffffff"/>
    <circle cx="50" cy="50" r="14" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>`,
    render: (c, s) => {
      c.save();
      const grad = c.createLinearGradient(-s*0.4, -s*0.4, s*0.4, s*0.4);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.25, "#b5c4d6");
      grad.addColorStop(0.5, "#607289");
      grad.addColorStop(0.75, "#b0c1d6");
      grad.addColorStop(1, "#f3f7fc");
      c.fillStyle = grad;
      c.strokeStyle = "#3e4d5e";
      c.lineWidth = Math.max(1.5, s * 0.03);
      c.beginPath();
      c.moveTo(0, -s*0.48);
      c.quadraticCurveTo(0, 0, s*0.48, 0);
      c.quadraticCurveTo(0, 0, 0, s*0.48);
      c.quadraticCurveTo(0, 0, -s*0.48, 0);
      c.quadraticCurveTo(0, 0, 0, -s*0.48);
      c.closePath();
      c.fill(); c.stroke();
      // Center glow
      c.fillStyle = "#ffffff";
      c.beginPath();
      c.arc(0, 0, s*0.08, 0, Math.PI*2);
      c.fill();
      c.strokeStyle = "rgba(255,255,255,0.7)";
      c.lineWidth = Math.max(1, s * 0.018);
      c.beginPath();
      c.arc(0, 0, s*0.15, 0, Math.PI*2);
      c.stroke();
      c.restore();
    }
  },

  "chrome-ring-heart": {
    category: "y2k",
    label: "토성 링 하트",
    type: "vector-rich",
    svg: `<defs>
      <linearGradient id="crh-g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fdfefe"/>
        <stop offset="50%" stop-color="#93a8c2"/>
        <stop offset="100%" stop-color="#495d75"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(-20 50 50)" fill="none" stroke="#687c94" stroke-width="4.5"/>
    <path d="M50 78 C26 60 16 45 23 30 C28 19 40 20 50 32 C60 20 72 19 77 30 C84 45 74 60 50 78 Z" fill="url(#crh-g)" stroke="#324254" stroke-width="2.5"/>
    <path d="M12 55 C22 46 76 38 88 47" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.85"/>`,
    render: (c, s) => {
      c.save();
      // Back ring
      c.save();
      c.rotate(-0.35);
      c.strokeStyle = "#6d8199";
      c.lineWidth = Math.max(2, s * 0.045);
      c.beginPath();
      c.ellipse(0, 0, s*0.48, s*0.16, 0, Math.PI, Math.PI*2);
      c.stroke();
      c.restore();
      // Heart
      const grad = c.createLinearGradient(-s*0.3, -s*0.3, s*0.3, s*0.3);
      grad.addColorStop(0, "#f9fbfe");
      grad.addColorStop(0.5, "#93a6be");
      grad.addColorStop(1, "#4f627a");
      c.fillStyle = grad;
      c.strokeStyle = "#38475c";
      c.lineWidth = Math.max(1.5, s * 0.03);
      c.beginPath();
      c.moveTo(0, s * 0.28);
      c.bezierCurveTo(-s * 0.38, s * 0.12, -s * 0.42, -s * 0.22, -s * 0.18, -s * 0.3);
      c.bezierCurveTo(-s * 0.04, -s * 0.35, 0, -s * 0.18, 0, -s * 0.12);
      c.bezierCurveTo(0, -s * 0.18, s * 0.04, -s * 0.35, s * 0.18, -s * 0.3);
      c.bezierCurveTo(s * 0.42, -s * 0.22, s * 0.38, s * 0.12, 0, s * 0.28);
      c.closePath();
      c.fill(); c.stroke();
      // Front ring
      c.save();
      c.rotate(-0.35);
      c.strokeStyle = "#7b90aa";
      c.lineWidth = Math.max(2, s * 0.045);
      c.beginPath();
      c.ellipse(0, 0, s*0.48, s*0.16, 0, 0, Math.PI);
      c.stroke();
      c.strokeStyle = "rgba(255,255,255,0.9)";
      c.lineWidth = Math.max(1.5, s * 0.02);
      c.beginPath();
      c.ellipse(0, 0, s*0.48, s*0.16, 0, 0.2, Math.PI*0.8);
      c.stroke();
      c.restore();
      c.restore();
    }
  },

  "bubble-pearl": {
    category: "y2k",
    label: "버블 펄",
    type: "vector-rich",
    svg: `<defs>
      <radialGradient id="bp-g" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="40%" stop-color="#dbe7f7"/>
        <stop offset="80%" stop-color="#9bb0cd"/>
        <stop offset="100%" stop-color="#607694"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="42" fill="url(#bp-g)" stroke="#3e4f64" stroke-width="2.5"/>
    <ellipse cx="38" cy="36" rx="14" ry="8" transform="rotate(-40 38 36)" fill="#ffffff" opacity="0.85"/>
    <circle cx="64" cy="62" r="5" fill="#ffffff" opacity="0.6"/>`,
    render: (c, s) => {
      c.save();
      const grad = c.createRadialGradient(-s*0.12, -s*0.12, s*0.05, 0, 0, s*0.42);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.4, "#dbe7f7");
      grad.addColorStop(0.8, "#9bb0cd");
      grad.addColorStop(1, "#657c9c");
      c.fillStyle = grad;
      c.strokeStyle = "#495a70";
      c.lineWidth = Math.max(1.5, s * 0.03);
      c.beginPath();
      c.arc(0, 0, s*0.42, 0, Math.PI*2);
      c.fill(); c.stroke();
      // shine
      c.fillStyle = "rgba(255,255,255,0.85)";
      c.beginPath();
      c.ellipse(-s*0.14, -s*0.14, s*0.14, s*0.08, -Math.PI/4, 0, Math.PI*2);
      c.fill();
      c.beginPath();
      c.arc(s*0.16, s*0.16, s*0.05, 0, Math.PI*2);
      c.fill();
      c.restore();
    }
  },

  "glitter-spark": {
    category: "y2k",
    label: "크롬 글리터",
    type: "vector-rich",
    svg: `<defs>
      <linearGradient id="gs-g" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="50%" stop-color="#93a8c4"/>
        <stop offset="100%" stop-color="#546882"/>
      </linearGradient>
    </defs>
    <path d="M50 4 C54 38 62 46 96 50 C62 54 54 62 50 96 C46 62 38 54 4 50 C38 46 46 38 50 4 Z" fill="url(#gs-g)" stroke="#38475a" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="7" fill="#ffffff"/>`,
    render: (c, s) => {
      c.save();
      const grad = c.createLinearGradient(0, -s*0.45, 0, s*0.45);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.5, "#93a8c4");
      grad.addColorStop(1, "#546882");
      c.fillStyle = grad;
      c.strokeStyle = "#38475a";
      c.lineWidth = Math.max(1.5, s * 0.025);
      c.beginPath();
      c.moveTo(0, -s*0.46);
      c.bezierCurveTo(s*0.04, -s*0.06, s*0.06, -s*0.04, s*0.46, 0);
      c.bezierCurveTo(s*0.06, s*0.04, s*0.04, s*0.06, 0, s*0.46);
      c.bezierCurveTo(-s*0.04, s*0.06, -s*0.06, s*0.04, -s*0.46, 0);
      c.bezierCurveTo(-s*0.06, -s*0.04, -s*0.04, -s*0.06, 0, -s*0.46);
      c.closePath();
      c.fill(); c.stroke();
      c.fillStyle = "#ffffff";
      c.beginPath();
      c.arc(0, 0, s*0.08, 0, Math.PI*2);
      c.fill();
      c.restore();
    }
  },

  // Photo & Camera stickers
  "camcorder-rec": {
    category: "photo",
    label: "캠코더 REC",
    type: "vector-rich",
    svg: `<rect x="6" y="20" width="88" height="60" rx="6" fill="#181614" stroke="#ffffff" stroke-width="2"/>
    <circle cx="24" cy="38" r="6" fill="#e74c3c"/>
    <text x="36" y="42" fill="#ffffff" font-size="14" font-weight="bold" font-family="monospace">REC</text>
    <text x="18" y="66" fill="#ffffff" font-size="10" font-family="monospace">00:12:03</text>
    <rect x="66" y="32" width="16" height="8" fill="none" stroke="#ffffff" stroke-width="1.5"/>
    <rect x="82" y="34" width="2" height="4" fill="#ffffff"/>
    <rect x="68" y="34" width="9" height="4" fill="#2ecc71"/>`,
    render: (c, s) => {
      c.save();
      const w = s * 0.9, h = s * 0.65;
      c.fillStyle = "rgba(22, 20, 18, 0.92)";
      c.strokeStyle = "#ffffff";
      c.lineWidth = Math.max(1.5, s * 0.025);
      c.beginPath();
      c.roundRect(-w/2, -h/2, w, h, s * 0.06);
      c.fill(); c.stroke();
      // Red REC dot
      c.fillStyle = "#e74c3c";
      c.beginPath();
      c.arc(-w*0.3, -h*0.18, s*0.065, 0, Math.PI*2);
      c.fill();
      // REC text
      c.fillStyle = "#ffffff";
      c.font = `bold ${Math.round(s*0.14)}px monospace`;
      c.textAlign = "left";
      c.textBaseline = "middle";
      c.fillText("REC", -w*0.18, -h*0.18);
      // timecode
      c.font = `${Math.round(s*0.11)}px monospace`;
      c.fillText("00:12:03", -w*0.35, h*0.22);
      // battery indicator
      c.strokeRect(w*0.18, -h*0.28, s*0.16, s*0.08);
      c.fillRect(w*0.34, -h*0.24, s*0.02, s*0.04);
      c.fillRect(w*0.2, -h*0.26, s*0.09, s*0.05);
      c.restore();
    }
  },

  "film-sprocket": {
    category: "photo",
    label: "35mm 필름",
    type: "vector-rich",
    svg: `<rect x="4" y="22" width="92" height="56" rx="4" fill="#1e1b18" stroke="#d4b47a" stroke-width="2.5"/>
    <rect x="12" y="26" width="10" height="7" rx="1.5" fill="#f5ebd8"/>
    <rect x="32" y="26" width="10" height="7" rx="1.5" fill="#f5ebd8"/>
    <rect x="52" y="26" width="10" height="7" rx="1.5" fill="#f5ebd8"/>
    <rect x="72" y="26" width="10" height="7" rx="1.5" fill="#f5ebd8"/>
    <rect x="12" y="67" width="10" height="7" rx="1.5" fill="#f5ebd8"/>
    <rect x="32" y="67" width="10" height="7" rx="1.5" fill="#f5ebd8"/>
    <rect x="52" y="67" width="10" height="7" rx="1.5" fill="#f5ebd8"/>
    <rect x="72" y="67" width="10" height="7" rx="1.5" fill="#f5ebd8"/>
    <text x="50" y="53" fill="#e8c278" font-size="12" font-weight="bold" font-family="monospace" text-anchor="middle">KODAK 400</text>`,
    render: (c, s) => {
      c.save();
      const w = s * 0.95, h = s * 0.6;
      c.fillStyle = "#1e1b18";
      c.strokeStyle = "#d4b47a";
      c.lineWidth = Math.max(1.5, s * 0.025);
      c.beginPath();
      c.roundRect(-w/2, -h/2, w, h, s * 0.04);
      c.fill(); c.stroke();
      // perforations
      c.fillStyle = "#f5ebd8";
      const pw = s * 0.1, ph = s * 0.07;
      for (let x = -w*0.4; x <= w*0.4; x += w*0.25) {
        c.beginPath();
        c.roundRect(x - pw/2, -h/2 + s*0.04, pw, ph, 2);
        c.fill();
        c.beginPath();
        c.roundRect(x - pw/2, h/2 - s*0.04 - ph, pw, ph, 2);
        c.fill();
      }
      c.fillStyle = "#e8c278";
      c.font = `bold ${Math.round(s*0.13)}px monospace`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("KODAK 400", 0, 0);
      c.restore();
    }
  },

  "barcode-tag": {
    category: "photo",
    label: "빈티지 바코드",
    type: "vector-rich",
    svg: `<rect x="6" y="24" width="88" height="52" rx="3" fill="#fffaf0" stroke="#2e2a24" stroke-width="2"/>
    <rect x="14" y="32" width="3" height="24" fill="#221e1a"/>
    <rect x="19" y="32" width="2" height="24" fill="#221e1a"/>
    <rect x="23" y="32" width="5" height="24" fill="#221e1a"/>
    <rect x="30" y="32" width="2" height="24" fill="#221e1a"/>
    <rect x="34" y="32" width="4" height="24" fill="#221e1a"/>
    <rect x="41" y="32" width="6" height="24" fill="#221e1a"/>
    <rect x="49" y="32" width="2" height="24" fill="#221e1a"/>
    <rect x="53" y="32" width="5" height="24" fill="#221e1a"/>
    <rect x="60" y="32" width="3" height="24" fill="#221e1a"/>
    <rect x="65" y="32" width="5" height="24" fill="#221e1a"/>
    <rect x="73" y="32" width="2" height="24" fill="#221e1a"/>
    <rect x="77" y="32" width="4" height="24" fill="#221e1a"/>
    <text x="50" y="68" fill="#3a342b" font-size="8.5" font-weight="bold" font-family="monospace" text-anchor="middle">NO. 2026-0922</text>`,
    render: (c, s) => {
      c.save();
      const w = s * 0.9, h = s * 0.45;
      c.fillStyle = "#fffaf0";
      c.strokeStyle = "#2e2a24";
      c.lineWidth = Math.max(1, s * 0.02);
      c.beginPath();
      c.roundRect(-w/2, -h/2, w, h, 3);
      c.fill(); c.stroke();
      c.fillStyle = "#221e1a";
      const pattern = [2, 1, 3, 1, 2, 3, 1, 1, 4, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2];
      let curX = -w*0.42;
      for (const bw of pattern) {
        const width = (bw * s * 0.02);
        c.fillRect(curX, -h*0.35, width, h*0.48);
        curX += width + s * 0.02;
      }
      c.fillStyle = "#3a342b";
      c.font = `bold ${Math.round(s*0.09)}px monospace`;
      c.textAlign = "center";
      c.fillText("NO. 2026-0922", 0, h*0.32);
      c.restore();
    }
  },

  // Classic hand-drawn doodles
  spark: {
    category: "doodle",
    label: "반짝",
    path: "M50 8 C48 32 39 43 17 49 C39 54 47 65 50 91 C54 66 62 55 84 49 C61 43 54 31 50 8 M18 15 C17 25 13 29 4 32 C14 35 17 40 18 50 C20 40 24 35 33 32 C24 28 20 24 18 15"
  },
  heart: {
    category: "doodle",
    label: "하트",
    path: "M50 87 C35 74 14 59 14 37 C14 19 36 13 50 31 C64 13 86 19 86 37 C86 59 65 74 50 87"
  },
  flower: {
    category: "doodle",
    label: "꽃",
    path: "M50 48 C27 44 22 22 38 18 C48 16 52 30 50 43 C54 20 76 16 82 32 C86 45 67 51 56 49 C76 50 84 67 72 78 C60 88 51 69 51 55 C50 76 33 86 22 74 C12 62 30 51 45 50 M50 47 C54 47 56 51 53 54 C49 57 45 53 47 49"
  },
  smile: {
    category: "doodle",
    label: "웃음",
    path: "M18 50 C18 28 31 15 52 15 C76 15 88 31 85 54 C83 75 69 86 48 84 C28 82 17 69 18 50 M34 43 L35 45 M66 42 L67 44 M34 61 C45 71 58 70 69 59"
  },
  planet: {
    category: "doodle",
    label: "행성",
    path: "M32 29 C47 16 70 22 77 40 C84 59 71 78 52 81 C34 84 17 72 15 54 C14 44 20 34 32 29 M5 69 C13 82 43 75 68 61 C91 48 101 34 94 27 C88 20 74 23 64 27"
  }
};

const state = {
  ratio: "1:1",
  caption: "오늘, 우리, 그리고 빛나는 순간",
  textColor: "#fffaf0",
  fontSize: 42,
  textPosition: "bottom",
  templateId: "camera-silver",
  sticker: "spark", // Legacy compatibility
  stickers: [],     // Free interactive sticker list: { id, key, type, x, y, size, rotation, dataUrl?, label? }
  images: [null, null, null, null], // Up to 4 slot images: { img, dataUrl, name, type, position: {x, y}, zoom: 1.0, rotate: 0 }
  frameColor: "#d8d3c7",
  frameAccent: "#b34f45",
  frameRotate: 0,
  frameMargin: 1.0,
};

let userTemplates = loadUserTemplates();
let selectedUserTemplateId = null;
let activeSlotIndex = 0; // Currently selected slot for fine adjustment

// Canvas interactive selection & transform state
let selectedItem = null; // { type: 'sticker' | 'frame' | 'slot', index?: number, id?: string }
let interactionMode = null; // 'drag' | 'rotate' | 'scale' | 'slot-pan'
let interactionStart = null;

const $ = (selector) => document.querySelector(selector);
const canvas = $("#preview");
const ctx = canvas.getContext("2d");

function uid() { return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function loadUserTemplates() {
  try {
    const value = JSON.parse(localStorage.getItem("cutnote-templates") || "[]");
    return Array.isArray(value) ? value.filter(isValidTemplate) : [];
  } catch { return []; }
}
function persistTemplates() { localStorage.setItem("cutnote-templates", JSON.stringify(userTemplates)); }
function isValidTemplate(t) {
  return t && typeof t.id === "string" && typeof t.name === "string" &&
    ["camera","fourcut","film","gingham"].includes(t.frame) &&
    RATIOS[t.ratio] && /^#[0-9a-f]{6}$/i.test(t.color);
}

export function validateProject(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "JSON 객체가 필요합니다.";
  const required = ["version","state","templates"];
  const missing = required.filter((k) => !(k in data));
  if (missing.length) return `필수 항목이 없습니다: ${missing.join(", ")}`;
  if (![1, 2, 3].includes(data.version) || !data.state || !RATIOS[data.state.ratio]) return "지원하지 않는 백업 형식입니다.";
  if (typeof data.state.caption !== "string" || data.state.caption.length > 120) return "문구 형식이 올바르지 않습니다.";
  if (!Array.isArray(data.templates) || !data.templates.every(isValidTemplate)) return "템플릿 데이터가 올바르지 않습니다.";
  if (data.version >= 2) {
    if (!Array.isArray(data.state.images) || data.state.images.length > 4) return "사진 데이터가 올바르지 않습니다.";
    const valid = data.state.images.every((record) => record === null || (
      record && ["image/png","image/jpeg"].includes(dataUrlType(record.dataUrl)) &&
      typeof record.name === "string" && record.position &&
      Number.isFinite(Number(record.position.x)) && Number.isFinite(Number(record.position.y))
    ));
    if (!valid) return "사진 데이터가 올바르지 않습니다.";
  }
  return null;
}

function allTemplates() { return [...DEFAULT_TEMPLATES, ...userTemplates]; }
function activeTemplate() {
  const found = allTemplates().find((t) => t.id === state.templateId) || DEFAULT_TEMPLATES[0];
  // sync frameColor / frameAccent with activeTemplate if not manually customized
  return found;
}

function setRatio(ratio) {
  state.ratio = ratio;
  const [w, h] = RATIOS[ratio];
  canvas.width = w; canvas.height = h;
  const sizeEl = $("#canvasSize");
  if (sizeEl) sizeEl.textContent = `${w} × ${h} px`;
  document.querySelectorAll("[data-ratio]").forEach((b) => b.classList.toggle("active", b.dataset.ratio === ratio));
  draw(); scheduleSave();
}

function roundedRect(c, x, y, w, h, r) {
  c.beginPath();
  if (c.roundRect) {
    c.roundRect(x, y, w, h, r);
  } else {
    c.rect(x, y, w, h);
  }
  c.closePath();
}

function clamp(value, min, max) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : (min + max) / 2;
}

function normalisePosition(value) {
  return { x: clamp(Number(value?.x), 0, 1), y: clamp(Number(value?.y), 0, 1) };
}

function dataUrlType(value) {
  return /^data:(image\/(?:png|jpeg));base64,/i.exec(value)?.[1]?.toLowerCase() || "";
}

function coverImage(c, img, x, y, w, h, position = { x: 0.5, y: 0.5 }, zoom = 1.0, rotate = 0) {
  c.save();
  // Clip to destination slot rectangle
  c.beginPath();
  c.rect(x, y, w, h);
  c.clip();

  const ir = img.width / img.height, tr = w / h;
  let baseSw, baseSh;
  if (ir > tr) {
    baseSh = img.height;
    baseSw = baseSh * tr;
  } else {
    baseSw = img.width;
    baseSh = baseSw / tr;
  }

  const effectiveZoom = clamp(zoom || 1.0, 0.5, 4.0);
  const sw = baseSw / effectiveZoom;
  const sh = baseSh / effectiveZoom;

  const px = clamp(Number(position.x), 0, 1);
  const py = clamp(Number(position.y), 0, 1);
  const sx = (img.width - sw) * px;
  const sy = (img.height - sh) * py;

  const centerX = x + w / 2;
  const centerY = y + h / 2;

  if (rotate) {
    c.translate(centerX, centerY);
    c.rotate((rotate * Math.PI) / 180);
    c.drawImage(img, sx, sy, sw, sh, -w / 2, -h / 2, w, h);
  } else {
    c.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  c.restore();
}

function drawPlaceholder(c, x, y, w, h, index) {
  c.fillStyle = index % 2 ? "#b9b2a6" : "#ccc4b7";
  c.fillRect(x, y, w, h);
  c.strokeStyle = "rgba(56,50,44,.25)";
  c.lineWidth = Math.max(2, w * 0.006);
  c.beginPath();
  c.moveTo(x, y + h);
  c.lineTo(x + w * 0.36, y + h * 0.58);
  c.lineTo(x + w * 0.56, y + h * 0.73);
  c.lineTo(x + w, y + h * 0.3);
  c.stroke();

  // Subtle slot number
  c.fillStyle = "rgba(40,35,30,0.45)";
  c.font = `bold ${Math.max(16, Math.round(w * 0.06))}px ui-monospace, sans-serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(`컷 ${index + 1}`, x + w / 2, y + h / 2);
}

function imageForSlot(index) {
  return state.images[index] || null;
}

function drawSlot(c, x, y, w, h, index) {
  const record = imageForSlot(index);
  if (record && record.img) {
    coverImage(c, record.img, x, y, w, h, record.position, record.zoom, record.rotate);
  } else {
    drawPlaceholder(c, x, y, w, h, index);
  }

  // If this slot is actively selected in slot manager, draw a subtle indicator outline
  if (selectedItem?.type === "slot" && selectedItem.index === index) {
    c.save();
    c.strokeStyle = "#2b74d9";
    c.lineWidth = Math.max(3, w * 0.015);
    c.setLineDash([8, 6]);
    c.strokeRect(x, y, w, h);
    c.restore();
  }
}

function slotRects(w, h, t = activeTemplate()) {
  const marginMul = clamp(state.frameMargin || 1.0, 0.5, 2.0);
  if (t.frame === "camera") {
    const m = w * 0.075 * marginMul, top = h * 0.17, sw = w * 0.7, sh = h * 0.62;
    return [{ x: m + w * 0.018, y: top + w * 0.018, w: sw - w * 0.036, h: sh - w * 0.036 }];
  }
  if (t.frame === "fourcut") {
    const gap = h * 0.018 * marginMul, m = w * 0.16 * marginMul, top = h * 0.045, bottom = h * 0.13;
    const sh = (h - top - bottom - gap * 3) / 4;
    return Array.from({ length: 4 }, (_, i) => ({
      x: m + w * 0.012,
      y: top + i * (sh + gap) + w * 0.012,
      w: w - m * 2 - w * 0.024,
      h: sh - w * 0.024
    }));
  }
  if (t.frame === "film") {
    const m = w * 0.055 * marginMul, gap = w * 0.025 * marginMul;
    const cellW = (w - m * 2 - gap) / 2, cellH = (h - m * 2 - gap) / 2;
    return Array.from({ length: 4 }, (_, i) => ({
      x: m + (i % 2) * (cellW + gap),
      y: m + 18 + Math.floor(i / 2) * (cellH + gap) - 9,
      w: cellW,
      h: cellH - 18
    }));
  }
  const m = w * 0.095 * marginMul;
  return [{ x: m + w * 0.022, y: m + w * 0.022, w: w - 2 * m - w * 0.044, h: h - 2 * m - h * 0.16 }];
}

function drawFrame(c, w, h, t) {
  c.save();
  // Frame rotation & transform if applied
  if (state.frameRotate) {
    c.translate(w / 2, h / 2);
    c.rotate((state.frameRotate * Math.PI) / 180);
    c.translate(-w / 2, -h / 2);
  }

  const bgColor = state.frameColor || t.color;
  const accentColor = state.frameAccent || t.accent;

  if (t.frame === "camera") drawCamera(c, w, h, t, bgColor, accentColor);
  else if (t.frame === "fourcut") drawFourCut(c, w, h, t, bgColor, accentColor);
  else if (t.frame === "film") drawFilm(c, w, h, t, bgColor, accentColor);
  else if (t.frame === "gingham") drawGingham(c, w, h, t, bgColor, accentColor);

  // If the frame itself is selected, draw bounding handles
  if (selectedItem?.type === "frame") {
    drawBoundingBox(c, { x: 10, y: 10, w: w - 20, h: h - 20, rot: 0 }, "네컷 프레임");
  }

  c.restore();
}

function drawCamera(c, w, h, t, bgColor, accentColor) {
  const marginMul = clamp(state.frameMargin || 1.0, 0.5, 2.0);
  c.fillStyle = bgColor;
  c.fillRect(0, 0, w, h);
  const m = w * 0.075 * marginMul, top = h * 0.17, sw = w * 0.7, sh = h * 0.62;
  c.fillStyle = "#514e49";
  roundedRect(c, m, top, sw, sh, w * 0.015);
  c.fill();
  drawSlot(c, m + w * 0.018, top + w * 0.018, sw - w * 0.036, sh - w * 0.036, 0);

  c.fillStyle = "#24221f";
  c.beginPath();
  c.arc(w * 0.865, h * 0.34, w * 0.055, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = "#8b877f";
  c.lineWidth = w * 0.015;
  c.stroke();

  c.fillStyle = "#bbb5a9";
  c.beginPath();
  c.arc(w * 0.865, h * 0.58, w * 0.09, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = "#625e57";
  c.lineWidth = w * 0.012;
  c.stroke();
  c.beginPath();
  c.arc(w * 0.865, h * 0.58, w * 0.045, 0, Math.PI * 2);
  c.stroke();

  c.fillStyle = "#33302c";
  c.font = `700 ${w * 0.036}px ui-monospace`;
  c.fillText("CUT NOTE", m, h * 0.1);
  c.fillStyle = accentColor;
  c.fillRect(w * 0.78, h * 0.78, w * 0.16, w * 0.018);
}

function drawFourCut(c, w, h, t, bgColor, accentColor) {
  c.fillStyle = bgColor;
  c.fillRect(0, 0, w, h);
  const marginMul = clamp(state.frameMargin || 1.0, 0.5, 2.0);
  const gap = h * 0.018 * marginMul, m = w * 0.16 * marginMul, top = h * 0.045, bottom = h * 0.13;
  const sh = (h - top - bottom - gap * 3) / 4;
  for (let i = 0; i < 4; i++) {
    c.fillStyle = "#2e2a26";
    c.fillRect(m, top + i * (sh + gap), w - m * 2, sh);
    drawSlot(c, m + w * 0.012, top + i * (sh + gap) + w * 0.012, w - m * 2 - w * 0.024, sh - w * 0.024, i);
  }
  c.save();
  c.translate(w * 0.5, h * 0.955);
  c.rotate(-0.02);
  c.textAlign = "center";
  c.font = `700 ${w * 0.055}px Gaegu`;
  c.fillStyle = accentColor;
  c.fillText("our little moments", 0, 0);
  c.restore();
}

function drawFilm(c, w, h, t, bgColor, accentColor) {
  c.fillStyle = bgColor;
  c.fillRect(0, 0, w, h);
  const marginMul = clamp(state.frameMargin || 1.0, 0.5, 2.0);
  const m = w * 0.055 * marginMul, gap = w * 0.025 * marginMul;
  const cellW = (w - m * 2 - gap) / 2, cellH = (h - m * 2 - gap) / 2;

  c.fillStyle = accentColor;
  for (let x = 12; x < w; x += 42) {
    c.fillRect(x, 12, 23, 14);
    c.fillRect(x, h - 26, 23, 14);
  }
  for (let i = 0; i < 4; i++) {
    const x = m + (i % 2) * (cellW + gap);
    const y = m + 18 + Math.floor(i / 2) * (cellH + gap) - 9;
    drawSlot(c, x, y, cellW, cellH - 18, i);
    c.fillStyle = "#e9c670";
    c.font = `${w * 0.018}px ui-monospace`;
    c.fillText(`${47 + i}`, x + 6, y + cellH - 24);
  }
}

function drawGingham(c, w, h, t, bgColor, accentColor) {
  c.fillStyle = "#f7ede4";
  c.fillRect(0, 0, w, h);
  const s = w * 0.055;
  c.globalAlpha = 0.28;
  c.fillStyle = accentColor;
  for (let x = 0; x < w; x += s * 2) c.fillRect(x, 0, s, h);
  for (let y = 0; y < h; y += s * 2) c.fillRect(0, y, w, s);
  c.globalAlpha = 1;

  const marginMul = clamp(state.frameMargin || 1.0, 0.5, 2.0);
  const m = w * 0.095 * marginMul;
  c.fillStyle = bgColor;
  c.fillRect(m, m, w - 2 * m, h - 2 * m);
  drawSlot(c, m + w * 0.022, m + w * 0.022, w - 2 * m - w * 0.044, h - 2 * m - h * 0.16, 0);

  c.fillStyle = accentColor;
  c.font = `700 ${w * 0.05}px Gaegu`;
  c.textAlign = "center";
  c.fillText("remember this day", w / 2, h - m - h * 0.045);
  c.textAlign = "left";
}

function drawSingleSticker(c, stickerObj, w, h) {
  const { key, x, y, size, rotation, dataUrl, img } = stickerObj;
  c.save();
  c.translate(x, y);
  if (rotation) c.rotate((rotation * Math.PI) / 180);

  if (img) {
    // Custom uploaded image sticker
    c.drawImage(img, -size / 2, -size / 2, size, size);
  } else if (key && STICKERS[key]) {
    const sDef = STICKERS[key];
    if (sDef.type === "vector-rich" && typeof sDef.render === "function") {
      sDef.render(c, size);
    } else if (sDef.path) {
      const p = new Path2D(sDef.path);
      c.scale(size / 100, size / 100);
      c.translate(-50, -50);
      c.strokeStyle = activeTemplate().frame === "film" ? "#f4ead8" : "#29241e";
      c.lineWidth = 3.2;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.stroke(p);
    }
  }
  c.restore();

  // If this sticker is selected, draw interactive transform handles
  if (selectedItem?.type === "sticker" && selectedItem.id === stickerObj.id) {
    drawStickerTransformHandles(c, stickerObj);
  }
}

function drawStickerTransformHandles(c, sticker) {
  const { x, y, size, rotation } = sticker;
  const half = size / 2;
  c.save();
  c.translate(x, y);
  if (rotation) c.rotate((rotation * Math.PI) / 180);

  // Outline
  c.strokeStyle = "#2b74d9";
  c.lineWidth = 2.5;
  c.strokeRect(-half, -half, size, size);

  // Resize Handle (bottom-right)
  c.fillStyle = "#ffffff";
  c.strokeStyle = "#2b74d9";
  c.lineWidth = 2;
  c.fillRect(half - 7, half - 7, 14, 14);
  c.strokeRect(half - 7, half - 7, 14, 14);

  // Rotate Handle (top stem)
  c.beginPath();
  c.moveTo(0, -half);
  c.lineTo(0, -half - 24);
  c.stroke();
  c.beginPath();
  c.arc(0, -half - 24, 7, 0, Math.PI * 2);
  c.fill();
  c.stroke();

  c.restore();
}

function drawBoundingBox(c, rect, label) {
  c.save();
  c.strokeStyle = "#2b74d9";
  c.lineWidth = 3;
  c.setLineDash([8, 6]);
  c.strokeRect(rect.x, rect.y, rect.w, rect.h);
  c.setLineDash([]);
  
  // Rotation stem & knob at top center
  const centerX = rect.x + rect.w / 2;
  c.beginPath();
  c.moveTo(centerX, rect.y);
  c.lineTo(centerX, rect.y + 22);
  c.stroke();
  c.fillStyle = "#ffffff";
  c.beginPath();
  c.arc(centerX, rect.y + 22, 9, 0, Math.PI * 2);
  c.fill();
  c.stroke();

  if (label) {
    c.fillStyle = "#2b74d9";
    c.font = "bold 18px sans-serif";
    c.fillText(label, rect.x + 16, rect.y + 36);
  }
  c.restore();
}

function drawStickers(c, w, h) {
  // Render free interactive stickers list
  for (const st of state.stickers) {
    drawSingleSticker(c, st, w, h);
  }

  // Legacy single sticker support if present and not in list
  if (state.sticker && STICKERS[state.sticker] && state.stickers.length === 0) {
    const key = state.sticker;
    const size = Math.min(w, h) * 0.16;
    const def = STICKERS[key];
    if (def.path) {
      const p = new Path2D(def.path);
      c.save();
      c.translate(w - size * 1.05, size * 0.35);
      c.scale(size / 100, size / 100);
      c.strokeStyle = activeTemplate().frame === "film" ? "#f4ead8" : "#29241e";
      c.lineWidth = 3.2;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.stroke(p);
      c.restore();
    }
  }
}

// Draw text caption
function drawCaption(c, w, h) {
  const text = state.caption.trim();
  if (!text) return;
  const scale = w / 1080;
  const size = Math.round(state.fontSize * scale);
  c.font = `700 ${size}px Gaegu`;
  c.textAlign = "center";
  c.textBaseline = "middle";

  let y = h * 0.86;
  if (state.textPosition === "top") y = h * 0.1;
  if (state.textPosition === "center") y = h * 0.5;

  c.lineWidth = Math.max(5, size * 0.13);
  c.strokeStyle = "rgba(28,24,21,.66)";
  c.fillStyle = state.textColor;

  const max = w * 0.76;
  const words = [...text];
  const lines = [];
  let line = "";
  for (const char of words) {
    if (c.measureText(line + char).width > max && line) {
      lines.push(line);
      line = char;
    } else line += char;
  }
  if (line) lines.push(line);

  const lh = size * 1.15;
  const start = y - ((lines.length - 1) * lh) / 2;
  lines.slice(0,3).forEach((l, i) => {
    c.strokeText(l, w / 2, start + i * lh);
    c.fillText(l, w / 2, start + i * lh);
  });
}

function draw(target = canvas, targetState = state) {
  const c = target.getContext("2d");
  const w = target.width, h = target.height;
  c.clearRect(0, 0, w, h);

  const original = { ...state };
  Object.assign(state, targetState);

  drawFrame(c, w, h, activeTemplate());
  drawStickers(c, w, h);
  drawCaption(c, w, h);

  Object.assign(state, original);

  const hasAnyImg = state.images.some(Boolean);
  const emptyEl = $("#emptyCanvas");
  if (emptyEl) emptyEl.hidden = hasAnyImg;
}

let saveTimer;
function scheduleSave() {
  clearTimeout(saveTimer);
  const statusEl = $("#statusText");
  if (statusEl) statusEl.textContent = "저장 중…";
  saveTimer = setTimeout(() => {
    // Preserve state without huge Image DOM objects
    const serialisableStickers = state.stickers.map((s) => ({
      id: s.id,
      key: s.key,
      type: s.type,
      x: s.x,
      y: s.y,
      size: s.size,
      rotation: s.rotation,
      dataUrl: s.dataUrl || null,
      label: s.label || null
    }));
    const serialisableImages = state.images.map((r) =>
      r ? {
        name: r.name,
        type: r.type,
        dataUrl: r.dataUrl,
        position:normalisePosition(r.position),
        zoom: r.zoom || 1.0,
        rotate: r.rotate || 0
      } : null
    );

    localStorage.setItem(
      "cutnote-state",
      JSON.stringify({
        ...state,
        stickers: serialisableStickers,
        images: serialisableImages
      })
    );
    if (statusEl) statusEl.textContent = "자동 저장됨";
  }, 180);
}

async function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem("cutnote-state") || "null");
    if (saved && RATIOS[saved.ratio]) {
      // restore images if available
      const restoredImages = await Promise.all(
        (saved.images || []).map((r) => (r ? restoreImageRecord(r) : null))
      );
      // restore stickers
      const restoredStickers = await Promise.all(
        (saved.stickers || []).map(async (s) => {
          if (s.dataUrl) {
            const img = await imageFromDataUrl(s.dataUrl).catch(() => null);
            return { ...s, img };
          }
          return s;
        })
      );
      Object.assign(state, saved, {
        images: restoredImages.length ? restoredImages : [null, null, null, null],
        stickers: restoredStickers
      });
      syncFrameColorControls();
      renderFileList();
    }
  } catch {}
}

function syncFrameColorControls() {
  const t = activeTemplate();
  const bgInput = $("#frameBgColor");
  const bgHex = $("#frameBgColorHex");
  const acInput = $("#frameAccentColor");
  const acHex = $("#frameAccentColorHex");
  const rotInput = $("#frameRotate");
  const rotVal = $("#frameRotVal");
  const marginInput = $("#frameMargin");
  const marginVal = $("#frameMarginVal");

  if (bgInput) bgInput.value = state.frameColor || t.color;
  if (bgHex) bgHex.textContent = state.frameColor || t.color;
  if (acInput) acInput.value = state.frameAccent || t.accent;
  if (acHex) acHex.textContent = state.frameAccent || t.accent;
  if (rotInput) rotInput.value = state.frameRotate || 0;
  if (rotVal) rotVal.textContent = `${state.frameRotate || 0}°`;
  if (marginInput) marginInput.value = state.frameMargin || 1.0;
  if (marginVal) {
    const m = state.frameMargin || 1.0;
    marginVal.textContent = m === 1.0 ? "보통" : m < 1.0 ? "좁게" : "넓게";
  }
}

function templateHtml(t) {
  return `<button type="button" class="template-card ${t.id === state.templateId ? "active" : ""}" data-template="${t.id}" style="--preview-color:${t.color}">
    <span class="template-preview"></span>
    <strong>${escapeHtml(t.name)}</strong>
    <small>${escapeHtml(t.subtitle || "my preset")}</small>
  </button>`;
}
function renderTemplates() {
  const grid = $("#templateGrid");
  if (grid) grid.innerHTML = allTemplates().map(templateHtml).join("");
}
function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

let activeStickerCategory = "y2k";
function renderStickers() {
  const grid = $("#stickerGrid");
  if (!grid) return;
  const filtered = Object.entries(STICKERS).filter(([k, s]) => s.category === activeStickerCategory);

  grid.innerHTML = filtered.map(([k, s]) => {
    let innerSvg = "";
    if (s.svg) {
      innerSvg = s.svg;
    } else if (s.path) {
      innerSvg = `<path d="${s.path}"/>`;
    }

    const isDoodle = s.category === "doodle";
    return `<button type="button" class="sticker ${isDoodle ? "doodle" : "rich-preview"}" data-sticker="${k}" aria-label="${s.label}" title="${s.label}">
      <svg viewBox="0 0 100 100" aria-hidden="true">${innerSvg}</svg>
    </button>`;
  }).join("");
}

function addStickerToCanvas(key, customImg = null, customDataUrl = null) {
  const [w, h] = RATIOS[state.ratio];
  const size = Math.min(w, h) * 0.18;
  const newSticker = {
    id: `stk-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    key: key || "custom",
    type: customImg ? "image" : "vector",
    x: w * 0.5 + (Math.random() - 0.5) * w * 0.2,
    y: h * 0.5 + (Math.random() - 0.5) * h * 0.2,
    size,
    rotation: Math.round((Math.random() - 0.5) * 20),
    img: customImg || null,
    dataUrl: customDataUrl || null,
    label: key && STICKERS[key] ? STICKERS[key].label : "커스텀 스티커"
  };
  state.stickers.push(newSticker);
  selectItem({ type: "sticker", id: newSticker.id });
  draw();
  scheduleSave();
}

async function handleImages(files) {
  $("#fileError").textContent = "";
  const list = [...files].slice(0, 4);
  if (!list.length) return;
  if (list.some((f) => !["image/png", "image/jpeg"].includes(f.type))) {
    $("#fileError").textContent = "PNG 또는 JPEG 파일만 사용할 수 있어요.";
    return;
  }
  try {
    const loaded = await Promise.all(list.map(loadImageFile));
    // Fill up slots sequentially
    for (let i = 0; i < 4; i++) {
      if (i < loaded.length) {
        state.images[i] = loaded[i];
      }
    }
    renderFileList();
    syncSlotControlBlock();
    draw();
    scheduleSave();
  } catch {
    $("#fileError").textContent = "이미지를 읽지 못했어요. 손상되지 않은 파일인지 확인해주세요.";
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function imageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지 데이터를 읽지 못했습니다."));
    img.src = dataUrl;
  });
}
async function loadImageFile(file) {
  const dataUrl = await fileToDataUrl(file);
  const img = await imageFromDataUrl(dataUrl);
  return {
    img,
    dataUrl,
    name: file.name,
    type: file.type,
    position: { x: 0.5, y: 0.5 },
    zoom: 1.0,
    rotate: 0
  };
}
async function restoreImageRecord(record) {
  const img = await imageFromDataUrl(record.dataUrl);
  return {
    img,
    dataUrl:record.dataUrl,
    name: record.name || "복원한 사진",
    type: record.type || dataUrlType(record.dataUrl),
    position: normalisePosition(record.position),
    zoom: clamp(Number(record.zoom) || 1.0, 0.5, 4.0),
    rotate: Number(record.rotate) || 0
  };
}

function renderFileList() {
  const listEl = $("#fileList");
  if (!listEl) return;
  listEl.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const record = state.images[i];
    const item = document.createElement("div");
    item.className = `slot-item ${activeSlotIndex === i ? "active" : ""}`;
    item.dataset.index = i;
    item.title = `클릭해 ${i + 1}번 컷 선택 / 더블클릭해 사진 교체`;

    const badge = document.createElement("span");
    badge.className = "slot-num-badge";
    badge.textContent = `${i + 1}번`;
    item.append(badge);

    if (record && record.dataUrl) {
      const img = document.createElement("img");
      img.alt = `컷 ${i + 1}: ${record.name}`;
      img.src = record.dataUrl;
      item.append(img);
    } else {
      const emptyLabel = document.createElement("span");
      emptyLabel.className = "slot-empty-label";
      emptyLabel.innerHTML = `비어있음<br/><small>+ 추가</small>`;
      item.append(emptyLabel);
    }

    item.addEventListener("click", () => {
      activeSlotIndex = i;
      selectItem({ type: "slot", index: i });
      renderFileList();
      syncSlotControlBlock();
      draw();
    });

    item.addEventListener("dblclick", () => {
      pendingSlot = i;
      $("#slotImageInput").click();
    });

    listEl.append(item);
  }
}

function syncSlotControlBlock() {
  const record = state.images[activeSlotIndex];
  const infoEl = $("#activeSlotInfo");
  const zoomInput = $("#slotZoom");
  const zoomVal = $("#slotZoomVal");
  const rotInput = $("#slotRotate");
  const rotVal = $("#slotRotateVal");

  if (infoEl) {
    infoEl.textContent = `선택된 칸: ${activeSlotIndex + 1}번 컷 ${record ? `(${record.name})` : "(사진 없음)"}`;
  }
  if (zoomInput) zoomInput.value = record?.zoom || 1.0;
  if (zoomVal) zoomVal.textContent = `${(record?.zoom || 1.0).toFixed(1)}x`;
  if (rotInput) rotInput.value = record?.rotate || 0;
  if (rotVal) rotVal.textContent = `${record?.rotate || 0}°`;
}

let pendingSlot = 0;
async function loadIntoSlot(file, index) {
  if (!file) return;
  try {
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      throw new Error("PNG 또는 JPEG 파일만 사용할 수 있어요.");
    }
    state.images[index] = await loadImageFile(file);
    renderFileList();
    syncSlotControlBlock();
    draw();
    scheduleSave();
    $("#fileError").textContent = "";
  } catch (err) {
    $("#fileError").textContent = err.message || "이미지를 읽지 못했어요.";
  }
}

function selectItem(item) {
  selectedItem = item;
  const statusEl = $("#selectionStatus");
  if (statusEl) {
    if (!item) {
      statusEl.textContent = "선택된 요소: 없음 (캔버스 항목 클릭)";
    } else if (item.type === "sticker") {
      const st = state.stickers.find((s) => s.id === item.id);
      statusEl.textContent = `선택됨: 스티커 (${st?.label || "스티커"})`;
    } else if (item.type === "slot") {
      statusEl.textContent = `선택됨: ${item.index + 1}번 사진 칸`;
    } else if (item.type === "frame") {
      statusEl.textContent = `선택됨: 네컷 프레임`;
    }
  }
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height
  };
}

function slotAt(event) {
  const p = canvasPoint(event);
  return slotRects(canvas.width, canvas.height).findIndex(
    (r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h
  );
}

// Check hit for stickers (reverse order for top-first)
function stickerHitAt(p) {
  for (let i = state.stickers.length - 1; i >= 0; i--) {
    const st = state.stickers[i];
    const rad = (st.rotation * Math.PI) / 180;
    const cos = Math.cos(-rad), sin = Math.sin(-rad);
    const dx = p.x - st.x, dy = p.y - st.y;
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;

    const half = st.size / 2;

    // Check Rotate handle hit (circle at [0, -half - 24], radius 14)
    if (selectedItem?.id === st.id) {
      const rDist = Math.hypot(lx - 0, ly - (-half - 24));
      if (rDist <= 16) {
        return { sticker: st, handle: "rotate" };
      }
      // Check Scale handle hit (bottom-right [half, half], radius 14)
      const sDist = Math.hypot(lx - half, ly - half);
      if (sDist <= 16) {
        return { sticker: st, handle: "scale" };
      }
    }

    // Check Body hit
    if (Math.abs(lx) <= half && Math.abs(ly) <= half) {
      return { sticker: st, handle: "body" };
    }
  }
  return null;
}

function bindCanvasEditing() {
  canvas.addEventListener("dblclick", (event) => {
    const index = slotAt(event);
    if (index < 0) return;
    pendingSlot = index;
    activeSlotIndex = index;
    renderFileList();
    syncSlotControlBlock();
    $("#slotImageInput").click();
  });

  $("#slotImageInput").addEventListener("change", (event) => {
    loadIntoSlot(event.target.files[0], pendingSlot);
    event.target.value = "";
  });

  canvas.addEventListener("pointerdown", (event) => {
    const p = canvasPoint(event);
    const hitSticker = stickerHitAt(p);

    if (hitSticker) {
      const { sticker, handle } = hitSticker;
      selectItem({ type: "sticker", id: sticker.id });

      if (handle === "rotate") {
        interactionMode = "rotate";
        interactionStart = {
          startAngle: Math.atan2(p.y - sticker.y, p.x - sticker.x),
          originRot: sticker.rotation || 0,
          sticker
        };
        canvas.className = "drag-rot";
      } else if (handle === "scale") {
        interactionMode = "scale";
        interactionStart = {
          startDist: Math.hypot(p.x - sticker.x, p.y - sticker.y),
          originSize: sticker.size,
          sticker
        };
        canvas.className = "drag-scale";
      } else {
        interactionMode = "drag";
        interactionStart = {
          startX: p.x,
          startY: p.y,
          originX: sticker.x,
          originY: sticker.y,
          sticker
        };
        canvas.className = "drag-move";
      }
      canvas.setPointerCapture(event.pointerId);
      draw();
      return;
    }

    // Check slot hit
    const slotIdx = slotAt(event);
    if (slotIdx >= 0) {
      activeSlotIndex = slotIdx;
      selectItem({ type: "slot", index: slotIdx });
      renderFileList();
      syncSlotControlBlock();

      const record = imageForSlot(slotIdx);
      if (record) {
        if (!state.images[slotIdx]) {
          state.images[slotIdx] = { ...record, position: { ...record.position } };
        }
        const activeRecord = state.images[slotIdx];
        interactionMode = "slot-pan";
        interactionStart = {
          index: slotIdx,
          record: activeRecord,
          start: p,
          origin: { ...activeRecord.position }
        };
        canvas.className = "drag-move";
        canvas.setPointerCapture(event.pointerId);
      }
      draw();
      return;
    }

    // Check if clicked frame rotate handle (top handle)
    const [w, h] = RATIOS[state.ratio];
    const topHandleDist = Math.hypot(p.x - w / 2, p.y - 18);
    if (selectedItem?.type === "frame" && topHandleDist <= 28) {
      interactionMode = "frame-rotate";
      interactionStart = {
        startAngle: Math.atan2(p.y - h / 2, p.x - w / 2),
        originRot: state.frameRotate || 0
      };
      canvas.className = "drag-rot";
      canvas.setPointerCapture(event.pointerId);
      draw();
      return;
    }

    // Clicked outside elements -> select Frame and allow drag rotation/offset
    selectItem({ type: "frame" });
    interactionMode = "frame-drag";
    interactionStart = {
      startX: p.x,
      startY: p.y,
      originRot: state.frameRotate || 0
    };
    canvas.className = "drag-move";
    canvas.setPointerCapture(event.pointerId);
    draw();
  });

  canvas.addEventListener("pointermove", (event) => {
    const p = canvasPoint(event);

    if (!interactionMode || !interactionStart) {
      // Dynamic cursor update
      const hit = stickerHitAt(p);
      if (hit) {
        canvas.className = hit.handle === "rotate" ? "drag-rot" : hit.handle === "scale" ? "drag-scale" : "drag-move";
      } else if (slotAt(event) >= 0) {
        canvas.className = "drag-move";
      } else {
        canvas.className = "";
      }
      return;
    }

    if (interactionMode === "frame-drag") {
      const { startX, startY, originRot } = interactionStart;
      const dx = p.x - startX;
      // Gentle rotation drag adjustment
      const delta = Math.round(dx * 0.08);
      state.frameRotate = clamp(originRot + delta, -45, 45);
      syncFrameColorControls();
      draw();
      return;
    } else if (interactionMode === "frame-rotate") {
      const [w, h] = RATIOS[state.ratio];
      const { startAngle, originRot } = interactionStart;
      const curAngle = Math.atan2(p.y - h / 2, p.x - w / 2);
      const deltaDeg = ((curAngle - startAngle) * 180) / Math.PI;
      state.frameRotate = clamp(Math.round(originRot + deltaDeg), -45, 45);
      syncFrameColorControls();
      draw();
      return;
    } else if (interactionMode === "drag") {
      const { sticker, startX, startY, originX, originY } = interactionStart;
      sticker.x = originX + (p.x - startX);
      sticker.y = originY + (p.y - startY);
      draw();
    } else if (interactionMode === "rotate") {
      const { sticker, startAngle, originRot } = interactionStart;
      const curAngle = Math.atan2(p.y - sticker.y, p.x - sticker.x);
      const deltaDeg = ((curAngle - startAngle) * 180) / Math.PI;
      sticker.rotation = Math.round(originRot + deltaDeg);
      draw();
    } else if (interactionMode === "scale") {
      const { sticker, startDist, originSize } = interactionStart;
      const curDist = Math.hypot(p.x - sticker.x, p.y - sticker.y);
      const ratio = curDist / startDist;
      sticker.size = clamp(Math.round(originSize * ratio), 30, Math.min(canvas.width, canvas.height) * 0.9);
      draw();
    } else if (interactionMode === "slot-pan") {
      const { record, start, origin, index } = interactionStart;
      const rect = slotRects(canvas.width, canvas.height)[index];
      const zoom = record.zoom || 1.0;
      record.position = {
        x: clamp(origin.x - ((p.x - start.x) / rect.w) / zoom, 0, 1),
        y: clamp(origin.y - ((p.y - start.y) / rect.h) / zoom, 0, 1)
      };
      draw();
    }
  });

  const finishInteraction = () => {
    if (!interactionMode) return;
    interactionMode = null;
    interactionStart = null;
    canvas.className = "";
    scheduleSave();
  };

  canvas.addEventListener("pointerup", finishInteraction);
  canvas.addEventListener("pointercancel", finishInteraction);
}

function bindSlotManagerEvents() {
  // Slot Zoom & Rotate sliders
  $("#slotZoom")?.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    $("#slotZoomVal").textContent = `${val.toFixed(1)}x`;
    if (state.images[activeSlotIndex]) {
      state.images[activeSlotIndex].zoom = val;
      draw();
      scheduleSave();
    }
  });

  $("#slotRotate")?.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    $("#slotRotateVal").textContent = `${val}°`;
    if (state.images[activeSlotIndex]) {
      state.images[activeSlotIndex].rotate = val;
      draw();
      scheduleSave();
    }
  });

  // Slot Order & Positions
  $("#slotMoveUp")?.addEventListener("click", () => {
    if (activeSlotIndex > 0) {
      const prev = activeSlotIndex - 1;
      const tmp = state.images[prev];
      state.images[prev] = state.images[activeSlotIndex];
      state.images[activeSlotIndex] = tmp;
      activeSlotIndex = prev;
      renderFileList();
      syncSlotControlBlock();
      draw();
      scheduleSave();
    }
  });

  $("#slotMoveDown")?.addEventListener("click", () => {
    if (activeSlotIndex < 3) {
      const next = activeSlotIndex + 1;
      const tmp = state.images[next];
      state.images[next] = state.images[activeSlotIndex];
      state.images[activeSlotIndex] = tmp;
      activeSlotIndex = next;
      renderFileList();
      syncSlotControlBlock();
      draw();
      scheduleSave();
    }
  });

  $("#slotResetPos")?.addEventListener("click", () => {
    if (state.images[activeSlotIndex]) {
      state.images[activeSlotIndex].position = { x: 0.5, y: 0.5 };
      state.images[activeSlotIndex].zoom = 1.0;
      state.images[activeSlotIndex].rotate = 0;
      syncSlotControlBlock();
      draw();
      scheduleSave();
    }
  });

  $("#slotRemoveImg")?.addEventListener("click", () => {
    state.images[activeSlotIndex] = null;
    renderFileList();
    syncSlotControlBlock();
    draw();
    scheduleSave();
  });
}

function bindToolbarEvents() {
  $("#btnDeleteSelected")?.addEventListener("click", () => {
    if (selectedItem?.type === "sticker") {
      state.stickers = state.stickers.filter((s) => s.id !== selectedItem.id);
      selectItem(null);
      draw();
      scheduleSave();
    } else if (selectedItem?.type === "slot") {
      state.images[selectedItem.index] = null;
      renderFileList();
      syncSlotControlBlock();
      draw();
      scheduleSave();
    }
  });

  $("#btnBringForward")?.addEventListener("click", () => {
    if (selectedItem?.type === "sticker") {
      const idx = state.stickers.findIndex((s) => s.id === selectedItem.id);
      if (idx >= 0 && idx < state.stickers.length - 1) {
        const item = state.stickers.splice(idx, 1)[0];
        state.stickers.splice(idx + 1, 0, item);
        draw();
        scheduleSave();
      }
    }
  });

  $("#btnSendBackward")?.addEventListener("click", () => {
    if (selectedItem?.type === "sticker") {
      const idx = state.stickers.findIndex((s) => s.id === selectedItem.id);
      if (idx > 0) {
        const item = state.stickers.splice(idx, 1)[0];
        state.stickers.splice(idx - 1, 0, item);
        draw();
        scheduleSave();
      }
    }
  });

  $("#btnResetSelected")?.addEventListener("click", () => {
    if (selectedItem?.type === "sticker") {
      const st = state.stickers.find((s) => s.id === selectedItem.id);
      if (st) {
        st.rotation = 0;
        st.size = Math.min(canvas.width, canvas.height) * 0.18;
        draw();
        scheduleSave();
      }
    } else if (selectedItem?.type === "frame") {
      state.frameRotate = 0;
      state.frameMargin = 1.0;
      syncFrameColorControls();
      draw();
      scheduleSave();
    }
  });
}

function bindFrameEvents() {
  $("#frameBgColor")?.addEventListener("input", (e) => {
    state.frameColor = e.target.value;
    $("#frameBgColorHex").textContent = e.target.value;
    draw();
    scheduleSave();
  });

  $("#frameAccentColor")?.addEventListener("input", (e) => {
    state.frameAccent = e.target.value;
    $("#frameAccentColorHex").textContent = e.target.value;
    draw();
    scheduleSave();
  });

  $("#palettePresets")?.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const bg = btn.dataset.bg;
    const accent = btn.dataset.accent;
    if (bg) {
      state.frameColor = bg;
      $("#frameBgColor").value = bg;
      $("#frameBgColorHex").textContent = bg;
    }
    if (accent) {
      state.frameAccent = accent;
      $("#frameAccentColor").value = accent;
      $("#frameAccentColorHex").textContent = accent;
    }
    draw();
    scheduleSave();
  });

  $("#frameRotate")?.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    state.frameRotate = val;
    $("#frameRotVal").textContent = `${val}°`;
    draw();
    scheduleSave();
  });

  $("#frameMargin")?.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    state.frameMargin = val;
    $("#frameMarginVal").textContent = val === 1.0 ? "보통" : val < 1.0 ? "좁게" : "넓게";
    draw();
    scheduleSave();
  });
}

function bindStickerCategoryEvents() {
  $("#stickerCategories")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".sticker-cat-btn");
    if (!btn) return;
    document.querySelectorAll(".sticker-cat-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeStickerCategory = btn.dataset.cat;
    renderStickers();
  });

  $("#stickerGrid")?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sticker]");
    if (!b) return;
    const key = b.dataset.sticker;
    state.sticker = key; // legacy sync
    addStickerToCanvas(key);
  });

  $("#removeAllStickers")?.addEventListener("click", () => {
    state.stickers = [];
    state.sticker = null;
    selectItem(null);
    draw();
    scheduleSave();
  });

  $("#addCustomStickerBtn")?.addEventListener("click", () => {
    $("#customStickerInput").click();
  });

  $("#customStickerInput")?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      const img = await imageFromDataUrl(dataUrl);
      addStickerToCanvas(null, img, dataUrl);
    } catch {}
    e.target.value = "";
  });
}

function bindEvents() {
  $("#imageInput").addEventListener("change", (e) => handleImages(e.target.files));
  const dz = $("#dropZone");
  ["dragenter", "dragover"].forEach((n) =>
    dz.addEventListener(n, (e) => {
      e.preventDefault();
      dz.classList.add("drag");
    })
  );
  ["dragleave", "drop"].forEach((n) =>
    dz.addEventListener(n, (e) => {
      e.preventDefault();
      dz.classList.remove("drag");
    })
  );
  dz.addEventListener("drop", (e) => {
    e.preventDefault();
    dz.classList.remove("drag");
    handleImages(e.dataTransfer.files);
  });

  // Canvas wrap drop support
  const cWrap = $("#canvasWrap");
  if (cWrap) {
    ["dragenter", "dragover"].forEach((n) =>
      cWrap.addEventListener(n, (e) => {
        e.preventDefault();
      })
    );
    cWrap.addEventListener("drop", (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files && files.length) {
        handleImages(files);
      }
    });
  }

  $("#caption").addEventListener("input", (e) => {
    state.caption = e.target.value;
    draw();
    scheduleSave();
  });
  $("#locationText")?.addEventListener("input", (e) => {
    state.location = e.target.value;
    draw();
    scheduleSave();
  });
  $("#textColor").addEventListener("input", (e) => {
    state.textColor = e.target.value;
    draw();
    scheduleSave();
  });
  $("#fontSize").addEventListener("input", (e) => {
    state.fontSize = Number(e.target.value);
    draw();
    scheduleSave();
  });
  $("#textPosition").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    state.textPosition = b.dataset.value;
    document.querySelectorAll("#textPosition button").forEach((x) => x.classList.toggle("active", x === b));
    draw();
    scheduleSave();
  });
  $("#ratios").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) setRatio(b.dataset.ratio);
  });
  $("#templateGrid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-template]");
    if (!b) return;
    state.templateId = b.dataset.template;
    selectedUserTemplateId = b.dataset.template.startsWith("user-") ? b.dataset.template : null;
    const t = activeTemplate();
    state.frameColor = t.color;
    state.frameAccent = t.accent;
    syncFrameColorControls();
    setRatio(t.ratio);
    renderTemplates();
    draw();
    scheduleSave();
  });

  $("#download").addEventListener("click", downloadPng);
  $("#exportJson").addEventListener("click", exportProject);
  $("#openImport").addEventListener("click", () => $("#importDialog").showModal());
  $("#jsonInput").addEventListener("change", importProject);
  $("#privacyInfo").addEventListener("click", () => $("#infoDialog").showModal());

  $("#saveTemplate").addEventListener("click", saveTemplate);
  $("#updateTemplate").addEventListener("click", updateTemplate);
  $("#deleteTemplate").addEventListener("click", deleteTemplate);

  $("#resetApp").addEventListener("click", () => {
    if (confirm("저장한 설정과 사용자 템플릿을 모두 지울까요?")) {
      localStorage.removeItem("cutnote-state");
      localStorage.removeItem("cutnote-templates");
      location.reload();
    }
  });

  bindSlotManagerEvents();
  bindToolbarEvents();
  bindFrameEvents();
  bindStickerCategoryEvents();
  bindCanvasEditing();
}

function downloadPng() {
  const a = document.createElement("a");
  a.download = `cutnote-${state.ratio.replace(":", "x")}-${Date.now()}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

function serialiseImage(record) {
  return record
    ? {
        name: record.name,
        type: record.type,
        dataUrl: record.dataUrl,
        position: normalisePosition(record.position),
        zoom: record.zoom || 1.0,
        rotate: record.rotate || 0
      }
    : null;
}

function exportProject() {
  const serialisableStickers = state.stickers.map((s) => ({
    id: s.id,
    key: s.key,
    type: s.type,
    x: s.x,
    y: s.y,
    size: s.size,
    rotation: s.rotation,
    dataUrl: s.dataUrl || null,
    label: s.label || null
  }));

  const payload = {
    version:2,
    exportedAt: new Date().toISOString(),
    state: {
      ...state,
      images: state.images.map(serialiseImage),
      stickers: serialisableStickers
    },
    templates: userTemplates
  };
  const a = document.createElement("a");
  a.download = "cutnote-project.json";
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function importProject(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const error = validateProject(data);
    if (error) throw new Error(error);

    const restoredImages = await Promise.all(
      (data.state.images || []).map((record) => (record ? restoreImageRecord(record) : null))
    );
    const restoredStickers = await Promise.all(
      (data.state.stickers || []).map(async (s) => {
        if (s.dataUrl) {
          const img = await imageFromDataUrl(s.dataUrl).catch(() => null);
          return { ...s, img };
        }
        return s;
      })
    );

    const nextTemplates = data.templates;
    const nextState = {
      ...state,
      ...data.state,
      images: restoredImages.length ? restoredImages : [null, null, null, null],
      stickers: restoredStickers
    };

    userTemplates = nextTemplates;
    Object.assign(state, nextState);
    persistTemplates();
    renderTemplates();
    renderStickers();
    renderFileList();
    syncControls();
    syncFrameColorControls();
    syncSlotControlBlock();
    setRatio(state.ratio);
    $("#importDialog").close();
    $("#jsonError").textContent = "";
    scheduleSave();
  } catch (err) {
    $("#jsonError").textContent =
      err instanceof SyntaxError
        ? "JSON 문법이 손상되었습니다. 기존 작업은 유지됩니다."
        : `${err.message} 기존 작업은 유지됩니다.`;
  } finally {
    e.target.value = "";
  }
}

function templateFromState(id, name) {
  const t = activeTemplate();
  return {
    id,
    name,
    subtitle: "my preset",
    frame: t.frame,
    ratio: state.ratio,
    color: state.frameColor || t.color,
    accent: state.frameAccent || t.accent || "#c95745",
    caption: state.caption,
    textColor: state.textColor,
    fontSize: state.fontSize,
    textPosition: state.textPosition,
    sticker: state.sticker
  };
}

export function saveTemplate() {
  const name = $("#templateName").value.trim();
  if (!name) {
    $("#templateMessage").textContent = "이름을 먼저 적어주세요.";
    return;
  }
  const t = templateFromState(uid(), name);
  userTemplates.push(t);
  persistTemplates();
  state.templateId = t.id;
  selectedUserTemplateId = t.id;
  renderTemplates();
  $("#templateMessage").textContent = `‘${name}’ 템플릿을 저장했어요.`;
}

export function updateTemplate() {
  if (!selectedUserTemplateId) {
    $("#templateMessage").textContent = "수정할 내 템플릿을 먼저 선택해주세요.";
    return;
  }
  const old = userTemplates.find((t) => t.id === selectedUserTemplateId);
  const name = $("#templateName").value.trim() || old.name;
  userTemplates = userTemplates.map((t) => (t.id === selectedUserTemplateId ? templateFromState(t.id, name) : t));
  persistTemplates();
  renderTemplates();
  $("#templateMessage").textContent = `‘${name}’ 템플릿을 업데이트했어요.`;
}

export function deleteTemplate() {
  if (!selectedUserTemplateId) {
    $("#templateMessage").textContent = "삭제할 내 템플릿을 먼저 선택해주세요.";
    return;
  }
  const target = userTemplates.find((t) => t.id === selectedUserTemplateId);
  userTemplates = userTemplates.filter((t) => t.id !== selectedUserTemplateId);
  persistTemplates();
  state.templateId = DEFAULT_TEMPLATES[0].id;
  selectedUserTemplateId = null;
  renderTemplates();
  draw();
  $("#templateMessage").textContent = `‘${target.name}’ 템플릿을 삭제했어요.`;
}

function applyTemplateSettings(t) {
  state.templateId = t.id;
  state.ratio = t.ratio;
  if ("caption" in t) state.caption = t.caption;
  if ("sticker" in t) state.sticker = t.sticker;
  if ("textColor" in t) state.textColor = t.textColor;
  if ("fontSize" in t) state.fontSize = t.fontSize;
  if ("textPosition" in t) state.textPosition = t.textPosition;
  state.frameColor = t.color;
  state.frameAccent = t.accent;
  syncControls();
  syncFrameColorControls();
  setRatio(state.ratio);
  renderTemplates();
  renderStickers();
  draw();
  scheduleSave();
}

function syncControls() {
  $("#caption").value = state.caption;
  $("#textColor").value = state.textColor;
  $("#fontSize").value = state.fontSize;
  document.querySelectorAll("#textPosition button").forEach((b) => b.classList.toggle("active", b.dataset.value === state.textPosition));
}

const samples = [
  { name: "늦여름의 우리", meta: "4:5 · 은빛 디카", ratio: "4:5", templateId: "camera-silver", caption: "늦여름의 우리", sticker: "spark", textColor: "#fffaf0", fontSize: 50, textPosition: "bottom", color: "#d8d3c7", accent: "#b34f45" },
  { name: "네 컷의 오후", meta: "9:16 · 크림 네컷", ratio: "9:16", templateId: "life-four", caption: "우리의 작은 오후", sticker: "heart", textColor: "#642f2b", fontSize: 44, textPosition: "bottom", color: "#f4ead8", accent: "#d16758" },
  { name: "필름 속 주말", meta: "1:1 · 필름", ratio: "1:1", templateId: "film-noir", caption: "SUN. 4:32 PM", sticker: "planet", textColor: "#f1dec2", fontSize: 38, textPosition: "center", color: "#26221e", accent: "#dfaa4b" },
];

function renderSamples() {
  const grid = $("#sampleGrid");
  if (!grid) return;
  const files = ["late-summer-4x5.png", "four-cuts-9x16.png", "film-weekend-1x1.png"];
  samples.forEach((sample, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sample-card";
    button.innerHTML = `<img src="samples/${files[i]}" alt="${sample.name} 완성본" /><strong>${sample.name}</strong><span>${sample.meta}</span>`;
    button.addEventListener("click", () => {
      applyTemplateSettings(sample);
      window.scrollTo({ top: $("#editor").offsetTop - 80, behavior: "smooth" });
    });
    grid.append(button);
  });
}

// Initialization
restoreState().then(() => {
  bindEvents();
  renderTemplates();
  renderStickers();
  renderFileList();
  syncControls();
  syncFrameColorControls();
  syncSlotControlBlock();
  setRatio(state.ratio);
  renderSamples();
  draw();
});
