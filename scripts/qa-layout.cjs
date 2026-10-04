const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),assert=require('assert/strict'),path=require('path');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1100},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const saved=async()=>{await page.waitForTimeout(250);return page.evaluate(()=>JSON.parse(localStorage.getItem('cutnote-state')))};
 const range=async(id,v)=>{await page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}))},v);return saved()};
 const download=async(id,name)=>{const wait=page.waitForEvent('download');await page.locator('#'+id).click();await(await wait).saveAs(path.resolve('qa',name));return fs.readFileSync('qa/'+name)};
 const restore=async data=>{await page.locator('#openImport').click();await page.locator('#jsonInput').setInputFiles({name:'layout.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await page.waitForTimeout(500);};
 try{
 await page.goto(process.env.QA_URL||'http://localhost:3000');await page.waitForFunction(()=>!document.querySelector('#download').disabled);
 await page.locator('#buildOwn').click();assert.equal((await saved()).customSlots.length,0);assert.equal(await page.locator('#replacePhoto').isDisabled(),true);
 const photo=await page.evaluate(()=>{let c=document.createElement('canvas');c.width=600;c.height=400;let x=c.getContext('2d');x.fillStyle='#929292';x.fillRect(0,0,600,400);x.fillStyle='#171717';x.fillRect(0,0,200,400);x.fillStyle='white';x.font='bold 60px sans-serif';x.fillText('STUDIO / 03',230,210);return c.toDataURL().split(',')[1]});
 await page.locator('#imageInput').setInputFiles({name:'studio.png',mimeType:'image/png',buffer:Buffer.from(photo,'base64')});assert.equal((await saved()).customSlots.length,1);
 await range('slotW',48);await range('slotH',45);await range('slotX',8);await range('slotY',10);let before=(await saved()).customSlots;
 await page.locator('#addSlot').click();assert.equal((await saved()).customSlots.length,2);await page.locator('#undoEdit').click();assert.deepEqual((await saved()).customSlots,before);await page.locator('#redoEdit').click();assert.equal((await saved()).customSlots.length,2);
 await range('slotW',35);await range('slotH',38);await range('slotX',60);await range('slotY',55);
 await page.locator('#moveSlots').check();await page.locator('#preview').scrollIntoViewIfNeeded();let b=await page.locator('#preview').boundingBox();await page.mouse.move(b.x+b.width*.7,b.y+b.height*.65);await page.mouse.down();await page.mouse.move(b.x+b.width*.6,b.y+b.height*.6,{steps:5});await page.mouse.up();assert.ok((await saved()).customSlots[1].x<.6);
 await page.locator('[data-sticker="heart"]').click();await range('stickerX',75);await range('stickerY',20);await range('layerRotation',25);
 await page.locator('#addText').click();await page.locator('#caption').fill('나만의 스튜디오');await range('textY',90);
 await page.locator('#templateName').fill('내 레이아웃');await page.locator('#saveTemplate').click();let original=await saved();const json=JSON.parse(await download('exportJson','custom-layout.json'));
 await page.locator('[data-template="life-four"]').click();await restore(json);assert.deepEqual((await saved()).customSlots,original.customSlots);assert.deepEqual((await saved()).layers,original.layers);assert.deepEqual((await saved()).texts,original.texts);
 await page.reload();await page.waitForFunction(()=>!document.querySelector('#download').disabled);assert.deepEqual((await saved()).customSlots,original.customSlots);
 console.log('PASS custom blank / automatic photo slots / slot coordinates / drag / undo / redo / JSON / reload');
 for(const invalid of [null,[{x:NaN,y:0,w:.4,h:.4}],[{x:.9,y:0,w:.4,h:.4}],Array(5).fill({x:0,y:0,w:.2,h:.2})]){let broken=structuredClone(json);broken.state.customSlots=invalid;await restore(broken);assert.ok(await page.locator('#jsonError').textContent());assert.deepEqual((await saved()).customSlots,original.customSlots);await page.locator('#importDialog .dialog-close').click();}
 console.log('PASS corrupt custom layouts reject without replacing current work');
 await page.locator('#exportFormat').selectOption('png');await download('download','custom-layout.png');
 for(const ratio of ['1:1','4:5','9:16']){await page.locator(`[data-ratio="${ratio}"]`).click();await page.locator('#exportFormat').selectOption('pdf');const pdf=await download('download',`custom-${ratio.replace(':','x')}.pdf`);assert.equal(pdf.subarray(0,8).toString(),'%PDF-1.4');}
 await page.locator('#exportFormat').selectOption('jpg');const jpg=await download('download','custom-layout.jpg');assert.equal(jpg.readUInt16BE(0),0xffd8);console.log('PASS PNG / JPEG / PDF at all canvas ratios');
 await page.locator('[data-template="editorial-collage"]').click();assert.equal((await saved()).customSlots.length,3);
 await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'})});await page.waitForTimeout(300);await page.screenshot({path:'qa/studio-desktop.png',fullPage:true});await page.locator('#preview').screenshot({path:'qa/studio-canvas.png'});
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);if(width===390){await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'})});await page.waitForTimeout(300);await page.screenshot({path:'qa/studio-mobile.png',fullPage:true});}}
 assert.deepEqual(errors,[]);console.log('PASS 320 / 390 / 768 / 1440 responsive layouts / no runtime errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
