// Reveal the actual tab/accordion/page through its controls before QA actions.
exports.controls = page => {
 async function reveal(selector){
  const locator=page.locator(selector),context=await locator.evaluate(el=>({pane:el.closest('[role=tabpanel]')?.id,tool:el.closest('[data-tool]')?.dataset.tool,template:el.closest('[data-template]')?.dataset.template}));
  if(context.pane){await page.locator(`[data-pane="${context.pane.replace('pane-','')}"]`).click();if(await page.locator('.mobile-tools').isVisible())await page.locator('[data-mobile=library]').click();}
  if(context.tool){if(await page.locator('.mobile-tools').isVisible())await page.locator(`[data-mobile="${context.tool}"]`).click();const d=page.locator(`[data-tool="${context.tool}"]`);if(!await d.evaluate(el=>el.open))await d.locator('summary').click();}
  if(context.template){const index=await locator.evaluate(el=>[...el.parentElement.children].indexOf(el)),target=Math.floor(index/6);for(let i=0;i<20;i++){const current=Number((await page.locator('.template-pager span').textContent()).split('/')[0])-1;if(current===target)break;await page.locator(`.template-pager button[aria-label="${current<target?'다음':'이전'} 템플릿"]`).click();}}
  return locator;
 }
 return {click:async s=>(await reveal(s)).click(),fill:async(s,v)=>(await reveal(s)).fill(v),select:async(s,v)=>(await reveal(s)).selectOption(v)};
};
