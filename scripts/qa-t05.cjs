// Frozen T05 v1: ten independent browser checks; no network fixtures or personal images.
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch (error) {
  if (process.env.PLAYWRIGHT_MODULE) throw error;
  playwright = require(require('node:path').resolve(require('node:path').dirname(process.execPath), '../node_modules/playwright'));
}
const { chromium } = playwright;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { controls } = require('./ui-qa.cjs');
const root = path.resolve(__dirname, '..');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.json':'application/json', '.woff2':'font/woff2' };
const cases = [];
function check(id, body) { cases.push({id, body}); }
const waitSave = async p => { await p.waitForTimeout(280); await p.waitForFunction(() => document.querySelector('#statusText').textContent === '자동 저장됨'); return p.evaluate(() => JSON.parse(localStorage.getItem('cutnote-state'))); };
const savedTemplates = p => p.evaluate(() => JSON.parse(localStorage.getItem('cutnote-templates') || '[]'));
const labels = p => p.locator('#layerList option').evaluateAll(xs => xs.map(x => ({id:x.value, label:x.textContent})));
const selectLayer = async (p,id) => { await controls(p).select('#layerList',id); await p.waitForTimeout(60); };
const sticker = async p => { await controls(p).click('[data-sticker="heart"]'); return (await waitSave(p)).layers.at(-1); };
const saveTemplate = async (p,name) => { const c=controls(p); await c.fill('#templateName',name); await c.click('#saveTemplate'); await waitSave(p); return (await savedTemplates(p)).at(-1); };
const templateNames = p => p.locator('#savedTemplateList strong').allTextContents();
const search = async (p,q) => { await controls(p).fill('#templateSearch',q); };
const drag = async (p,x,y,dx,dy) => { const b=await p.locator('#preview').boundingBox(); await p.mouse.move(b.x+b.width*x,b.y+b.height*y); await p.mouse.down(); await p.mouse.move(b.x+b.width*(x+dx),b.y+b.height*(y+dy),{steps:6}); await p.mouse.up(); await waitSave(p); };
const pixel = p => p.locator('#preview').evaluate(c => { const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let h=2166136261; for(let i=0;i<d.length;i++) h=Math.imul(h^d[i],16777619); return h>>>0; });
const download = async (p,selector) => { const waiting=p.waitForEvent('download'); await controls(p).click(selector); const d=await waiting; return fs.readFileSync(await d.path()); };
const importJSON = async (p,data) => { await controls(p).click('#openImport'); await p.locator('#jsonInput').setInputFiles({name:'synthetic-project.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))}); await p.waitForTimeout(350); };
const numberOf = label => { const m=label.match(/\s(\d+)(?:\s*[·🔒].*)?$/u); assert.ok(m,`Number missing: ${label}`); return Number(m[1]); };
const assetUpload = async p => { const b=await p.evaluate(() => { const c=document.createElement('canvas'); c.width=c.height=32; c.getContext('2d').fillRect(0,0,32,32); return c.toDataURL().split(',')[1]; }); await controls(p).click('[data-pane="stickers"]'); await p.locator('#customSticker').setInputFiles({name:'heart.png',mimeType:'image/png',buffer:Buffer.from(b,'base64')}); return (await waitSave(p)).layers.at(-1); };

check('T05-01', async p => {
  const a=await saveTemplate(p,'하트 여행'); await saveTemplate(p,'Chrome Note'); await saveTemplate(p,'여행 기록');
  await search(p,' 여행 '); assert.deepEqual(await templateNames(p),['하트 여행','여행 기록']);
  await search(p,'CHROME'); assert.deepEqual(await templateNames(p),['Chrome Note']);
  await search(p,'하트'.normalize('NFD')); assert.deepEqual(await templateNames(p),['하트 여행']);
  await controls(p).click(`[data-saved-template="${a.id}"]`); assert.equal((await waitSave(p)).templateId,a.id);
});
check('T05-02', async p => {
  await controls(p).click('[data-pane="saved"]'); assert.match(await p.locator('#savedTemplateEmpty').textContent(),/저장.*없/);
  const a=await saveTemplate(p,'하트 여행'); await saveTemplate(p,'Chrome Note'); await saveTemplate(p,'여행 기록');
  await search(p,'없는 이름'); assert.deepEqual(await templateNames(p),[]); assert.match(await p.locator('#savedTemplateEmpty').textContent(),/검색/);
  await controls(p).click('#clearTemplateSearch'); assert.equal((await templateNames(p)).length,3);
  await search(p,'하트 여행'); await controls(p).click(`[data-saved-template="${a.id}"]`);
  await controls(p).fill('#templateName','새 구성'); await controls(p).click('#updateTemplate'); await waitSave(p); assert.deepEqual(await templateNames(p),[]);
  await search(p,'새 구성'); await controls(p).click(`[data-saved-template="${a.id}"]`); await controls(p).click('#deleteTemplate'); await waitSave(p); assert.deepEqual(await templateNames(p),[]);
  await p.reload(); await p.waitForFunction(() => !document.querySelector('#download').disabled);
  assert.equal(await p.locator('#templateSearch').inputValue(),''); assert.equal((await savedTemplates(p)).length,2);
});
check('T05-03', async p => {
  const l=await sticker(p); await controls(p).click('#lockLayer'); const before=await waitSave(p); assert.equal(before.layers.find(x=>x.id===l.id).locked,true);
  await drag(p,l.x,l.y,.06,.04); await p.locator('#preview').focus(); await p.keyboard.press('ArrowRight'); await p.keyboard.press('Delete');
  for(const id of ['stickerSize','stickerX','stickerY','layerRotation','layerOpacity']) { assert.ok(await p.locator('#'+id).isDisabled()); await p.locator('#'+id).evaluate(el=>{el.value='73';el.dispatchEvent(new Event('input',{bubbles:true}));}); }
  for(const id of ['duplicateLayer','flipLayer','layerForward','layerBackward','removeSticker']) { assert.ok(await p.locator('#'+id).isDisabled()); await p.locator('#'+id).dispatchEvent('click'); }
  for(const action of ['rotate','scale','flip','delete']) { const el=p.locator(`[data-quick="${action}"]`); assert.ok(await el.isHidden() || await el.isDisabled()); await el.dispatchEvent(action==='rotate'||action==='scale'?'pointerdown':'click',{pointerId:11,clientX:100,clientY:100}); await el.dispatchEvent('pointermove',{pointerId:11,clientX:200,clientY:200}); await el.dispatchEvent('pointerup',{pointerId:11,clientX:200,clientY:200}); }
  const after=await waitSave(p); assert.deepEqual(after.layers,before.layers); assert.deepEqual(after.images,before.images);
});
check('T05-04', async p => {
  const l=await sticker(p); await controls(p).click('#lockLayer'); await waitSave(p);
  await controls(p).click('#undoEdit'); assert.notEqual((await waitSave(p)).layers.find(x=>x.id===l.id).locked,true);
  await controls(p).click('#redoEdit'); assert.equal((await waitSave(p)).layers.find(x=>x.id===l.id).locked,true);
  await controls(p).click('#lockLayer'); await waitSave(p); await p.locator('#preview').focus(); await p.keyboard.press('ArrowRight'); assert.ok((await waitSave(p)).layers.find(x=>x.id===l.id).x>l.x);
});
check('T05-05', async p => {
  await sticker(p); await controls(p).click('#lockLayer'); await waitSave(p); const before=await labels(p),data=JSON.parse((await download(p,'#exportJson')).toString());
  await importJSON(p,data); const state=await waitSave(p); assert.equal(state.layers.at(-1).locked,true); assert.deepEqual(await labels(p),before);
  const legacy=structuredClone(data); delete legacy.state.layers.at(-1).locked; await importJSON(p,legacy); assert.notEqual((await waitSave(p)).layers.at(-1).locked,true);
  const valid=await waitSave(p),bad=structuredClone(data); bad.state.layers.at(-1).locked='yes'; await importJSON(p,bad); assert.deepEqual((await waitSave(p)).layers,valid.layers); assert.match(await p.locator('#jsonError').textContent(),/올바르|손상|레이어|잠금|형식/);
});
check('T05-06', async p => {
  const a=await sticker(p),b=await sticker(p),c=await sticker(p); const rows=await labels(p),base=new Map(rows.filter(x=>[a.id,b.id,c.id].includes(x.id)).map(x=>[x.id,numberOf(x.label)])); assert.deepEqual([base.get(a.id),base.get(b.id),base.get(c.id)],[1,2,3]);
  await selectLayer(p,a.id); await controls(p).click('#layerForward'); await waitSave(p); for(const x of await labels(p)) if(base.has(x.id))assert.equal(numberOf(x.label),base.get(x.id));
  await selectLayer(p,b.id); await controls(p).click('#removeSticker'); await waitSave(p); const d=await sticker(p); assert.ok(numberOf((await labels(p)).find(x=>x.id===d.id).label)>3);
  await controls(p).click('#duplicateLayer'); const e=(await waitSave(p)).layers.at(-1); assert.notEqual(e.id,d.id); assert.ok(numberOf((await labels(p)).find(x=>x.id===e.id).label)>numberOf((await labels(p)).find(x=>x.id===d.id).label)); assert.equal(numberOf((await labels(p)).find(x=>x.id===a.id).label),1);
});
check('T05-07', async p => {
  const a=await assetUpload(p),b=await assetUpload(p),rows=await labels(p); assert.notEqual(a.id,b.id); assert.deepEqual([a,b].map(l=>numberOf(rows.find(x=>x.id===l.id).label)),[1,2]);
  for(let i=0;i<2;i++){await controls(p).click('#addText');await controls(p).fill('#caption','안녕');await waitSave(p);}
  await controls(p).click('#duplicateText'); const state=await waitSave(p),names=await labels(p); assert.equal(new Set(state.texts.map(t=>t.id)).size,3); assert.deepEqual(state.texts.map(t=>numberOf(names.find(x=>x.id===t.id).label)),[1,2,3]);
});
check('T05-08', async p => {
  const l=await sticker(p); assert.equal(await p.locator('#toggleGrid').getAttribute('aria-pressed'),'false'); const off=await pixel(p); await controls(p).click('#toggleGrid'); await p.waitForTimeout(80); assert.equal(await p.locator('#toggleGrid').getAttribute('aria-pressed'),'true'); assert.notEqual(await pixel(p),off);
  for(const ratio of ['1:1','4:5','9:16']) { await controls(p).click(`[data-ratio="${ratio}"]`); await waitSave(p); const dims=await p.locator('#preview').evaluate(c=>[c.width,c.height]); assert.deepEqual(dims,ratio==='1:1'?[1080,1080]:ratio==='4:5'?[1080,1350]:[1080,1920]); const on=await pixel(p); await controls(p).click('#toggleGrid'); await p.waitForTimeout(50); assert.notEqual(await pixel(p),on); await controls(p).click('#toggleGrid'); }
  await drag(p,l.x,l.y,.04,.03); assert.ok(Math.abs((await waitSave(p)).layers.find(x=>x.id===l.id).x-l.x-.04)<.01); await controls(p).click('#toggleGrid'); assert.equal(await p.locator('#toggleGrid').getAttribute('aria-pressed'),'false');
});
check('T05-09', async p => {
  await controls(p).click('#buildOwn'); await waitSave(p); const off=await pixel(p),buffers={};
  for(const format of ['png','jpg','pdf']) { await controls(p).select('#exportFormat',format); buffers[format]=await download(p,'#download'); }
  await controls(p).click('#toggleGrid'); await p.waitForTimeout(80); assert.notEqual(await pixel(p),off);
  for(const format of ['png','jpg','pdf']) { await controls(p).select('#exportFormat',format); assert.deepEqual(await download(p,'#download'),buffers[format],format+' should exclude the grid'); }
  const data=JSON.parse((await download(p,'#exportJson')).toString()); assert.ok(!Object.keys(data.state).some(k=>/grid/i.test(k))); assert.ok(data.templates.every(t=>!Object.keys(t).some(k=>/grid/i.test(k))));
});
check('T05-10', async p => {
  await p.setViewportSize({width:390,height:844}); const l=await sticker(p); await controls(p).click('#lockLayer'); await waitSave(p); const rows=await labels(p),a=await saveTemplate(p,'모바일 구성'); await search(p,'모바일'); assert.deepEqual(await templateNames(p),['모바일 구성']);
  await controls(p).click('#toggleGrid'); await controls(p).click('#buildOwn'); await waitSave(p); await controls(p).click(`[data-saved-template="${a.id}"]`); assert.equal((await waitSave(p)).layers.find(x=>x.id===l.id).locked,true); assert.deepEqual(await labels(p),rows);
  await p.reload(); await p.waitForFunction(() => !document.querySelector('#download').disabled); assert.equal((await waitSave(p)).layers.find(x=>x.id===l.id).locked,true); assert.deepEqual(await labels(p),rows); assert.equal(await p.locator('#toggleGrid').getAttribute('aria-pressed'),'false');
});

(async()=>{
  assert.equal(cases.length,10); const stage=process.env.T05_STAGE||'unlabelled'; const output=path.join(root,'qa'); fs.mkdirSync(output,{recursive:true});
  const server=http.createServer((req,res)=>{ let target;try{target=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));}catch{res.writeHead(400);return res.end();} if(target===root)target=path.join(root,'index.html'); if(!target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(target,(err,data)=>{if(err){res.writeHead(404);res.end();}else{res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');res.end(data);}}); });
  await new Promise(r=>server.listen(0,'127.0.0.1',r)); const url=`http://127.0.0.1:${server.address().port}`;
  let browser; const results=[];const started=new Date().toISOString();
  try { browser=await chromium.launch({channel:'msedge',headless:true}); for(const test of cases){ const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});const p=await context.newPage(),errors=[];p.setDefaultTimeout(10000);p.setDefaultNavigationTimeout(30000);p.on('pageerror',e=>errors.push(e.message));const t=Date.now();try{await p.goto(url,{waitUntil:"domcontentloaded",timeout:30000});await p.waitForFunction(()=>document.querySelector('#download')&&!document.querySelector('#download').disabled,null,{timeout:45000});await waitSave(p);await test.body(p);assert.deepEqual(errors,[]);results.push({id:test.id,status:'PASS',milliseconds:Date.now()-t});console.log('PASS '+test.id);}catch(e){results.push({id:test.id,status:'FAIL',milliseconds:Date.now()-t,error:e.message,runtimeErrors:errors});console.log('FAIL '+test.id+' '+e.message.split('\n')[0]);} await p.screenshot({path:path.join(output,`t05-${stage}-${test.id}.png`)});await context.close(); } }
  finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
  const report={schemaVersion:1,checksVersion:'T05-v1',stage,startedAt:started,endedAt:new Date().toISOString(),pass:results.filter(x=>x.status==='PASS').length,total:10,results};const filename=path.join(output,`t05-${stage}-${Date.now()}.json`);fs.writeFileSync(filename,JSON.stringify(report,null,2));console.log(JSON.stringify({file:filename,pass:report.pass,total:10}));process.exitCode=report.pass===10?0:1;
})().catch(e=>{console.error(e);process.exitCode=2;});
