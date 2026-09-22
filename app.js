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
  spark: { label: "반짝", path: "M50 8 C48 32 39 43 17 49 C39 54 47 65 50 91 C54 66 62 55 84 49 C61 43 54 31 50 8 M18 15 C17 25 13 29 4 32 C14 35 17 40 18 50 C20 40 24 35 33 32 C24 28 20 24 18 15" },
  heart: { label: "하트", path: "M50 87 C35 74 14 59 14 37 C14 19 36 13 50 31 C64 13 86 19 86 37 C86 59 65 74 50 87" },
  flower: { label: "꽃", path: "M50 48 C27 44 22 22 38 18 C48 16 52 30 50 43 C54 20 76 16 82 32 C86 45 67 51 56 49 C76 50 84 67 72 78 C60 88 51 69 51 55 C50 76 33 86 22 74 C12 62 30 51 45 50 M50 47 C54 47 56 51 53 54 C49 57 45 53 47 49" },
  smile: { label: "웃음", path: "M18 50 C18 28 31 15 52 15 C76 15 88 31 85 54 C83 75 69 86 48 84 C28 82 17 69 18 50 M34 43 L35 45 M66 42 L67 44 M34 61 C45 71 58 70 69 59" },
  planet: { label: "행성", path: "M32 29 C47 16 70 22 77 40 C84 59 71 78 52 81 C34 84 17 72 15 54 C14 44 20 34 32 29 M5 69 C13 82 43 75 68 61 C91 48 101 34 94 27 C88 20 74 23 64 27" },
};

const state = {
  ratio: "1:1", caption: "오늘, 우리, 그리고 빛나는 순간", textColor: "#fffaf0",
  fontSize: 42, textPosition: "bottom", templateId: "camera-silver", sticker: "spark", images: [],
};
let userTemplates = loadUserTemplates();
let selectedUserTemplateId = null;

const $ = (selector) => document.querySelector(selector);
const canvas = $("#preview");
const ctx = canvas.getContext("2d");

