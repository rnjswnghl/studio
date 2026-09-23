import { stickerLayer, layerBounds, hitLayer, validLayers } from "./editing.js";
import { stickerAssets, frameAssets, prepareAssets, framePlacement } from "./assets.js";
export const RATIOS = {
  "1:1": [1080, 1080],
  "4:5": [1080, 1350],
  "9:16": [1080, 1920],
};

export const DEFAULT_TEMPLATES = [
  { id: "rec-original", name: "REC 카메라", subtitle: "recording frame", frame: "rec", ratio: "4:5", color: "#f3f0eb", accent: "#a9473e" },
  { id: "finder-original", name: "뷰파인더", subtitle: "view finder", frame: "finder", ratio: "1:1", color: "#f3f0eb", accent: "#a9473e" },
  { id: "camera-silver", name: "은빛 디카", subtitle: "digital camera", frame: "camera", ratio: "4:5", color: "#d8d3c7", accent: "#b34f45" },
  { id: "life-four", name: "빈티지 필름 네컷", subtitle: "four cut booth", frame: "fourcut", ratio: "9:16", color: "#f4ead8", accent: "#d16758" },
  { id: "film-noir", name: "필름 다이어리", subtitle: "35mm contact", frame: "film", ratio: "1:1", color: "#26221e", accent: "#dfaa4b" },
  { id: "gingham", name: "폴라로이드", subtitle: "original polaroid", frame: "gingham", ratio: "4:5", color: "#ead0c8", accent: "#a9473e" },
];

