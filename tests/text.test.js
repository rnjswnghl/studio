import test from 'node:test';
import assert from 'node:assert/strict';
import {textLayer,migrateTexts,validTexts,TEXT_FONTS} from '../text.js';
test('기존 문구의 위치·회전·색·크기를 독립 텍스트로 보존한다',()=>{
 const t=migrateTexts({caption:'기존 문구',textColor:'#123456',fontSize:80,textPosition:'top',captionRotation:35})[0];
 assert.deepEqual([t.caption,t.textColor,t.fontSize,t.captionX,t.captionY,t.captionRotation,t.fontFamily],['기존 문구','#123456',80,.5,.1,35,'Gaegu']);
 assert.ok(validTexts([t]));assert.deepEqual(migrateTexts({caption:''}),[]);
});
test('텍스트 배열은 빈 배열까지 우선하며 독립 복사한다',()=>{
 const texts=[textLayer(),textLayer({fontFamily:'Nanum Pen Script'})];
 const copy=migrateTexts({texts,caption:'중복 금지'});copy[0].caption='변경';assert.notEqual(texts[0].caption,copy[0].caption);
 assert.notEqual(texts[0].id,texts[1].id);assert.deepEqual(migrateTexts({texts:[],caption:'옛 문구'}),[]);
});
test('손상된 텍스트 백업과 중복 ID·임의 폰트를 거부한다',()=>{
 const t=textLayer();assert.ok(validTexts(TEXT_FONTS.map(([fontFamily])=>textLayer({fontFamily}))));
 for(const bad of [{fontSize:0},{captionX:NaN},{captionRotation:Infinity},{fontFamily:'injected'},{textColor:'red'},{caption:'가'.repeat(121)},{id:'frame'}])assert.equal(validTexts([{...t,...bad}]),false);
 assert.equal(validTexts([t,t]),false);assert.equal(validTexts(null),false);
});
