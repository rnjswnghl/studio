// Crops refer to the supplied originals. All extraction stays on this device.
export const stickerAssets = {};
export const frameAssets = {};
const canvas = (w,h) => Object.assign(document.createElement('canvas'),{width:w,height:h});
const load = src => new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(`이미지를 불러오지 못했습니다: ${src}`));img.src=src;});
function cut(img,box,background=null) {
  const [x,y,w,h]=box, out=canvas(w,h), c=out.getContext('2d');
  c.drawImage(img,x,y,w,h,0,0,w,h);
  if(background!==null){
    const data=c.getImageData(0,0,w,h), p=data.data;
    // Remove only background connected to the crop boundary; retain white
    // highlights, eyes and pearls inside the original silhouette.
    const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
    const visit=n=>{if(n<0||n>=w*h||seen[n])return;seen[n]=1;const i=n*4,lo=Math.min(p[i],p[i+1],p[i+2]),hi=Math.max(p[i],p[i+1],p[i+2]);if(hi-lo<14&&Math.abs((hi+lo)/2-background)<16){queue[tail++]=n;p[i+3]=0;}};
    for(let x=0;x<w;x++){visit(x);visit((h-1)*w+x);}for(let y=0;y<h;y++){visit(y*w);visit(y*w+w-1);}
    while(head<tail){const n=queue[head++],x=n%w;if(x>0)visit(n-1);if(x<w-1)visit(n+1);visit(n-w);visit(n+w);}
    c.putImageData(data,0,0);
  }
  return out;
}
function trim(source){const c=source.getContext('2d'),{width:w,height:h}=source,p=c.getImageData(0,0,w,h).data;let x0=w,y0=h,x1=0,y1=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(p[(y*w+x)*4+3]>24){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}return x0>x1?source:cut(source,[x0,y0,x1-x0+1,y1-y0+1]);}
function add(key,label,img,box,bg){const image=trim(cut(img,box,bg));stickerAssets[key]={label,image,url:image.toDataURL()};}
export async function prepareAssets(){
  const ids=Array.from({length:16},(_,i)=>i+1);
  const pairs=await Promise.all(ids.map(async id=>[id,await load(`assets/references/ref-${id}.png`)]));const refs=Object.fromEntries(pairs);
  const labels=['별','하트','초승달','반짝','십자가','꽃','무한','리본','왕관','물결 하트','나비','스플래시','링','장미','좋아요'];
  const keys=['star','heart','planet','spark','cross','flower','infinity','ribbon','crown','wave-heart','butterfly','splash','ring','rose','thumb'];
  keys.forEach((key,i)=>add(key,`크롬 ${labels[i]}`,refs[4],[(i%3)*187,Math.floor(i/3)*200,187,200],247));
  const pearls=[[35,60,330,310],[380,65,345,325],[755,65,365,350],[150,365,225,340],[425,395,310,260],[785,435,340,410],[20,700,310,275],[375,655,475,650],[840,875,260,275],[20,995,350,245],[820,1170,285,300],[80,1240,510,475],[585,1350,225,195],[705,1530,440,325],[60,1730,345,300],[425,1705,320,325]];
  pearls.forEach((box,i)=>add(`pearl-${i}`,['진주 나비','오팔 소라','자개 고둥','빛나는 소라','구름','조개 한 쌍','불가사리','해파리','핑크 하트','진주 조개','보라 조개','산호','오팔','자개 조개','흰 소라','핑크 별'][i],refs[5],box,255));
  for(let row=0;row<8;row++)for(let col=0;col<4;col++)add(row===0&&col===0?'smile':`emoji-${row}-${col}`,`표정 ${row*4+col+1}`,refs[9],[48+col*128,15+row*136,120,127],255);
  for(let row=0;row<7;row++)for(let col=0;col<4;col++)add(`mood-${row}-${col}`,`무드 ${row*4+col+1}`,refs[10],[col*288,row*292,288,292],229);
  // Keep the supplied glass and bubble artwork intact, including embedded marks.
  for(const [id,key,label] of [[1,'glass-heart','유리 하트 · 원본 배경 포함'],[6,'glass-spark','유리 반짝 · 원본 배경 포함'],[7,'glass-moon','유리 달 · 원본 배경 포함'],[2,'bubble-sheet','버블 시트 · 원본 배경/워터마크 포함']])add(key,label,refs[id],[0,0,refs[id].width,refs[id].height],null);
  for(let row=0;row<5;row++)for(let col=0;col<3;col++)add('metal-heart-'+row+'-'+col,'메탈·유리 하트 '+(row*3+col+1),refs[3],[col*187,row*199,187,199],247);
  const extraEmoji=[[9,40,122,135],[139,40,115,133],[257,42,110,129],[372,43,104,115],[473,43,99,136],[565,58,83,106],[649,83,81,90],[0,173,140,124],[139,175,134,126],[275,168,116,137],[391,172,128,131],[522,170,95,132],[620,186,114,125],[9,308,131,125],[141,304,146,127],[289,299,135,134],[428,306,113,128],[568,307,135,119],[13,437,119,132],[140,436,128,139],[278,440,105,116],[385,436,130,131],[519,446,107,115],[627,456,98,109],[16,567,116,128],[139,570,110,119],[255,556,117,131],[378,560,118,129],[504,570,112,126],[618,570,114,132]];
  extraEmoji.forEach((box,i)=>add('extra-emoji-'+i,'추가 표정 '+(i+1),refs[8],box,243));
  const specs={
    camera:{ref:14,box:[23,580,1105,724],holes:[[74,226,539,397]],key:255},
    fourcut:{ref:11,box:[75,3,413,991],holes:[[63,30,285,212],[63,272,285,211],[63,513,285,211],[63,754,285,210]]},
    film:{ref:12,box:[32,170,936,326],holes:[[23,59,282,209],[327,59,282,209],[631,59,282,209]]},
    gingham:{ref:15,box:[49,83,474,575],holes:[[35,35,402,403]]},
    rec:{ref:13,box:[79,296,1043,610],holes:[[0,0,1043,610]],overlay:true},
    finder:{ref:16,box:[12,67,337,227],holes:[[0,0,337,227]],overlay:true}
  };
  for(const [key,s] of Object.entries(specs)){
    const image=cut(refs[s.ref],s.box,s.key??null),c=image.getContext('2d');
    if(s.overlay){const d=c.getImageData(0,0,image.width,image.height);for(let i=0;i<d.data.length;i+=4){const r=d.data[i],g=d.data[i+1],b=d.data[i+2];if(Math.min(r,g,b)>160)d.data[i+3]=0;}c.putImageData(d,0,0);}
    else {for(const [x,y,w,h] of s.holes)c.clearRect(x,y,w,h);}
    frameAssets[key]={image,holes:s.holes,overlay:s.overlay,url:image.toDataURL()};
  }
}
export function framePlacement(w,h,key){const a=frameAssets[key];if(!a)return null;const scale=Math.min(w*.9/a.image.width,h*.79/a.image.height);return {x:(w-a.image.width*scale)/2,y:(h-a.image.height*scale)/2-h*.035,scale,a};}