export const STICKERS = stickerAssets;

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
function isValidTemplate(t) { return t && typeof t.id === "string" && typeof t.name === "string" && ["camera","fourcut","film","gingham","rec","finder"].includes(t.frame) && RATIOS[t.ratio] && /^#[0-9a-f]{6}$/i.test(t.color); }

export function validateProject(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "JSON 객체가 필요합니다.";
  const required = ["version","state","templates"];
  const missing = required.filter((k) => !(k in data));
  if (missing.length) return `필수 항목이 없습니다: ${missing.join(", ")}`;
  if (![1,2].includes(data.version) || !data.state || !RATIOS[data.state.ratio]) return "지원하지 않는 백업 형식입니다.";
  if (typeof data.state.caption !== "string" || data.state.caption.length > 120) return "문구 형식이 올바르지 않습니다.";
  if (!Array.isArray(data.templates) || !data.templates.every(isValidTemplate)) return "템플릿 데이터가 올바르지 않습니다.";
  if (data.version === 2) {
    if (!Array.isArray(data.state.images) || data.state.images.length > 4) return "사진 데이터가 올바르지 않습니다.";
    const valid = data.state.images.every((record) => record === null || (
      record && ["image/png","image/jpeg"].includes(dataUrlType(record.dataUrl)) &&
      typeof record.name === "string" && record.position &&
      Number.isFinite(Number(record.position.x)) && Number.isFinite(Number(record.position.y))
    ));
    if (!valid) return "사진 데이터가 올바르지 않습니다.";
  }
  if (data.state.layers !== undefined && (!validLayers(data.state.layers) || data.state.layers.some(l=>!STICKERS[l.key]&&!dataUrlType(l.dataUrl)))) return "스티커 레이어가 올바르지 않습니다.";
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
function coverImage(c, img, x, y, w, h, position={x:.5,y:.5}, zoom=1, rotate=0) {
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.translate(x+w/2,y+h/2);c.rotate(rotate*Math.PI/180);c.scale(zoom,zoom);x=-w/2;y=-h/2;
  const ir = img.width / img.height, tr = w / h;
  let sw, sh, sx, sy;
  const px=clamp(Number(position.x),0,1), py=clamp(Number(position.y),0,1);
  if (ir > tr) { sh = img.height; sw = sh * tr; sx = (img.width-sw)*px; sy=0; }
  else { sw = img.width; sh = sw/tr; sx=0; sy=(img.height-sh)*py; }
  c.drawImage(img,sx,sy,sw,sh,x,y,w,h);c.restore();
}
function drawPlaceholder(c,x,y,w,h,index) {
  c.fillStyle = index%2 ? "#b9b2a6" : "#ccc4b7"; c.fillRect(x,y,w,h);
  c.strokeStyle="rgba(56,50,44,.25)"; c.lineWidth=Math.max(2,w*.006); c.beginPath(); c.moveTo(x,y+h); c.lineTo(x+w*.36,y+h*.58); c.lineTo(x+w*.56,y+h*.73); c.lineTo(x+w,y+h*.3); c.stroke();
}
function imageForSlot(index){return state.images[index]===null?null:(state.images[index] || state.images.find(Boolean) || null); }
function drawSlot(c,x,y,w,h,index) { const record=imageForSlot(index); if(record?.img) coverImage(c,record.img,x,y,w,h,record.position,record.zoom??1,record.rotate??0); else drawPlaceholder(c,x,y,w,h,index); }

function slotRects(w,h,t=activeTemplate()){
 const p=placedFrame(w,h,t.frame);if(!p)return [];
 return p.a.holes.map(([x,y,rw,rh])=>({x:p.x+x*p.scale,y:p.y+y*p.scale,w:rw*p.scale,h:rh*p.scale}));
}
function drawFrame(c,w,h,t){
 c.fillStyle=state.backgroundColor||"#f3f0eb";c.fillRect(0,0,w,h);const p=placedFrame(w,h,t.frame);if(!p)return;
 c.save();c.translate(w/2,h/2);c.rotate((state.frameRotation??0)*Math.PI/180);c.translate(-w/2,-h/2);slotRects(w,h,t).forEach((r,i)=>drawSlot(c,r.x,r.y,r.w,r.h,i));
 c.save();c.imageSmoothingQuality="high";c.drawImage(p.a.image,p.x,p.y,p.a.image.width*p.scale,p.a.image.height*p.scale);c.restore();c.restore();
}
function placedFrame(w,h,key){const p=framePlacement(w,h,key);if(!p)return null;const factor=state.frameSize??1;p.scale*=factor;p.x=w*(state.frameX??.5)-p.a.image.width*p.scale/2;p.y=h*(state.frameY??.465)-p.a.image.height*p.scale/2;return p;}
function drawSticker(c,w,h,key){
 for(const layer of state.layers||[]){const asset=STICKERS[layer.key];if(!asset)continue;const r=layerBounds(layer,asset.image,w,h);c.save();c.globalAlpha=layer.opacity;c.translate(r.x,r.y);c.rotate(layer.rotation*Math.PI/180);c.scale(layer.flip?-1:1,1);c.drawImage(asset.image,-r.w/2,-r.h/2,r.w,r.h);c.restore();}
}

function drawCaption(c,w,h) {
  const text=state.caption.trim(); if(!text)return; const scale=w/1080; const size=Math.round(state.fontSize*scale); c.font=`700 ${size}px Gaegu`; c.textAlign="center"; c.textBaseline="middle";
  let y=h*.86; if(state.textPosition==="top")y=h*.1; if(state.textPosition==="center")y=h*.5;
  y=h*(state.captionY??(y/h)); c.save();c.translate(w*(state.captionX??.5),y);c.rotate((state.captionRotation??0)*Math.PI/180);
  c.lineWidth=Math.max(5,size*.13); c.strokeStyle="rgba(28,24,21,.66)"; c.fillStyle=state.textColor;
  const max=w*.76; const words=[...text]; const lines=[]; let line=""; for(const char of words){if(c.measureText(line+char).width>max&&line){lines.push(line);line=char}else line+=char;} if(line)lines.push(line); const lh=size*1.15; const start=-(lines.length-1)*lh/2; lines.slice(0,3).forEach((line,i)=>{c.strokeText(line,0,start+i*lh);c.fillText(line,0,start+i*lh);}); c.restore();
}
function draw(target=canvas, targetState=state) {
  const c=target.getContext("2d"), w=target.width,h=target.height; c.clearRect(0,0,w,h);
  const original={...state}; Object.assign(state,targetState); drawFrame(c,w,h,activeTemplate()); drawSticker(c,w,h,state.sticker); drawCaption(c,w,h);if(target===canvas)drawSelection(c,w,h); Object.assign(state,original);
  $("#emptyCanvas").hidden = state.images.some(Boolean);
}

let saveTimer;
function scheduleSave(){ clearTimeout(saveTimer); $("#statusText").textContent="저장 중…"; saveTimer=setTimeout(()=>{try{localStorage.setItem("cutnote-state",JSON.stringify({...state,images:state.images.map(serialiseImage)}));$("#statusText").textContent="자동 저장됨";}catch{$("#statusText").textContent="저장 공간 부족 · 작업 백업으로 보관하세요";}},180); }
async function restoreState(){try{const saved=JSON.parse(localStorage.getItem("cutnote-state")||"null");if(saved&&RATIOS[saved.ratio]){const images=await Promise.all((saved.images||[]).map(r=>r?restoreImageRecord(r):null));Object.assign(state,saved,{images});}}catch{}}

function templateHtml(t){return `<button type="button" class="template-card ${t.id===state.templateId?"active":""}" data-template="${t.id}" style="--preview-color:${t.color}"><span class="template-preview"><img src="${frameAssets[t.frame]?.url||''}" alt="" /></span><strong>${escapeHtml(t.name)}</strong><small>${escapeHtml(t.subtitle||"my preset")}</small></button>`;}
function renderTemplates(){ $("#templateGrid").innerHTML=allTemplates().map(templateHtml).join(""); }
function escapeHtml(v){return String(v).replace(/[&<>"']/g,(m)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function stickerSvg(key,s){return `<button type="button" class="sticker ${state.sticker===key?"active":""}" data-sticker="${key}" aria-label="${s.label}" title="${s.label}"><img src="${s.url}" alt="" loading="lazy" /></button>`;}
function renderStickers(){ $("#stickerGrid").innerHTML=Object.entries(STICKERS).map(([k,s])=>stickerSvg(k,s)).join(""); }

async function handleImages(files){
  $("#fileError").textContent=""; const list=[...files].slice(0,4); if(!list.length)return;
  if(list.some((f)=>!["image/png","image/jpeg"].includes(f.type))){$("#fileError").textContent="PNG 또는 JPEG 파일만 사용할 수 있어요.";return;}
  try{state.images=await Promise.all(list.map(loadImageFile));renderFileList();draw();scheduleSave();}
  catch{$("#fileError").textContent="이미지를 읽지 못했어요. 손상되지 않은 파일인지 확인해주세요.";}
}
function fileToDataUrl(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});}
function imageFromDataUrl(dataUrl){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error("이미지 데이터를 읽지 못했습니다."));img.src=dataUrl;});}
async function loadImageFile(file){const dataUrl=await fileToDataUrl(file);const img=await imageFromDataUrl(dataUrl);return{img,dataUrl,name:file.name,type:file.type,position:{x:.5,y:.5}};}
async function restoreImageRecord(record){const img=await imageFromDataUrl(record.dataUrl);return{img,dataUrl:record.dataUrl,name:record.name||"복원한 사진",type:record.type||dataUrlType(record.dataUrl),position:normalisePosition(record.position),zoom:clamp(Number(record.zoom??1),.5,4),rotate:clamp(Number(record.rotate??0),-180,180)};}
function dataUrlType(value){return /^data:(image\/(?:png|jpeg));base64,/i.exec(value)?.[1]?.toLowerCase()||"";}
function normalisePosition(value){return{x:clamp(Number(value?.x),0,1),y:clamp(Number(value?.y),0,1)};}
function clamp(value,min,max){return Number.isFinite(value)?Math.min(max,Math.max(min,value)):(min+max)/2;}
function renderFileList(){syncPhotoControls();const old=$("#fileList");old.innerHTML="";state.images.forEach((record,i)=>{if(!record)return;const img=document.createElement("img");img.className="file-thumb";img.alt=`선택한 사진 ${i+1}: ${record.name}`;img.src=record.dataUrl;old.append(img);});}

