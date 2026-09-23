/* Vector assets for user-uploaded sticker and frame styles */
export const STICKER_SVGS = {
  // Sparkle / Star shapes
  spark: `<path d="M50 8 C48 32 39 43 17 49 C39 54 47 65 50 91 C54 66 62 55 84 49 C61 43 54 31 50 8 M18 15 C17 25 13 29 4 32 C14 35 17 40 18 50 C20 40 24 35 33 32 C24 28 20 24 18 15" />`,
  heart: `<path d="M50 87 C35 74 14 59 14 37 C14 19 36 13 50 31 C64 13 86 19 86 37 C86 59 65 74 50 87" />`,
  flower: `<path d="M50 48 C27 44 22 22 38 18 C48 16 52 30 50 43 C54 20 76 16 82 32 C86 45 67 51 56 49 C76 50 84 67 72 78 C60 88 51 69 51 55 C50 76 33 86 22 74 C12 62 30 51 45 50 M50 47 C54 47 56 51 53 54 C49 57 45 53 47 49" />`,
  smile: `<path d="M18 50 C18 28 31 15 52 15 C76 15 88 31 85 54 C83 75 69 86 48 84 C28 82 17 69 18 50 M34 43 L35 45 M66 42 L67 44 M34 61 C45 71 58 70 69 59" />`,
  planet: `<path d="M32 29 C47 16 70 22 77 40 C84 59 71 78 52 81 C34 84 17 72 15 54 C14 44 20 34 32 29 M5 69 C13 82 43 75 68 61 C91 48 101 34 94 27 C88 20 74 23 64 27" />`,

  // Y2K Chrome & Glass stickers inspired by user uploaded assets
  "glass-heart": `<path d="M50 84 C30 70 12 55 12 34 C12 18 26 10 40 16 C46 19 50 25 50 25 C50 25 54 19 60 16 C74 10 88 18 88 34 C88 55 70 70 50 84 Z" fill="url(#glassGrad)" stroke="#c2d5ec" stroke-width="3"/><ellipse cx="34" cy="30" rx="9" ry="5" transform="rotate(-30 34 30)" fill="#ffffff" opacity="0.85"/><circle cx="68" cy="40" r="3" fill="#ffffff" opacity="0.9"/>`,

  "y2k-star": `<path d="M50 5 L61 36 L94 38 L68 58 L77 90 L50 71 L23 90 L32 58 L6 38 L39 36 Z" fill="url(#chromeGrad)" stroke="#8e9bb0" stroke-width="3" stroke-linejoin="round"/><path d="M50 22 L56 40 L75 41 L60 52 L65 70 L50 59 L35 70 L40 52 L25 41 L44 40 Z" fill="#ffffff" opacity="0.6"/>`,

  "chrome-ring-heart": `<path d="M50 82 C34 70 18 56 18 36 C18 22 30 14 42 20 C46 22 50 28 50 28 C50 28 54 22 58 20 C70 14 82 22 82 36 C82 56 66 70 50 82 Z" fill="url(#chromeGrad)" stroke="#687890" stroke-width="2.5"/><ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="#687890" stroke-width="3.5" transform="rotate(-25 50 50)"/><ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="#ffffff" stroke-width="1.8" transform="rotate(-25 50 50)" stroke-dasharray="70 20"/>`,

  "glitter-4point": `<path d="M50 4 C48 34 34 48 4 50 C34 52 48 66 50 96 C52 66 66 52 96 50 C66 48 52 34 50 4 Z" fill="url(#pearlGrad)" stroke="#b5c6dd" stroke-width="2.5"/><circle cx="50" cy="50" r="5" fill="#ffffff"/>`,

  "bubble-pearl": `<circle cx="50" cy="50" r="42" fill="url(#pearlGrad)" stroke="#bac8db" stroke-width="2.5"/><ellipse cx="36" cy="34" rx="14" ry="8" transform="rotate(-35 36 34)" fill="#ffffff" opacity="0.85"/><circle cx="62" cy="64" r="5" fill="#ffffff" opacity="0.7"/>`,

  "chrome-moon": `<path d="M68 12 C44 14 26 34 26 58 C26 80 43 98 65 98 C74 98 82 95 89 90 C62 88 44 68 44 45 C44 28 54 15 68 12 Z" fill="url(#chromeGrad)" stroke="#7a8b9f" stroke-width="2.5"/><ellipse cx="40" cy="46" rx="6" ry="14" transform="rotate(-20 40 46)" fill="#ffffff" opacity="0.75"/>`,

  "orbit-star": `<path d="M50 14 L58 37 L82 38 L63 52 L70 76 L50 62 L30 76 L37 52 L18 38 L42 37 Z" fill="url(#glassGrad)" stroke="#89a0bc" stroke-width="2.5"/><ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="#7186a2" stroke-width="3" transform="rotate(18 50 50)"/><ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="#ffffff" stroke-width="1.5" transform="rotate(18 50 50)"/>`,

  "camcorder-rec": `<rect x="6" y="16" width="88" height="68" rx="6" fill="#1b1a18" opacity="0.88" stroke="#ffffff" stroke-width="3"/><circle cx="26" cy="36" r="8" fill="#e74c3c"/><text x="40" y="42" fill="#ffffff" font-family="monospace" font-weight="bold" font-size="16">REC</text><text x="24" y="68" fill="#ffffff" font-family="monospace" font-size="13">00:12:03</text><rect x="68" y="30" width="18" height="10" rx="2" fill="none" stroke="#ffffff" stroke-width="2"/><rect x="86" y="33" width="2" height="4" fill="#ffffff"/>`,

  "film-sprocket": `<rect x="4" y="10" width="92" height="80" rx="4" fill="#221e1a" stroke="#d4b47a" stroke-width="2.5"/><rect x="10" y="16" width="14" height="12" rx="2" fill="#f4ebd9"/><rect x="32" y="16" width="14" height="12" rx="2" fill="#f4ebd9"/><rect x="54" y="16" width="14" height="12" rx="2" fill="#f4ebd9"/><rect x="76" y="16" width="14" height="12" rx="2" fill="#f4ebd9"/><rect x="10" y="72" width="14" height="12" rx="2" fill="#f4ebd9"/><rect x="32" y="72" width="14" height="12" rx="2" fill="#f4ebd9"/><rect x="54" y="72" width="14" height="12" rx="2" fill="#f4ebd9"/><rect x="76" y="72" width="14" height="12" rx="2" fill="#f4ebd9"/><text x="28" y="52" fill="#e8c278" font-family="monospace" font-size="14" font-weight="bold">35mm 400</text>`
};
