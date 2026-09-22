import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const name = Buffer.from(type); const out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length, 0); name.copy(out, 4); data.copy(out, 8); out.writeUInt32BE(crc32(Buffer.concat([name, data])), data.length + 8); return out;
};
const makePng = (width, height, palette, mode) => {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  const [bg, ink, accent] = palette;
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1); raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const border = mode === 0 ? x < width*.1 || x > width*.9 || y < height*.08 || y > height*.92 : mode === 1 ? (x < width*.16 || x > width*.84 || y % Math.floor(height/4) < 8) : (y < 24 || y > height-25 || x % 70 < 8);
      const circle = (x-width*.78)**2 + (y-height*.23)**2 < (width*.08)**2;
      const color = circle ? accent : border ? ink : bg;
      const p = row + 1 + x*4; raw[p]=color[0]; raw[p+1]=color[1]; raw[p+2]=color[2]; raw[p+3]=255;
    }
  }
  const glyphs = {
    A:"011101000110001111111000110001", C:"011111000010000100001000001111", D:"111101000110001100011000111110",
    E:"111111000010000111101000011111", F:"111111000010000111101000010000", I:"111110010000100001000010011111",
    L:"100001000010000100001000011111", M:"100011101110101101011000110001", N:"100011100110101100111000110001",
    O:"011101000110001100011000101110", R:"111101000110001111101010010001", S:"011111000010000011100000111110",
    T:"111110010000100001000010000100", U:"100011000110001100011000101110", W:"100011000110101101011010101010",
    Y:"100011000101010001000010000100", " ":"000000000000000000000000000000"
  };
  const setPixel=(x,y,color)=>{if(x<0||y<0||x>=width||y>=height)return;const p=y*(width*4+1)+1+x*4;raw[p]=color[0];raw[p+1]=color[1];raw[p+2]=color[2];raw[p+3]=255;};
  const fillRect=(x,y,w,h,color)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)setPixel(xx,yy,color);};
  const drawText=(text,y,scale,color)=>{const total=text.length*6*scale-scale;let x=Math.floor((width-total)/2);for(const ch of text){const bits=glyphs[ch]||glyphs[" "];for(let n=0;n<30;n++)if(bits[n]==="1")fillRect(x+(n%5)*scale,y+Math.floor(n/5)*scale,scale,scale,color);x+=6*scale;}};
  const labels=["LATE SUMMER","FOUR MOMENTS","SUNDAY FILM"];
  drawText(labels[mode], mode===1?Math.floor(height*.93):Math.floor(height*.86), Math.max(2,Math.floor(width/135)), mode===2?accent:ink);
  const header=Buffer.alloc(13);header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",header),chunk("IDAT",deflateSync(raw)),chunk("IEND",Buffer.alloc(0))]);
};

const dir=join(process.cwd(),"samples");mkdirSync(dir,{recursive:true});
const samples=[
  ["late-summer-4x5.png",432,540,[[151,143,130],[217,211,198],[187,82,67]]],
  ["four-cuts-9x16.png",270,480,[[201,178,161],[246,235,216],[166,74,64]]],
  ["film-weekend-1x1.png",480,480,[[115,102,92],[37,33,29],[224,171,78]]],
];
samples.forEach(([name,w,h,palette],i)=>writeFileSync(join(dir,name),makePng(w,h,palette,i)));
console.log(`Generated ${samples.length} sample PNG files.`);
