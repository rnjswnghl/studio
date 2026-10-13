import test from 'node:test';
import assert from 'node:assert/strict';
import {stickerLayer, validLayers, ensureNumbers, nextNumber} from '../editing.js';
import {textLayer, validTexts} from '../text.js';

test('legacy migration reserves numbered survivors regardless of array order', () => {
  const old=stickerLayer('a'), survivor=stickerLayer('b',{number:4});
  const items=[old,survivor];
  const name=()=> 'heart.png';
  ensureNumbers(items,name);
  assert.deepEqual(items.map(x=>x.number),[5,4]);
  items.reverse();ensureNumbers(items,name);
  assert.equal(old.number,5);assert.equal(survivor.number,4);
  assert.equal(nextNumber(items,'heart.png',name),6);
  assert.deepEqual(JSON.parse(JSON.stringify(items)),items);
});

test('optional metadata accepts legacy backups and rejects corrupt types', () => {
  const layer=stickerLayer('heart');delete layer.locked;
  assert.ok(validLayers([layer]));
  for(const locked of ['yes',1,null])assert.equal(validLayers([{...layer,locked}]),false);
  for(const number of [0,-1,1.5,'1',null,Infinity]) {
    assert.equal(validLayers([{...layer,number}]),false);
    assert.equal(validTexts([textLayer({number})]),false);
  }
  assert.ok(validLayers([{...layer,locked:true,number:7}]));
  assert.ok(validTexts([textLayer({number:7})]));
});

test('duplicate legacy numbers are repaired once without renumbering survivors', () => {
  const items=[textLayer({caption:'안녕',number:3}),textLayer({caption:'안녕',number:3}),textLayer({caption:'다른 말'})];
  ensureNumbers(items,t=>t.caption);
  assert.deepEqual(items.map(t=>t.number),[3,4,1]);
  ensureNumbers(items,t=>t.caption);
  assert.deepEqual(items.map(t=>t.number),[3,4,1]);
});