let pendingSlot=0,dragState=null;
function canvasPoint(event){const rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height};}
function slotAt(event){const raw=canvasPoint(event),a=-(state.frameRotation??0)*Math.PI/180,dx=raw.x-canvas.width/2,dy=raw.y-canvas.height/2,p={x:dx*Math.cos(a)-dy*Math.sin(a)+canvas.width/2,y:dx*Math.sin(a)+dy*Math.cos(a)+canvas.height/2};return slotRects(canvas.width,canvas.height).findIndex(r=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h);}
async function loadIntoSlot(file,index){if(!file)return;try{if(!["image/png","image/jpeg"].includes(file.type))throw new Error("PNG 또는 JPEG 파일만 사용할 수 있어요.");state.images[index]=await loadImageFile(file);renderFileList();draw();scheduleSave();$("#fileError").textContent="";}catch(err){$("#fileError").textContent=err.message||"이미지를 읽지 못했어요.";}}
function bindCanvasEditing(){
  canvas.addEventListener("dblclick",event=>{const index=slotAt(event);if(index<0)return;pendingSlot=index;$("#slotImageInput").click();});
  $("#slotImageInput").addEventListener("change",event=>{loadIntoSlot(event.target.files[0],pendingSlot);event.target.value="";});
  canvas.addEventListener("pointerdown",event=>{if(freePointerDown(event))return;const index=slotAt(event),record=imageForSlot(index);if(index<0||!record)return;if(!state.images[index])state.images[index]={...record,position:{...record.position}};checkpoint();$("#photoSlot").value=index;syncPhotoControls();const activeRecord=state.images[index];const p=canvasPoint(event);dragState={index,record:activeRecord,start:p,origin:{...activeRecord.position}};canvas.setPointerCapture(event.pointerId);canvas.classList.add("dragging");});
  canvas.addEventListener("pointermove",event=>{if(freePointerMove(event))return;if(!dragState)return;const p=canvasPoint(event),rect=slotRects(canvas.width,canvas.height)[dragState.index];const a=-(state.frameRotation??0)*Math.PI/180,dx=p.x-dragState.start.x,dy=p.y-dragState.start.y;dragState.record.position={x:clamp(dragState.origin.x-(dx*Math.cos(a)-dy*Math.sin(a))/rect.w,0,1),y:clamp(dragState.origin.y-(dx*Math.sin(a)+dy*Math.cos(a))/rect.h,0,1)};draw();});
  const finish=()=>{finishFreeDrag();if(!dragState)return;dragState=null;canvas.classList.remove("dragging");scheduleSave();};
  canvas.addEventListener("pointerup",finish);canvas.addEventListener("pointercancel",finish);
}

