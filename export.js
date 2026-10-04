// A single-page PDF containing the same flattened canvas as image exports.
export function canvasPdf(canvas) {
  const jpeg = Uint8Array.from(atob(canvas.toDataURL('image/jpeg', .98).split(',')[1]), c => c.charCodeAt(0));
  const encoder = new TextEncoder(), chunks = [], offsets = [0]; let length = 0;
  const add = value => { const bytes = typeof value === 'string' ? encoder.encode(value) : value; chunks.push(bytes); length += bytes.length; };
  const w = canvas.width * .5, h = canvas.height * .5;
  add('%PDF-1.4\n');
  const object = (id, body) => { offsets[id] = length; add(`${id} 0 obj\n${body}\nendobj\n`); };
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  offsets[4] = length;
  add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  add(jpeg); add('\nendstream\nendobj\n');
  const content = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q\n`;
  object(5, `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`);
  const xref = length;
  add('xref\n0 6\n0000000000 65535 f \n');
  for (let i = 1; i <= 5; i++) add(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(chunks, {type:'application/pdf'});
}
