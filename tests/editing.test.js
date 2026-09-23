import test from 'node:test';
import assert from 'node:assert/strict';
import {stickerLayer,layerBounds,hitLayer,validLayers} from '../editing.js';
test('회전한 비정방형 스티커의 실제 경계로 선택한다',()=>{const l=stickerLayer('heart',{x:.5,y:.5,size:.4,rotation:90});const img={width:200,height:100};assert.deepEqual(layerBounds(l,img,1000,1000),{x:500,y:500,w:400,h:200});assert.equal(hitLayer({x:500,y:680},l,img,1000,1000),true);assert.equal(hitLayer({x:680,y:500},l,img,1000,1000),false);});
test('동일 소재의 복제도 독립 ID와 위치를 갖는다',()=>{const a=stickerLayer('heart'),b=stickerLayer('heart');b.x=.1;assert.notEqual(a.id,b.id);assert.equal(a.x,.82);assert.ok(validLayers([a,b]));});
test('손상된 레이어와 중복 ID를 거부하고 화면 밖 배치는 허용한다',()=>{const a=stickerLayer('heart',{x:-.2,y:1.2});assert.ok(validLayers([a]));for(const value of [null,{},[a,a],[{...a,size:0}],[{...a,rotation:NaN}],[{...a,opacity:2}]])assert.equal(validLayers(value),false);});
test('JSON 왕복 후 레이어 변형과 쌓임 순서를 유지한다',()=>{const layers=[stickerLayer('glass',{rotation:45,flip:true,opacity:.4}),stickerLayer('bubble',{size:1.2})];const restored=JSON.parse(JSON.stringify(layers));assert.deepEqual(restored,layers);assert.ok(validLayers(restored));});