function bindEvents(){

  $("#imageInput").addEventListener("change",(e)=>handleImages(e.target.files)); const dz=$("#dropZone");
  ["dragenter","dragover"].forEach((n)=>dz.addEventListener(n,(e)=>{e.preventDefault();dz.classList.add("drag")})); ["dragleave","drop"].forEach((n)=>dz.addEventListener(n,(e)=>{e.preventDefault();dz.classList.remove("drag")})); dz.addEventListener("drop",(e)=>handleImages(e.dataTransfer.files));
  $("#caption").addEventListener("input",(e)=>{state.caption=e.target.value;draw();scheduleSave()});
  $("#textColor").addEventListener("input",(e)=>{state.textColor=e.target.value;draw();scheduleSave()});
  $("#fontSize").addEventListener("input",(e)=>{state.fontSize=Number(e.target.value);draw();scheduleSave()});
  $("#textPosition").addEventListener("click",(e)=>{const b=e.target.closest("button");if(!b)return;state.textPosition=b.dataset.value;state.captionX=.5;state.captionY=({top:.1,center:.5,bottom:.86})[b.dataset.value];document.querySelectorAll("#textPosition button").forEach(x=>x.classList.toggle("active",x===b));draw();scheduleSave()});
  $("#ratios").addEventListener("click",(e)=>{const b=e.target.closest("button");if(b)setRatio(b.dataset.ratio)});
  $("#templateGrid").addEventListener("click",(e)=>{const b=e.target.closest("[data-template]");if(!b)return;state.templateId=b.dataset.template;selectedUserTemplateId=b.dataset.template.startsWith("user-")?b.dataset.template:null;const t=activeTemplate();applyTemplateSettings(t)});
  $("#stickerGrid").addEventListener("click",(e)=>{const b=e.target.closest("[data-sticker]");if(!b)return;checkpoint();const layer=stickerLayer(b.dataset.sticker,{x:.35+Math.random()*.3,y:.25+Math.random()*.3});state.layers.push(layer);selectedLayer=layer.id;state.sticker=layer.key;refreshEdit()});
  $("#removeSticker").addEventListener("click",()=>{deleteSelected()});
  $("#download").addEventListener("click",downloadPng); $("#exportJson").addEventListener("click",exportProject);
  $("#openImport").addEventListener("click",()=>$("#importDialog").showModal()); $("#jsonInput").addEventListener("change",importProject);
  $("#privacyInfo").addEventListener("click",()=>$("#infoDialog").showModal());
  $("#saveTemplate").addEventListener("click",saveTemplate); $("#updateTemplate").addEventListener("click",updateTemplate); $("#deleteTemplate").addEventListener("click",deleteTemplate);
  $("#resetApp").addEventListener("click",()=>{if(confirm("저장한 설정과 사용자 템플릿을 모두 지울까요?")){localStorage.removeItem("cutnote-state");localStorage.removeItem("cutnote-templates");location.reload();}});
  bindCanvasEditing();
}
function downloadPng(){const output=document.createElement("canvas");output.width=canvas.width;output.height=canvas.height;draw(output);const a=document.createElement("a");a.download=`cutnote-${state.ratio.replace(":","x")}-${Date.now()}.png`;a.href=output.toDataURL("image/png");a.click();}
function serialiseImage(record){return record?{name:record.name,type:record.type,dataUrl:record.dataUrl,position:normalisePosition(record.position),zoom:record.zoom??1,rotate:record.rotate??0}:null;}
function exportProject(){const payload={version:2,exportedAt:new Date().toISOString(),state:{...state,images:state.images.map(serialiseImage)},templates:userTemplates};const a=document.createElement("a");a.download="cutnote-project.json";a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
async function importProject(e){const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());const error=validateProject(data);if(error)throw new Error(error);await restoreLayerAssets(data.state.layers);const restoredImages=await Promise.all((data.state.images||[]).map(record=>record?restoreImageRecord(record):null));const nextTemplates=data.templates;const nextState={...state,...data.state,layers:data.state.layers,images:restoredImages};userTemplates=nextTemplates;Object.assign(state,nextState);migrateLayers();persistTemplates();renderTemplates();renderStickers();renderFileList();syncControls();setRatio(state.ratio);$("#importDialog").close();$("#jsonError").textContent="";scheduleSave();}catch(err){$("#jsonError").textContent=err instanceof SyntaxError?"JSON 문법이 손상되었습니다. 기존 작업은 유지됩니다.":`${err.message} 기존 작업은 유지됩니다.`;}finally{e.target.value="";}}
function templateFromState(id,name){const t=activeTemplate();return{id,name,subtitle:"my preset",frame:t.frame,ratio:state.ratio,color:t.color,accent:t.accent||"#c95745",caption:state.caption,textColor:state.textColor,fontSize:state.fontSize,textPosition:state.textPosition,sticker:state.sticker,stickerSize:state.stickerSize,stickerX:state.stickerX,stickerY:state.stickerY,layers:structuredClone(state.layers),captionX:state.captionX,captionY:state.captionY,captionRotation:state.captionRotation,frameX:state.frameX,frameY:state.frameY,frameSize:state.frameSize,frameRotation:state.frameRotation,backgroundColor:state.backgroundColor};}
function saveTemplate(){const name=$("#templateName").value.trim();if(!name){$("#templateMessage").textContent="이름을 먼저 적어주세요.";return;}const t=templateFromState(uid(),name);userTemplates.push(t);persistTemplates();state.templateId=t.id;selectedUserTemplateId=t.id;renderTemplates();$("#templateMessage").textContent=`‘${name}’ 템플릿을 저장했어요.`;}
function updateTemplate(){if(!selectedUserTemplateId){$("#templateMessage").textContent="수정할 내 템플릿을 먼저 선택해주세요.";return;}const old=userTemplates.find(t=>t.id===selectedUserTemplateId);const name=$("#templateName").value.trim()||old.name;userTemplates=userTemplates.map(t=>t.id===selectedUserTemplateId?templateFromState(t.id,name):t);persistTemplates();renderTemplates();$("#templateMessage").textContent=`‘${name}’ 템플릿을 업데이트했어요.`;}
function deleteTemplate(){if(!selectedUserTemplateId){$("#templateMessage").textContent="삭제할 내 템플릿을 먼저 선택해주세요.";return;}const target=userTemplates.find(t=>t.id===selectedUserTemplateId);userTemplates=userTemplates.filter(t=>t.id!==selectedUserTemplateId);persistTemplates();state.templateId=DEFAULT_TEMPLATES[0].id;selectedUserTemplateId=null;renderTemplates();draw();$("#templateMessage").textContent=`‘${target.name}’ 템플릿을 삭제했어요.`;}
async function applyTemplateSettings(t){await restoreLayerAssets(t.layers);checkpoint();for(const key of ["captionX","captionY","captionRotation","frameX","frameY","frameSize","frameRotation","backgroundColor"])state[key]=t[key];if(t.layers)state.layers=structuredClone(t.layers);else if("sticker" in t)state.layers=t.sticker?[stickerLayer(t.sticker)]:[];selectedLayer=null;["stickerSize","stickerX","stickerY"].forEach(key=>{state[key]=t[key];});state.templateId=t.id;state.ratio=t.ratio;if("caption"in t)state.caption=t.caption;if("sticker"in t)state.sticker=t.sticker;if("textColor"in t)state.textColor=t.textColor;if("fontSize"in t)state.fontSize=t.fontSize;if("textPosition"in t)state.textPosition=t.textPosition;syncControls();setRatio(state.ratio);renderTemplates();renderStickers();draw();scheduleSave();}
function syncControls(){$("#backgroundColor").value=state.backgroundColor||"#f3f0eb";if($("#layerList"))syncLayerControls();["stickerSize","stickerX","stickerY"].forEach((key,i)=>$("#"+key).value=(state[key]??[.19,.82,.17][i])*100);$("#caption").value=state.caption;$("#textColor").value=state.textColor;$("#fontSize").value=state.fontSize;document.querySelectorAll("#textPosition button").forEach(b=>b.classList.toggle("active",b.dataset.value===state.textPosition));}