function uid() { return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function loadUserTemplates() {
  try { const value = JSON.parse(localStorage.getItem("cutnote-templates") || "[]"); return Array.isArray(value) ? value.filter(isValidTemplate) : []; }
  catch { return []; }
}
function persistTemplates() { localStorage.setItem("cutnote-templates", JSON.stringify(userTemplates)); }
function isValidTemplate(t) { return t && typeof t.id === "string" && typeof t.name === "string" && ["camera","fourcut","film","gingham"].includes(t.frame) && RATIOS[t.ratio] && /^#[0-9a-f]{6}$/i.test(t.color); }

export function validateProject(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "JSON 객체가 필요합니다.";
  const required = ["version","state","templates"];
  const missing = required.filter((k) => !(k in data));
  if (missing.length) return `필수 항목이 없습니다: ${missing.join(", ")}`;
  if (data.version !== 1 || !data.state || !RATIOS[data.state.ratio]) return "지원하지 않는 백업 형식입니다.";
  if (typeof data.state.caption !== "string" || data.state.caption.length > 120) return "문구 형식이 올바르지 않습니다.";
  if (!Array.isArray(data.templates) || !data.templates.every(isValidTemplate)) return "템플릿 데이터가 올바르지 않습니다.";
  return null;
}

function allTemplates() { return [...DEFAULT_TEMPLATES, ...userTemplates]; }
function activeTemplate() { return allTemplates().find((t) => t.id === state.templateId) || DEFAULT_TEMPLATES[0]; }

function setRatio(ratio) {
  state.ratio = ratio;
  const [w,h] = RATIOS[ratio]; canvas.width = w; canvas.height = h;
  $("#canvasSize").textContent = `${w} × ${h} px`;
  document.querySelectorAll("[data-ratio]").forEach((b) => b.classList.toggle("active", b.dataset.ratio === ratio));
  draw(); scheduleSave();
}

function roundedRect(c, x, y, w, h, r) {
  c.beginPath(); c.roundRect(x,y,w,h,r); c.closePath();
}
function coverImage(c, img, x, y, w, h) {
  const ir = img.width / img.height, tr = w / h;
  let sw, sh, sx, sy;
  if (ir > tr) { sh = img.height; sw = sh * tr; sx = (img.width-sw)/2; sy=0; }
  else { sw = img.width; sh = sw/tr; sx=0; sy=(img.height-sh)/2; }
  c.drawImage(img,sx,sy,sw,sh,x,y,w,h);
}
function drawPlaceholder(c,x,y,w,h,index) {
  c.fillStyle = index%2 ? "#b9b2a6" : "#ccc4b7"; c.fillRect(x,y,w,h);
  c.strokeStyle="rgba(56,50,44,.25)"; c.lineWidth=Math.max(2,w*.006); c.beginPath(); c.moveTo(x,y+h); c.lineTo(x+w*.36,y+h*.58); c.lineTo(x+w*.56,y+h*.73); c.lineTo(x+w,y+h*.3); c.stroke();
}
function drawSlot(c,x,y,w,h,index) { const img=state.images[index % Math.max(state.images.length,1)]; if(img) coverImage(c,img,x,y,w,h); else drawPlaceholder(c,x,y,w,h,index); }

function drawFrame(c,w,h,t) {
  if (t.frame === "camera") drawCamera(c,w,h,t);
  if (t.frame === "fourcut") drawFourCut(c,w,h,t);
  if (t.frame === "film") drawFilm(c,w,h,t);
  if (t.frame === "gingham") drawGingham(c,w,h,t);
}
function drawCamera(c,w,h,t) {
  c.fillStyle=t.color; c.fillRect(0,0,w,h); const m=w*.075, top=h*.17, sw=w*.7, sh=h*.62;
  c.fillStyle="#514e49"; roundedRect(c,m,top,sw,sh,w*.015); c.fill(); drawSlot(c,m+w*.018,top+w*.018,sw-w*.036,sh-w*.036,0);
  c.fillStyle="#24221f"; c.beginPath(); c.arc(w*.865,h*.34,w*.055,0,Math.PI*2); c.fill(); c.strokeStyle="#8b877f"; c.lineWidth=w*.015; c.stroke();
  c.fillStyle="#bbb5a9"; c.beginPath(); c.arc(w*.865,h*.58,w*.09,0,Math.PI*2); c.fill(); c.strokeStyle="#625e57"; c.lineWidth=w*.012; c.stroke();
  c.beginPath(); c.arc(w*.865,h*.58,w*.045,0,Math.PI*2); c.stroke();
  c.fillStyle="#33302c"; c.font=`700 ${w*.036}px ui-monospace`; c.fillText("CUT NOTE",m,h*.1);
  c.fillStyle=t.accent; c.fillRect(w*.78,h*.78,w*.16,w*.018);
}
function drawFourCut(c,w,h,t) {
  c.fillStyle=t.color; c.fillRect(0,0,w,h); const gap=h*.018, m=w*.16, top=h*.045, bottom=h*.13; const sh=(h-top-bottom-gap*3)/4;
  for(let i=0;i<4;i++){ c.fillStyle="#2e2a26"; c.fillRect(m,top+i*(sh+gap),w-m*2,sh); drawSlot(c,m+w*.012,top+i*(sh+gap)+w*.012,w-m*2-w*.024,sh-w*.024,i); }
  c.save(); c.translate(w*.5,h*.955); c.rotate(-.02); c.textAlign="center"; c.font=`700 ${w*.055}px Gaegu`; c.fillStyle=t.accent; c.fillText("our little moments",0,0); c.restore();
}
function drawFilm(c,w,h,t) {
  c.fillStyle=t.color; c.fillRect(0,0,w,h); const m=w*.055, gap=w*.025, cellW=(w-m*2-gap)/2, cellH=(h-m*2-gap)/2;
  c.fillStyle=t.accent; for(let x=12;x<w;x+=42){ c.fillRect(x,12,23,14); c.fillRect(x,h-26,23,14); }
  for(let i=0;i<4;i++){const x=m+(i%2)*(cellW+gap), y=m+18+Math.floor(i/2)*(cellH+gap)-9; drawSlot(c,x,y,cellW,cellH-18,i); c.fillStyle="#e9c670"; c.font=`${w*.018}px ui-monospace`; c.fillText(`${47+i}`,x+6,y+cellH-24);}
}
function drawGingham(c,w,h,t) {
  c.fillStyle="#f7ede4"; c.fillRect(0,0,w,h); const s=w*.055; c.globalAlpha=.28; c.fillStyle=t.accent; for(let x=0;x<w;x+=s*2)c.fillRect(x,0,s,h); for(let y=0;y<h;y+=s*2)c.fillRect(0,y,w,s); c.globalAlpha=1;
  const m=w*.095; c.fillStyle="#fffaf3"; c.fillRect(m,m,w-2*m,h-2*m); drawSlot(c,m+w*.022,m+w*.022,w-2*m-w*.044,h-2*m-h*.16,0); c.fillStyle=t.accent; c.font=`700 ${w*.05}px Gaegu`; c.textAlign="center"; c.fillText("remember this day",w/2,h-m-h*.045); c.textAlign="left";
}
function drawSticker(c,w,h,key) {
  if(!key || !STICKERS[key]) return; const p=new Path2D(STICKERS[key].path); const size=Math.min(w,h)*.16; c.save(); c.translate(w-size*1.05,size*.35); c.scale(size/100,size/100); c.strokeStyle=activeTemplate().frame==="film"?"#f4ead8":"#29241e"; c.lineWidth=3.2; c.lineCap="round"; c.lineJoin="round"; c.stroke(p); c.restore();
}
function drawCaption(c,w,h) {
  const text=state.caption.trim(); if(!text)return; const scale=w/1080; const size=Math.round(state.fontSize*scale); c.font=`700 ${size}px Gaegu`; c.textAlign="center"; c.textBaseline="middle";
  let y=h*.86; if(state.textPosition==="top")y=h*.1; if(state.textPosition==="center")y=h*.5;
  c.lineWidth=Math.max(5,size*.13); c.strokeStyle="rgba(28,24,21,.66)"; c.fillStyle=state.textColor;
  const max=w*.76; const words=[...text]; const lines=[]; let line=""; for(const char of words){if(c.measureText(line+char).width>max&&line){lines.push(line);line=char}else line+=char;} if(line)lines.push(line); const lh=size*1.15; const start=y-(lines.length-1)*lh/2; lines.slice(0,3).forEach((line,i)=>{c.strokeText(line,w/2,start+i*lh);c.fillText(line,w/2,start+i*lh);});
}
function draw(target=canvas, targetState=state) {
  const c=target.getContext("2d"), w=target.width,h=target.height; c.clearRect(0,0,w,h);
  const original={...state}; Object.assign(state,targetState); drawFrame(c,w,h,activeTemplate()); drawSticker(c,w,h,state.sticker); drawCaption(c,w,h); Object.assign(state,original);
  $("#emptyCanvas").hidden = state.images.length > 0;
}

let saveTimer;
function scheduleSave(){ clearTimeout(saveTimer); $("#statusText").textContent="저장 중…"; saveTimer=setTimeout(()=>{localStorage.setItem("cutnote-state",JSON.stringify({...state,images:[]})); $("#statusText").textContent="자동 저장됨";},180); }
function restoreState(){try{const saved=JSON.parse(localStorage.getItem("cutnote-state")||"null");if(saved&&RATIOS[saved.ratio])Object.assign(state,saved,{images:[]});}catch{}}

function templateHtml(t){return `<button type="button" class="template-card ${t.id===state.templateId?"active":""}" data-template="${t.id}" style="--preview-color:${t.color}"><span class="template-preview"></span><strong>${escapeHtml(t.name)}</strong><small>${escapeHtml(t.subtitle||"my preset")}</small></button>`;}
function renderTemplates(){ $("#templateGrid").innerHTML=allTemplates().map(templateHtml).join(""); }
function escapeHtml(v){return String(v).replace(/[&<>"']/g,(m)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function stickerSvg(key,s){return `<button type="button" class="sticker ${state.sticker===key?"active":""}" data-sticker="${key}" aria-label="${s.label}"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="${s.path}"/></svg></button>`;}
function renderStickers(){ $("#stickerGrid").innerHTML=Object.entries(STICKERS).map(([k,s])=>stickerSvg(k,s)).join(""); }

async function handleImages(files){
  $("#fileError").textContent=""; const list=[...files].slice(0,4); if(!list.length)return;
  if(list.some((f)=>!["image/png","image/jpeg"].includes(f.type))){$("#fileError").textContent="PNG 또는 JPEG 파일만 사용할 수 있어요.";return;}
  try{const loaded=await Promise.all(list.map(loadImageFile)); state.images=loaded; renderFileList(list); draw(); scheduleSave();}
  catch{$("#fileError").textContent="이미지를 읽지 못했어요. 손상되지 않은 파일인지 확인해주세요.";}
}
function loadImageFile(file){return new Promise((resolve,reject)=>{const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject()};img.src=url;});}
function renderFileList(files){const old=$("#fileList");old.innerHTML="";files.forEach((file,i)=>{const img=document.createElement("img");img.className="file-thumb";img.alt=`선택한 사진 ${i+1}: ${file.name}`;img.src=URL.createObjectURL(file);img.onload=()=>URL.revokeObjectURL(img.src);old.append(img);});}

function bindEvents(){
  $("#imageInput").addEventListener("change",(e)=>handleImages(e.target.files)); const dz=$("#dropZone");
  ["dragenter","dragover"].forEach((n)=>dz.addEventListener(n,(e)=>{e.preventDefault();dz.classList.add("drag")})); ["dragleave","drop"].forEach((n)=>dz.addEventListener(n,(e)=>{e.preventDefault();dz.classList.remove("drag")})); dz.addEventListener("drop",(e)=>handleImages(e.dataTransfer.files));
  $("#caption").addEventListener("input",(e)=>{state.caption=e.target.value;draw();scheduleSave()});
  $("#textColor").addEventListener("input",(e)=>{state.textColor=e.target.value;draw();scheduleSave()});
  $("#fontSize").addEventListener("input",(e)=>{state.fontSize=Number(e.target.value);draw();scheduleSave()});
  $("#textPosition").addEventListener("click",(e)=>{const b=e.target.closest("button");if(!b)return;state.textPosition=b.dataset.value;document.querySelectorAll("#textPosition button").forEach(x=>x.classList.toggle("active",x===b));draw();scheduleSave()});
  $("#ratios").addEventListener("click",(e)=>{const b=e.target.closest("button");if(b)setRatio(b.dataset.ratio)});
  $("#templateGrid").addEventListener("click",(e)=>{const b=e.target.closest("[data-template]");if(!b)return;state.templateId=b.dataset.template;selectedUserTemplateId=b.dataset.template.startsWith("user-")?b.dataset.template:null;const t=activeTemplate();setRatio(t.ratio);renderTemplates();draw();scheduleSave()});
  $("#stickerGrid").addEventListener("click",(e)=>{const b=e.target.closest("[data-sticker]");if(!b)return;state.sticker=b.dataset.sticker;renderStickers();draw();scheduleSave()});
  $("#removeSticker").addEventListener("click",()=>{state.sticker=null;renderStickers();draw();scheduleSave()});
  $("#download").addEventListener("click",downloadPng); $("#exportJson").addEventListener("click",exportProject);
  $("#openImport").addEventListener("click",()=>$("#importDialog").showModal()); $("#jsonInput").addEventListener("change",importProject);
  $("#privacyInfo").addEventListener("click",()=>$("#infoDialog").showModal());
  $("#saveTemplate").addEventListener("click",saveTemplate); $("#updateTemplate").addEventListener("click",updateTemplate); $("#deleteTemplate").addEventListener("click",deleteTemplate);
  $("#resetApp").addEventListener("click",()=>{if(confirm("저장한 설정과 사용자 템플릿을 모두 지울까요?")){localStorage.removeItem("cutnote-state");localStorage.removeItem("cutnote-templates");location.reload();}});
}
function downloadPng(){const a=document.createElement("a");a.download=`cutnote-${state.ratio.replace(":","x")}-${Date.now()}.png`;a.href=canvas.toDataURL("image/png");a.click();}
function exportProject(){const payload={version:1,exportedAt:new Date().toISOString(),state:{...state,images:[]},templates:userTemplates};const a=document.createElement("a");a.download="cutnote-project.json";a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
async function importProject(e){const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());const error=validateProject(data);if(error)throw new Error(error);const nextTemplates=data.templates; const nextState={...state,...data.state,images:[]}; userTemplates=nextTemplates;Object.assign(state,nextState);persistTemplates();renderTemplates();renderStickers();syncControls();setRatio(state.ratio);$("#importDialog").close();$("#jsonError").textContent="";}catch(err){$("#jsonError").textContent=err instanceof SyntaxError?"JSON 문법이 손상되었습니다. 기존 작업은 유지됩니다.":err.message;}finally{e.target.value="";}}
function templateFromState(id,name){const t=activeTemplate();return{id,name,subtitle:"my preset",frame:t.frame,ratio:state.ratio,color:t.color,accent:t.accent||"#c95745",caption:state.caption,textColor:state.textColor,fontSize:state.fontSize,textPosition:state.textPosition,sticker:state.sticker};}
function saveTemplate(){const name=$("#templateName").value.trim();if(!name){$("#templateMessage").textContent="이름을 먼저 적어주세요.";return;}const t=templateFromState(uid(),name);userTemplates.push(t);persistTemplates();state.templateId=t.id;selectedUserTemplateId=t.id;renderTemplates();$("#templateMessage").textContent=`‘${name}’ 템플릿을 저장했어요.`;}
function updateTemplate(){if(!selectedUserTemplateId){$("#templateMessage").textContent="수정할 내 템플릿을 먼저 선택해주세요.";return;}const old=userTemplates.find(t=>t.id===selectedUserTemplateId);const name=$("#templateName").value.trim()||old.name;userTemplates=userTemplates.map(t=>t.id===selectedUserTemplateId?templateFromState(t.id,name):t);persistTemplates();renderTemplates();$("#templateMessage").textContent=`‘${name}’ 템플릿을 업데이트했어요.`;}
function deleteTemplate(){if(!selectedUserTemplateId){$("#templateMessage").textContent="삭제할 내 템플릿을 먼저 선택해주세요.";return;}const target=userTemplates.find(t=>t.id===selectedUserTemplateId);userTemplates=userTemplates.filter(t=>t.id!==selectedUserTemplateId);persistTemplates();state.templateId=DEFAULT_TEMPLATES[0].id;selectedUserTemplateId=null;renderTemplates();draw();$("#templateMessage").textContent=`‘${target.name}’ 템플릿을 삭제했어요.`;}
function applyTemplateSettings(t){state.templateId=t.id;state.ratio=t.ratio;if("caption"in t)state.caption=t.caption;if("sticker"in t)state.sticker=t.sticker;if("textColor"in t)state.textColor=t.textColor;if("fontSize"in t)state.fontSize=t.fontSize;if("textPosition"in t)state.textPosition=t.textPosition;syncControls();setRatio(state.ratio);renderTemplates();renderStickers();draw();scheduleSave();}
function syncControls(){$("#caption").value=state.caption;$("#textColor").value=state.textColor;$("#fontSize").value=state.fontSize;document.querySelectorAll("#textPosition button").forEach(b=>b.classList.toggle("active",b.dataset.value===state.textPosition));}

const samples=[
  {name:"늦여름의 우리",meta:"4:5 · 은빛 디카",ratio:"4:5",templateId:"camera-silver",caption:"늦여름의 우리",sticker:"spark",textColor:"#fffaf0",fontSize:50,textPosition:"bottom"},
  {name:"네 컷의 오후",meta:"9:16 · 크림 네컷",ratio:"9:16",templateId:"life-four",caption:"우리의 작은 오후",sticker:"heart",textColor:"#642f2b",fontSize:44,textPosition:"bottom"},
  {name:"필름 속 주말",meta:"1:1 · 필름",ratio:"1:1",templateId:"film-noir",caption:"SUN. 4:32 PM",sticker:"planet",textColor:"#f1dec2",fontSize:38,textPosition:"center"},
];
function renderSamples(){const grid=$("#sampleGrid");samples.forEach((sample,i)=>{const button=document.createElement("button");button.type="button";button.className="sample-card";button.innerHTML=`<canvas width="540" height="${Math.round(540*RATIOS[sample.ratio][1]/1080)}"></canvas><strong>${sample.name}</strong><span>${sample.meta}</span>`;const sc=button.querySelector("canvas");const colors=["#8f8a7f","#c9b2a1","#8a776d"];const off=document.createElement("canvas");off.width=720;off.height=720;const oc=off.getContext("2d");const g=oc.createLinearGradient(0,0,720,720);g.addColorStop(0,colors[i]);g.addColorStop(1,"#403d39");oc.fillStyle=g;oc.fillRect(0,0,720,720);oc.fillStyle="rgba(255,255,255,.16)";for(let n=0;n<10;n++){oc.beginPath();oc.arc(80+n*68,220+(n%3)*70,60,0,Math.PI*2);oc.fill();}const im=new Image();im.onload=()=>{const originalImages=state.images;state.images=[im];draw(sc,sample);state.images=originalImages;};im.src=off.toDataURL();button.addEventListener("click",()=>{applyTemplateSettings(sample);window.scrollTo({top:$("#editor").offsetTop-80,behavior:"smooth"});});grid.append(button);});}

restoreState(); bindEvents(); renderTemplates(); renderStickers(); syncControls(); setRatio(state.ratio); renderSamples();
