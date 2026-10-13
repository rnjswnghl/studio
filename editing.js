export function stickerLayer(key, overrides = {}) {
  return { id: globalThis.crypto.randomUUID(), key, x: .82, y: .17, size: .19, rotation: 0, opacity: 1, flip: false, locked: false, ...overrides };
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
    (l.locked === undefined || typeof l.locked === 'boolean') && validNumber(l.number) &&
    ['x','y','size','rotation','opacity'].every(k => Number.isFinite(l[k])) &&
    l.size > 0 && l.size <= 3 && l.opacity >= 0 && l.opacity <= 1) && new Set(layers.map(l=>l.id)).size === layers.length;
}

// Reserve existing numbers before migrating legacy items so list order cannot rename them.
export function validNumber(value) { return value === undefined || (Number.isSafeInteger(value) && value > 0); }
export function nextNumber(items, name, nameOf) {
  return Math.max(0, ...items.filter(item => nameOf(item) === name).map(item => item.number || 0)) + 1;
}
export function ensureNumbers(items, nameOf) {
  const used = new Map(), pending = [];
  for (const item of items) {
    const name = nameOf(item);
    if (!used.has(name)) used.set(name, new Set());
    const numbers = used.get(name);
    if (item.number && !numbers.has(item.number)) numbers.add(item.number);
    else pending.push(item);
  }
  for (const item of pending) {
    const numbers = used.get(nameOf(item));
    item.number = Math.max(0, ...numbers) + 1;
    numbers.add(item.number);
  }
}