const samples=[
  {name:"늦여름의 우리",meta:"4:5 · 은빛 디카",ratio:"4:5",templateId:"camera-silver",caption:"늦여름의 우리",sticker:"spark",textColor:"#fffaf0",fontSize:50,textPosition:"bottom"},
  {name:"네 컷의 오후",meta:"9:16 · 빈티지 필름 네컷",ratio:"9:16",templateId:"life-four",caption:"우리의 작은 오후",sticker:"heart",textColor:"#642f2b",fontSize:44,textPosition:"bottom"},
  {name:"필름 속 주말",meta:"1:1 · 필름",ratio:"1:1",templateId:"film-noir",caption:"SUN. 4:32 PM",sticker:"planet",textColor:"#f1dec2",fontSize:38,textPosition:"center"},
];
function renderSamples(){const grid=$("#sampleGrid");const files=["late-summer-4x5.png","four-cuts-9x16.png","film-weekend-1x1.png"];samples.forEach((sample,i)=>{const button=document.createElement("button");button.type="button";button.className="sample-card";button.innerHTML=`<img src="samples/${files[i]}" alt="${sample.name} 완성본" /><strong>${sample.name}</strong><span>${sample.meta}</span>`;const preview=document.createElement("canvas");preview.width=360;preview.height=360*RATIOS[sample.ratio][1]/RATIOS[sample.ratio][0];draw(preview,{...state,...sample,layers:[stickerLayer(sample.sticker)]});button.querySelector("img").src=preview.toDataURL();button.addEventListener("click",()=>{applyTemplateSettings(sample);window.scrollTo({top:$("#editor").offsetTop-80,behavior:"smooth"});});grid.append(button);});}


