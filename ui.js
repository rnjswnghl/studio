export function setupStudioUI() {
  const $ = s => document.querySelector(s);
  const left = $('.control-panel'), right = $('.template-panel');
  const text = $('#addText').closest('.tool-block'), paper = $('#ratios').closest('.tool-block');
  const photo = document.createElement('div');
  for (const node of [...left.children]) if (!node.classList.contains('panel-heading') && node !== text && node !== paper) photo.append(node);
  function section(label, key, content, open = false) {
    const detail = document.createElement('details'); detail.className = 'tool-section'; detail.dataset.tool = key; detail.open = open;
    const summary = document.createElement('summary'); summary.textContent = label;
    detail.append(summary, content); left.append(detail); return detail;
  }
  const panels = {photo:section('사진', 'photo', photo, true),text:section('텍스트', 'text', text)};
  text.querySelector('.tool-label')?.remove(); paper.querySelector('.tool-label')?.remove();paper.className='canvas-settings';$('.download-row').before(paper);
  const stickerSection = $('.sticker-section');
  const stickerPane = document.createElement('div'), layerPane = document.createElement('div'), templatePane = document.createElement('div');
  const grid = $('#stickerGrid');
  stickerPane.append($('#customSticker').closest('label'), grid);
  stickerSection.querySelector('.tool-label')?.remove();
  layerPane.append(...stickerSection.children);
  templatePane.append($('#buildOwn'), $('#templateGrid'));
  const manager = $('.template-manager');
  right.replaceChildren();
  const tabs = document.createElement('div'); tabs.className = 'library-tabs'; tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label','소재 보관함');
  const entries = [['templates','템플릿',templatePane],['stickers','스티커',stickerPane],['layers','레이어',layerPane],['saved','저장',manager]];
  function selectTab(key) {
    for(const [id,,pane] of entries) { pane.hidden = id !== key; const b = tabs.querySelector(`[data-pane="${id}"]`);b.setAttribute('aria-selected',String(id === key));b.tabIndex=id===key?0:-1; }
    right.scrollTop=0;
  }
  for (const [key,label,pane] of entries) {
    pane.id='pane-'+key;pane.classList.add('library-pane');pane.setAttribute('role','tabpanel');pane.setAttribute('aria-labelledby','tab-'+key);
    const b=document.createElement('button');b.type='button';b.id='tab-'+key;b.dataset.pane=key;b.textContent=label;b.setAttribute('role','tab');b.setAttribute('aria-controls',pane.id);b.onclick=()=>selectTab(key);tabs.append(b);
  }
  right.append(tabs,...entries.map(e=>e[2]));selectTab('templates');
  const templateGrid = $('#templateGrid'), pager = document.createElement('div');pager.className='template-pager';
  const previous=document.createElement('button'),next=document.createElement('button'),counter=document.createElement('span');
  previous.type=next.type='button';previous.textContent='←';next.textContent='→';previous.setAttribute('aria-label','이전 템플릿');next.setAttribute('aria-label','다음 템플릿');
  pager.append(previous,counter,next);templateGrid.after(pager);let templatePage=0;
  function paginate(){const count=Math.max(1,Math.ceil(templateGrid.children.length/6));templatePage=Math.min(templatePage,count-1);[...templateGrid.children].forEach((b,i)=>b.hidden=Math.floor(i/6)!==templatePage);counter.textContent=`${templatePage+1} / ${count}`;previous.disabled=templatePage===0;next.disabled=templatePage===count-1;}
  previous.onclick=()=>{templatePage--;paginate();};next.onclick=()=>{templatePage++;paginate();};new MutationObserver(()=>{const selected=[...templateGrid.children].findIndex(b=>b.classList.contains('active'));if(selected>=0)templatePage=Math.floor(selected/6);paginate();}).observe(templateGrid,{childList:true});paginate();
  tabs.onkeydown=e=>{const buttons=[...tabs.children],i=buttons.indexOf(document.activeElement);let next;
    if(e.key==='ArrowRight')next=(i+1)%4;if(e.key==='ArrowLeft')next=(i+3)%4;if(e.key==='Home')next=0;if(e.key==='End')next=3;
    if(next!==undefined){e.preventDefault();buttons[next].click();buttons[next].focus();}
  };
  // History is always reachable, independently of the selected library tab.
  const history=document.createElement('div');history.className='history-buttons';history.append($('#undoEdit'),$('#redoEdit'));$('.stage-topline').prepend(history);
  $('#undoEdit').textContent='↶';$('#redoEdit').textContent='↷';$('#undoEdit').setAttribute('aria-label','실행 취소');$('#redoEdit').setAttribute('aria-label','다시 실행');
  function mobile(key) {
    $('.editor-shell').dataset.mobile=key;
    document.querySelectorAll('[data-mobile]').forEach(b=>{b.classList.toggle('active',b.dataset.mobile===key);b.setAttribute('aria-pressed',String(b.dataset.mobile===key));});
    if(panels[key])for(const [id,panel]of Object.entries(panels))panel.open=id===key;
  }
  document.querySelectorAll('[data-mobile]').forEach(b=>b.onclick=()=>mobile(b.dataset.mobile));mobile('photo');
  $('#buildOwn').addEventListener('click',()=>{panels.photo.open=true;mobile('photo');});
  $('#templateGrid').addEventListener('click',()=>{panels.photo.open=true;});
  $('#stickerGrid').addEventListener('click',()=>selectTab('layers'));
  $('#customSticker').addEventListener('change',()=>selectTab('layers'));
  new MutationObserver(()=>{if(!$('#textEditor').hidden){panels.text.open=true;if(matchMedia('(max-width: 760px)').matches)mobile('text');}}).observe($('#textEditor'),{attributes:true,attributeFilter:['hidden']});

  const balloon=document.createElement('div');balloon.id='helpBalloon';balloon.setAttribute('role','tooltip');balloon.hidden=true;document.body.append(balloon);
  function help(anchor, source, label='도움말') {
    const b=document.createElement('button');b.type='button';b.className='help-icon';b.textContent='!';b.setAttribute('aria-label',label);b.setAttribute('aria-describedby','helpBalloon');
    const hide=()=>{balloon.hidden=true;b.setAttribute('aria-expanded','false');};
    const show=()=>{balloon.textContent=typeof source==='function'?source():source;if(!balloon.textContent.trim())return;balloon.hidden=false;b.setAttribute('aria-expanded','true');const r=b.getBoundingClientRect(),w=balloon.offsetWidth,h=balloon.offsetHeight;balloon.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left))+'px';balloon.style.top=(r.bottom+h+12<innerHeight?r.bottom+8:Math.max(8,r.top-h-8))+'px';};
    b.onmouseenter=show;b.onmouseleave=hide;b.onfocus=show;b.onblur=hide;b.onclick=()=>balloon.hidden?show():hide();b.onkeydown=e=>{if(e.key==='Escape')hide();};
    anchor.append(b);return b;
  }
  help(panels.photo.querySelector('summary'),()=>$('#photoHelp').textContent+' PNG/JPEG 최대 4장. 사진을 더블클릭하면 교체합니다.');
  help(panels.text.querySelector('summary'),'텍스트를 추가한 뒤 캔버스에서 드래그하세요. 방향키로 이동하고 Shift를 누르면 크게 이동합니다.');
  help(paper,'비율과 배경색을 선택합니다. 저장 파일은 미리보기와 같은 구성으로 출력됩니다.');
  help($('.stage-topline'),'사진은 칸 안에서 드래그해 크롭합니다. 스티커와 텍스트는 드래그로 이동합니다. 편집 가능한 원본은 JSON으로 저장하세요.');
  help($('#customLayout'),'최대 4칸. 아래 사진칸 선택창에서 대상을 고른 뒤 위치와 크기를 조절하세요. 사진칸 이동 모드를 끄면 사진 크롭을 조절합니다.');
  for(const p of document.querySelectorAll('.edit-hint,.canvas-help')){
    if(p.id==='fontStatus')continue;
    p.hidden=true;
  }
  const carousel=document.createElement('div');carousel.className='carousel-nav';
  const categories=[['전체',()=>true],['크롬',k=>['star','heart','planet','spark','cross','flower','infinity','ribbon','crown','wave-heart','butterfly','splash','ring','rose','thumb'].includes(k)||k.startsWith('metal-')],['자개',k=>k.startsWith('pearl-')],['유리',k=>k.startsWith('glass-')||k==='bubble-sheet'],['표정',k=>k.startsWith('emoji-')||k.startsWith('mood-')||k.startsWith('extra-')||k==='smile']];
  let filter=categories[0][1];
  function applyFilter(){for(const b of grid.children)b.hidden=!filter(b.dataset.sticker);}
  for(const [label,predicate]of categories){const b=document.createElement('button');b.type='button';b.textContent=label;b.className=label==='전체'?'active':'';b.onclick=()=>{filter=predicate;for(const x of carousel.children)x.classList.toggle('active',x===b);applyFilter();};carousel.append(b);}
  grid.before(carousel);new MutationObserver(applyFilter).observe(grid,{childList:true});
  document.addEventListener('scroll',()=>{balloon.hidden=true;},true);
  window.addEventListener('resize',()=>{balloon.hidden=true;});
}
