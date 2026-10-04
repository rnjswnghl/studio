export function setupQuickEdit({canvas,wrap,getTarget,checkpoint,change,finish,remove}){
 const outline=document.createElement('div');outline.className='quick-outline';outline.hidden=true;wrap.append(outline);
 const toolbar=document.createElement('div');toolbar.className='quick-toolbar';toolbar.setAttribute('role','toolbar');toolbar.setAttribute('aria-label','선택 항목 편집');toolbar.hidden=true;wrap.append(toolbar);
 const paths={rotate:'M12 4a6 6 0 1 0 6 6M12 4h6m0 0v6',scale:'M4 9V4h5M4 4l6 6m10 5v5h-5m5 0-6-6',flip:'M12 3v18M8 7l-5 5 5 5V7zm8 0 5 5-5 5V7z',delete:'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7'};
 function button(action,label,parent){const b=document.createElement('button');b.type='button';b.className='quick-button';b.dataset.quick=action;b.title=label;b.setAttribute('aria-label',label);b.innerHTML=`<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="${paths[action]}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;parent.append(b);return b;}
 const rotate=button('rotate','드래그하여 회전 · 클릭하면 90° 회전',wrap),scale=button('scale','드래그하여 크기 조절',wrap);rotate.classList.add('quick-handle');scale.classList.add('quick-handle');rotate.hidden=scale.hidden=true;
 const flip=button('flip','좌우 반전',toolbar),del=button('delete','선택 항목 삭제',toolbar);
 flip.onclick=()=>{const t=getTarget();if(!t)return;checkpoint();t.item.flip=!t.item.flip;change();finish();};del.onclick=remove;
 const normal=v=>((v+180)%360+360)%360-180;
 for(const [b,action]of [[rotate,'rotate'],[scale,'scale']]){
  let drag;
  b.onpointerdown=e=>{const t=getTarget();if(!t)return;e.preventDefault();e.stopPropagation();checkpoint();const c=canvas.getBoundingClientRect(),r=t.bounds;drag={target:t,cx:c.left+r.x*c.width/canvas.width,cy:c.top+r.y*c.height/canvas.height,x:e.clientX,y:e.clientY,rotation:t.kind==='photo'?t.item.rotate??0:t.item.rotation,size:t.kind==='photo'?t.item.zoom??1:t.item.size,moved:false};drag.angle=Math.atan2(e.clientY-drag.cy,e.clientX-drag.cx);drag.distance=Math.hypot(e.clientX-drag.cx,e.clientY-drag.cy);b.setPointerCapture(e.pointerId);};
  b.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag.cx,dy=e.clientY-drag.cy;drag.moved ||= Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>3;if(!drag.moved)return;const t=drag.target;if(action==='rotate')t.item[t.kind==='photo'?'rotate':'rotation']=normal(drag.rotation+(Math.atan2(dy,dx)-drag.angle)*180/Math.PI);else t.item[t.kind==='photo'?'zoom':'size']=Math.min(t.kind==='photo'?4:3,Math.max(t.kind==='photo'?.5:.01,drag.size*Math.hypot(dx,dy)/Math.max(1,drag.distance)));change();};
  const end=()=>{if(!drag)return;if(action==='rotate'&&!drag.moved){const t=drag.target;t.item[t.kind==='photo'?'rotate':'rotation']=normal(drag.rotation+90);change();}drag=null;finish();};b.onpointerup=end;b.onpointercancel=()=>{drag=null;finish();};
 }
 let raf;
 function update(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const t=getTarget();for(const el of [outline,toolbar,rotate,scale])el.hidden=!t;if(!t)return;const cr=canvas.getBoundingClientRect(),wr=wrap.getBoundingClientRect(),sx=cr.width/canvas.width,sy=cr.height/canvas.height,r=t.bounds,cx=cr.left-wr.left+r.x*sx,cy=cr.top-wr.top+r.y*sy,a=(r.angle??0)*Math.PI/180,w=r.w*sx,h=r.h*sy;
 Object.assign(outline.style,{left:cx-w/2+'px',top:cy-h/2+'px',width:w+'px',height:h+'px',transform:`rotate(${r.angle??0}deg)`});
 const position=(b,x,y)=>{b.style.left=Math.max(17,Math.min(wrap.clientWidth-17,cx+x*Math.cos(a)-y*Math.sin(a)))+'px';b.style.top=Math.max(17,Math.min(wrap.clientHeight-17,cy+x*Math.sin(a)+y*Math.cos(a)))+'px';};position(rotate,0,-h/2-22);position(scale,w/2,h/2);
 const bw=Math.abs(w*Math.cos(a))+Math.abs(h*Math.sin(a)),bh=Math.abs(w*Math.sin(a))+Math.abs(h*Math.cos(a));toolbar.style.left=Math.max(4,Math.min(wrap.clientWidth-76,cx-bw/2))+'px';const below=cy+bh/2+22;toolbar.style.top=Math.max(4,Math.min(wrap.clientHeight-42,below+42<wrap.clientHeight?below:cy-bh/2-48))+'px';toolbar.dataset.kind=t.kind;
 });}
 new ResizeObserver(update).observe(wrap);return {update};
}