let selectedLayer=null,freeDrag=null;
const undoStack=[],redoStack=[];
function migrateLayers(){if(!Array.isArray(state.layers))state.layers=state.sticker&&STICKERS[state.sticker]?[stickerLayer(state.sticker,{x:state.stickerX??.82,y:state.stickerY??.17,size:state.stickerSize??.19})]:[];selectedLayer=state.layers.at(-1)?.id??null;}
function snapshot(){return {...state,layers:structuredClone(state.layers||[]),images:state.images.map(r=>r?{...r,position:{...r.position}}:null)};}
function checkpoint(){undoStack.push(snapshot());if(undoStack.length>60)undoStack.shift();redoStack.length=0;if($("#undoEdit"))$("#undoEdit").disabled=false;}
function travel(from,to){if(!from.length)return;to.push(snapshot());Object.assign(state,from.pop());selectedLayer=state.layers.at(-1)?.id??null;syncControls();renderTemplates();renderFileList();setRatio(state.ratio);refreshEdit();}
function chosen(){return state.layers.find(l=>l.id===selectedLayer);}
function refreshEdit(){syncLayerControls();renderStickers();draw();scheduleSave();}
function syncLayerControls(){
 const list=$("#layerList");if(!list)return;
 list.replaceChildren();for(const [id,label] of [["caption","문구"],["frame","사진 프레임"],...[...(state.layers||[])].reverse().map(l=>[l.id,STICKERS[l.key]?.label||l.key])]){const o=document.createElement("option");o.value=id;o.textContent=label;list.append(o);}list.value=selectedLayer||"";
 const l=chosen(),caption=selectedLayer==="caption",frame=selectedLayer==="frame";
 const values={stickerSize:l?.size??(frame?(state.frameSize??1):state.fontSize/1080),stickerX:l?.x??(caption?(state.captionX??.5):(state.frameX??.5)),stickerY:l?.y??(caption?(state.captionY??({top:.1,center:.5,bottom:.86})[state.textPosition]):(state.frameY??.465)),layerRotation:l?.rotation??(frame?(state.frameRotation??0):(state.captionRotation??0)),layerOpacity:l?.opacity??1};
 for(const [key,value] of Object.entries(values)){const input=$("#"+key);input.value=key==="layerRotation"?value:value*100;input.disabled=!(l||caption||frame)||(!l&&key==="layerOpacity");}
 for(const id of ["duplicateLayer","flipLayer","layerForward","layerBackward","removeSticker"])$("#"+id).disabled=!l;
 $("#undoEdit").disabled=!undoStack.length;$("#redoEdit").disabled=!redoStack.length;
}
function deleteSelected(){const l=chosen();if(!l)return;checkpoint();state.layers=state.layers.filter(x=>x.id!==l.id);selectedLayer=null;refreshEdit();}
function bindFreeEditing(){
 bindPhotoControls();
 $("#customSticker").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(!["image/png","image/jpeg"].includes(file.type))throw new Error("PNG 또는 JPEG 파일만 사용할 수 있어요.");const r=await loadImageFile(file),key="custom-"+crypto.randomUUID();checkpoint();STICKERS[key]={label:file.name,image:r.img,url:r.dataUrl};const l=stickerLayer(key,{dataUrl:r.dataUrl,label:file.name,x:.5,y:.5});state.layers.push(l);selectedLayer=l.id;refreshEdit();}catch(err){$("#fileError").textContent=err.message;}e.target.value="";};
 canvas.tabIndex=0;
 $("#layerList").addEventListener("change",e=>{selectedLayer=e.target.value;syncLayerControls();draw();});
 for(const id of ["stickerSize","stickerX","stickerY","layerRotation","layerOpacity"]){const input=$("#"+id);input.addEventListener("pointerdown",checkpoint);input.addEventListener("keydown",e=>{if(e.key.startsWith("Arrow"))checkpoint();});input.addEventListener("input",e=>{const key={stickerSize:"size",stickerX:"x",stickerY:"y",layerRotation:"rotation",layerOpacity:"opacity"}[id],v=Number(e.target.value)/(key==="rotation"?1:100),l=chosen();if(l)l[key]=v;else if(selectedLayer==="caption"){if(key==="size"){state.fontSize=v*1080;$("#fontSize").value=state.fontSize;}else state[{x:"captionX",y:"captionY",rotation:"captionRotation"}[key]]=v;}else if(selectedLayer==="frame")state[{x:"frameX",y:"frameY",size:"frameSize",rotation:"frameRotation"}[key]]=v;draw();scheduleSave();});}
 $("#duplicateLayer").onclick=()=>{const l=chosen();if(!l)return;checkpoint();const copy=stickerLayer(l.key,{...l,id:crypto.randomUUID(),x:l.x+.03,y:l.y+.03});state.layers.push(copy);selectedLayer=copy.id;refreshEdit();};
 $("#flipLayer").onclick=()=>{const l=chosen();if(l){checkpoint();l.flip=!l.flip;refreshEdit();}};
 for(const [id,direction] of [["layerForward",1],["layerBackward",-1]])$("#"+id).onclick=()=>{const i=state.layers.findIndex(l=>l.id===selectedLayer),j=i+direction;if(i<0||j<0||j>=state.layers.length)return;checkpoint();[state.layers[i],state.layers[j]]=[state.layers[j],state.layers[i]];refreshEdit();};
 $("#undoEdit").onclick=()=>travel(undoStack,redoStack);$("#redoEdit").onclick=()=>travel(redoStack,undoStack);
 for(const id of ["caption","textColor","fontSize"])$("#"+id).addEventListener("focus",checkpoint);
 canvas.addEventListener("keydown",e=>{if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();deleteSelected();}const l=chosen();if(l&&e.key.startsWith("Arrow")){e.preventDefault();checkpoint();const d=e.shiftKey?.02:.002;if(e.key==="ArrowLeft")l.x-=d;if(e.key==="ArrowRight")l.x+=d;if(e.key==="ArrowUp")l.y-=d;if(e.key==="ArrowDown")l.y+=d;refreshEdit();}});
 document.addEventListener("keydown",e=>{if(e.target.matches("input,textarea,select"))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?travel(redoStack,undoStack):travel(undoStack,redoStack);}});
}
function freePointerDown(event){
 const p=canvasPoint(event),w=canvas.width,h=canvas.height;
 const current=chosen();if(current){const r=layerBounds(current,STICKERS[current.key].image,w,h),a=-current.rotation*Math.PI/180,dx=p.x-r.x,dy=p.y-r.y,lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);const action=Math.hypot(lx,ly+r.h/2+32)<24?'rotate':Math.hypot(lx-r.w/2,ly-r.h/2)<24?'scale':null;if(action){checkpoint();freeDrag={action,center:{x:r.x,y:r.y},angle:Math.atan2(dy,dx),rotation:current.rotation,size:current.size,distance:Math.hypot(dx,dy)};canvas.setPointerCapture(event.pointerId);return true;}}

 const l=[...state.layers].reverse().find(l=>hitLayer(p,l,STICKERS[l.key].image,w,h));
 let kind=l?.id;
 const cy=state.captionY??({top:.1,center:.5,bottom:.86})[state.textPosition];
 // Caption is drawn above stickers and has first priority unless the frame tool is selected.
 if(state.caption.trim()&&Math.abs(p.x/w-(state.captionX??.5))<.4&&Math.abs(p.y/h-cy)<state.fontSize*2/h)kind="caption";
 if(selectedLayer==="frame")kind="frame";
 if(!kind){selectedLayer=null;syncLayerControls();return false;}
 selectedLayer=kind;checkpoint();const item=chosen();const origin=item?{x:item.x,y:item.y}:kind==="caption"?{x:state.captionX??.5,y:cy}:{x:state.frameX??.5,y:state.frameY??.465};
 freeDrag={start:p,origin,kind};canvas.focus();canvas.setPointerCapture(event.pointerId);canvas.classList.add("dragging");syncLayerControls();return true;
}
function freePointerMove(event){if(!freeDrag)return false;const p=canvasPoint(event);if(freeDrag.action){const l=chosen(),dx=p.x-freeDrag.center.x,dy=p.y-freeDrag.center.y;if(freeDrag.action==="rotate")l.rotation=freeDrag.rotation+(Math.atan2(dy,dx)-freeDrag.angle)*180/Math.PI;else l.size=clamp(freeDrag.size*Math.hypot(dx,dy)/Math.max(1,freeDrag.distance),.01,3);draw();syncLayerControls();return true;}const x=freeDrag.origin.x+(p.x-freeDrag.start.x)/canvas.width,y=freeDrag.origin.y+(p.y-freeDrag.start.y)/canvas.height;const l=chosen();if(l){l.x=x;l.y=y;}else if(freeDrag.kind==="caption"){state.captionX=x;state.captionY=y;}else{state.frameX=x;state.frameY=y;}draw();syncLayerControls();return true;}
function finishFreeDrag(){if(!freeDrag)return;freeDrag=null;canvas.classList.remove("dragging");scheduleSave();}


