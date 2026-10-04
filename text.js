export const TEXT_FONTS = [
  ['Noto Sans KR', '기본 고딕'], ['Noto Serif KR', '단정한 명조'],
  ['Gowun Dodum', '고운 돋움'], ['Gaegu', '개구쟁이 손글씨'],
  ['Nanum Pen Script', '나눔 펜 · 손글씨'], ['Nanum Brush Script', '나눔 붓 · 흘림체'],
];
export function textLayer(overrides = {}) {
  return {id:crypto.randomUUID(),caption:'새 텍스트',textColor:'#eeeeee',fontSize:64,fontFamily:'Noto Sans KR',captionX:.5,captionY:.5,captionRotation:0,...overrides};
}
export function migrateTexts(settings) {
  if (Array.isArray(settings.texts)) return structuredClone(settings.texts);
  if (!settings.caption?.trim()) return [];
  return [textLayer({caption:settings.caption,textColor:settings.textColor||'#fffaf0',fontSize:settings.fontSize||42,fontFamily:'Gaegu',outline:true,captionX:settings.captionX??.5,captionY:settings.captionY??({top:.1,center:.5,bottom:.86}[settings.textPosition]??.86),captionRotation:settings.captionRotation??0})];
}
export function validTexts(texts) {
  return Array.isArray(texts) && texts.length <= 100 && texts.every(t => t && typeof t.id==='string' && t.id.length>0 && !['frame','caption'].includes(t.id) &&
    typeof t.caption==='string' && t.caption.length<=120 && /^#[0-9a-f]{6}$/i.test(t.textColor) &&
    (t.outline===undefined||typeof t.outline==='boolean') && TEXT_FONTS.some(([font])=>font===t.fontFamily) && Number.isFinite(t.fontSize) && t.fontSize>=18 && t.fontSize<=216 &&
    ['captionX','captionY','captionRotation'].every(k=>Number.isFinite(t[k]))) && new Set(texts.map(t=>t.id)).size===texts.length;
}
