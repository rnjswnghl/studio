export function stickerLayer(key, overrides = {}) {
  return { id: globalThis.crypto.randomUUID(), key, x: .82, y: .17, size: .19, rotation: 0, opacity: 1, flip: false, ...overrides };
}

export function layerBounds(layer, image, w, h) {
  const scale = Math.min(w, h) * layer.size / Math.max(image.width, image.height);
  return { x: layer.x * w, y: layer.y * h, w: image.width * scale, h: image.height * scale };
}

export function hitLayer(point, layer, image, w, h) {
  const b = layerBounds(layer, image, w, h), angle = -layer.rotation * Math.PI / 180;
  const dx = point.x - b.x, dy = point.y - b.y;
  return Math.abs(dx * Math.cos(angle) - dy * Math.sin(angle)) <= b.w / 2 &&
    Math.abs(dx * Math.sin(angle) + dy * Math.cos(angle)) <= b.h / 2;
}

export function validLayers(layers) {
  return Array.isArray(layers) && layers.every(l => l && typeof l.id === 'string' && typeof l.key === 'string' &&
    ['x','y','size','rotation','opacity'].every(k => Number.isFinite(l[k])) &&
    l.size > 0 && l.size <= 3 && l.opacity >= 0 && l.opacity <= 1) && new Set(layers.map(l=>l.id)).size === layers.length;
}