function syncPhotoControls(){const select=$("#photoSlot");if(!select)return;const r=state.images[Number(select.value)];$("#photoZoom").value=r?.zoom??1;$("#photoRotate").value=r?.rotate??0;}
function bindPhotoControls(){
 $("#photoSlot").onchange=syncPhotoControls;
 for(const [id,key] of [["photoZoom","zoom"],["photoRotate","rotate"]]){$("#"+id).addEventListener("pointerdown",checkpoint);$("#"+id).oninput=e=>{const r=state.images[Number($("#photoSlot").value)];if(r){r[key]=Number(e.target.value);draw();scheduleSave();}};}
 $("#replacePhoto").onclick=()=>{pendingSlot=Number($("#photoSlot").value);$("#slotImageInput").click();};
 $("#removePhoto").onclick=()=>{checkpoint();state.images[Number($("#photoSlot").value)]=null;renderFileList();refreshEdit();};
 for(const [id,d] of [["photoBefore",-1],["photoAfter",1]])$("#"+id).onclick=()=>{const i=Number($("#photoSlot").value),j=i+d;if(j<0||j>3)return;checkpoint();[state.images[i],state.images[j]]=[state.images[j]??null,state.images[i]??null];$("#photoSlot").value=j;renderFileList();refreshEdit();};
 $("#backgroundColor").addEventListener("focus",checkpoint);$("#backgroundColor").oninput=e=>{state.backgroundColor=e.target.value;draw();scheduleSave();};
}

