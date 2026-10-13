// Supplemental identity/lock cases. The frozen ten checks remain unchanged.
const path=require('node:path'), fs=require('node:fs'), assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const {controls}=require('./ui-qa.cjs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}), c=controls(page), errors=[], checks=[];
 page.on('pageerror',e=>errors.push(e.message));
 const saved=async()=>{await page.waitForTimeout(300);return page.evaluate(()=>JSON.parse(localStorage.getItem('cutnote-state')));};
 const pass=name=>{checks.push(name);console.log('PASS '+name);};
 try {
  await page.goto(process.env.QA_URL||'http://127.0.0.1:31805');
  await page.waitForFunction(()=>!document.querySelector('#download').disabled,null,{timeout:45000});
  await c.click('#buildOwn');
  await c.click('#addText');await c.fill('#caption','먼저');
  await c.click('#addText');await c.fill('#caption','안녕');
  let state=await saved(), [first,second]=state.texts;
  await c.select('#textList',first.id);await c.fill('#caption','안녕');
  state=await saved();assert.equal(state.texts.find(t=>t.id===second.id).number,1);assert.equal(state.texts.find(t=>t.id===first.id).number,2);
  await c.click('#undoEdit');assert.equal((await saved()).texts.find(t=>t.id===first.id).caption,'먼저');
  await c.click('#redoEdit');assert.equal((await saved()).texts.find(t=>t.id===first.id).number,2);
  pass('Earlier text renamed into an existing group preserves the other ID and undo/redo');
  await c.click('#buildOwn');
  const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=64;c.getContext('2d').fillRect(0,0,64,64);return c.toDataURL().split(',')[1];});
  await page.locator('#imageInput').setInputFiles({name:'synthetic.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});
  await saved();await c.click('[data-sticker="heart"]');
  for(const id of ['stickerX','stickerY'])await page.locator('#'+id).evaluate(el=>{el.value=50;el.dispatchEvent(new Event('input',{bubbles:true}));});
  await c.click('#lockLayer');const before=await saved(), layer=before.layers.at(-1);
  await c.select('#photoSlot','0');
  const box=await page.locator('#preview').boundingBox();
  await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();
  await page.mouse.move(box.x+box.width*.6,box.y+box.height*.6,{steps:5});await page.mouse.up();
  assert.equal(await page.locator('#layerList').inputValue(),layer.id);
  const after=await saved();assert.deepEqual(after.layers,before.layers);assert.deepEqual(after.images,before.images);
  await c.click('#lockLayer');assert.equal((await saved()).layers.at(-1).locked,false);
  pass('Canvas reselects a locked sticker over a real photo without moving either; unlock remains reachable');
  // Restore a genuinely old backup without either new metadata field.
  const legacy={version:2,state:await saved(),templates:[]};
  for(const l of legacy.state.layers){delete l.number;delete l.locked;}
  await c.click('#openImport');await page.locator('#jsonInput').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(legacy))});
  state=await saved();assert.equal(state.layers.at(-1).number,1);assert.equal(state.layers.at(-1).locked,false);
  pass('Legacy JSON with both metadata fields absent migrates to number 1 and unlocked');
  assert.deepEqual(errors,[]);
  fs.writeFileSync('docs/evidence/b-supplemental.json',JSON.stringify({endedAt:new Date().toISOString(),pass:checks.length,checks,runtimeErrors:errors},null,2));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
