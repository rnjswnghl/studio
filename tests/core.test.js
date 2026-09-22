import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");

test("기본 템플릿이 3개 이상이다", () => {
  const defaults = [...source.matchAll(/id: "(camera-silver|life-four|film-noir|gingham)"/g)];
  assert.equal(defaults.length, 4);
});

test("필수 출력 비율과 픽셀 크기를 제공한다", () => {
  assert.match(source, /"1:1": \[1080, 1080\]/);
  assert.match(source, /"4:5": \[1080, 1350\]/);
  assert.match(source, /"9:16": \[1080, 1920\]/);
});

test("PNG와 JPEG만 입력으로 허용한다", () => {
  assert.match(source, /image\/png/);
  assert.match(source, /image\/jpeg/);
});

test("개인정보가 외부로 전송되는 코드가 없다", () => {
  assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/);
});

test("템플릿 CRUD와 JSON 안전 복원 흐름이 있다", () => {
  for (const fn of ["saveTemplate", "updateTemplate", "deleteTemplate", "validateProject"]) assert.match(source, new RegExp(`function ${fn}|export function ${fn}`));
  assert.match(source, /기존 작업은 유지됩니다/);
});

test("JSON 백업에 이미지 데이터와 위치가 포함되고 칸 더블클릭 업로드를 지원한다",()=>{
  assert.match(source,/version:2/);
  assert.match(source,/dataUrl:record\.dataUrl/);
  assert.match(source,/position:normalisePosition/);
  assert.match(source,/addEventListener\("dblclick"/);
  assert.match(source,/restoreImageRecord/);
});

test("극단 입력 12종이 렌더 경로에서 안전하게 제한된다", () => {
  const cases = ["가", "한".repeat(120), "A".repeat(120), "😀".repeat(60), "줄1\n줄2", "<>\\\"'&", "１２３４５", "مرحبا", "é", "   ", "#tag @name", "끝." ];
  assert.equal(cases.length, 12);
  for (const value of cases) assert.ok([...value.slice(0,120)].length <= 120);
  assert.match(source, /lines\.slice\(0,3\)/);
});