function drawSelection(c,w,h){const l=chosen();if(!l||!STICKERS[l.key])return;const r=layerBounds(l,STICKERS[l.key].image,w,h);c.save();c.translate(r.x,r.y);c.rotate(l.rotation*Math.PI/180);c.strokeStyle="#a9473e";c.lineWidth=3;c.setLineDash([10,7]);c.strokeRect(-r.w/2,-r.h/2,r.w,r.h);c.setLineDash([]);c.fillStyle="#fff";for(const [x,y] of [[r.w/2,r.h/2],[0,-r.h/2-32]]){c.beginPath();c.arc(x,y,12,0,Math.PI*2);c.fill();c.stroke();}c.restore();}
async function restoreLayerAssets(layers=[]){for(const l of layers){if(l.dataUrl){const image=await imageFromDataUrl(l.dataUrl);STICKERS[l.key]={label:l.label||"내 스티커",image,url:l.dataUrl};}}}
async function start(){
 $("#download").disabled=true;$("#statusText").textContent="원본 스티커와 프레임 준비 중…";
 try{await prepareAssets();await restoreState();await restoreLayerAssets(state.layers);migrateLayers();bindEvents();bindFreeEditing();renderTemplates();renderStickers();syncControls();renderFileList();setRatio(state.ratio);renderSamples();$("#download").disabled=false;}
 catch(error){$("#statusText").textContent=error.message;}
}
start();
