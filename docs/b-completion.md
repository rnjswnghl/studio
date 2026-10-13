# B 완료 기록

## 결과와 버전

검색·격자(A 구현)를 유지하면서 스티커 잠금과 반복 스티커·텍스트 번호를 완료했다. 모바일 소재 탭 접근 및 상태 속성 충돌도 해결했다. 기능 요구 누락: 없음. 원격 push와 배포는 수행하지 않았다.

- B 시작: `3d57de3991fcc1d2b6b70d229608972ea6c9ccde` (인수인계와 일치).
- 중단·재개 소스: `082d93096c09c3d635d99b16954ae2464a615a65`, `t05-b-interrupted`.
- 최종 검증한 실행 코드는 이 중단 소스와 동일하다. 재개 시 문서·증거를 완결했다. 이 문서를 포함하는 완료 커밋은 `git log -1`로 확인한다.
- 인수인계 원문과 `docs/handoff.md`의 SHA-256 모두 `4CBA43341C2EC034493D49583E5B666DD048990E2B889D1143795C37E4099795`.
- 고정 검사 blob: `04a0f8b8879b2240ffd73730f4a7b4291c3c3b83`; 헬퍼 blob: `ad208029f9f28ba09f6c9c3f85357c81cd810d06`. ID·입력·기대값·검사 코드 변경 없음.

## 실제 검증

| 실행 | 결과 | 증거 |
|---|---|---|
| A 새 폴더 재현 | 4/10 | [a-fresh-reproduction.json](evidence/a-fresh-reproduction.json) |
| B 1회차 | 9/10, 모바일 탭 접근 실패 | [b-round-1.json](evidence/b-round-1.json) |
| B 2회차 | 9/10, 모바일 선택자 중복 | [b-round-2.json](evidence/b-round-2.json) |
| B 3회차 | 10/10 | [b-round-3.json](evidence/b-round-3.json) |
| B 재개 최종 | 10/10, 런타임 예외 없음 | [b-final.json](evidence/b-final.json) |
| 기존 Node + 추가 메타데이터 | 14/14 + 3/3 | 재개 시 명령 실행 성공 |
| 기존 UI / 다중 텍스트 / 배치 브라우저 | 모두 통과 | 첫 구간에서 전체 실행, 재개 후 UI 재확인 |
| 추가 브라우저 | 3/3 | [b-supplemental.json](evidence/b-supplemental.json) |
| 정적 빌드 | 성공 | 재개 시 `node scripts/build.mjs` |

3회차는 첫 turn에서 시작한 도구가 사용량 제한 중단 뒤에도 완료하여 파일을 남겼다. 중단 문서의 ‘2회차까지 9/10’은 당시 관측 기록으로 변경 없이 보존하며, 재개 후 발견한 3회차와 새 최종 실행을 추가했다. FAIL이 포함된 회차는 총 **2회**다.

## 시간과 요청 측정

사용자 작업 요청 **2/10회**. 공통 시간 상한 **45분**. 첫 구간은 앱의 실제 durationMs **590690ms**를 사용한다. 최초 임시 시작 기록보다 앱 실측을 우선한다. 재개 구간은 첫 저장소 확인 명령의 실제 시각부터 완료 기록 시각까지 측정하며, 합산값·비활성 대기 구간은 [b-session.json](evidence/b-session.json)에 있다. 도구 호출 수는 미측정. 사용량 제한 대기는 합산에서 제외하고 추정값을 실제 작업시간으로 쓰지 않는다.

## 짧은 재현 방법

저장소 루트에서 다음을 실행한다. 추가 브라우저 검사는 로컬 서버가 필요하며, 고정 검사는 서버를 자동으로 열고 종료한다.

```powershell
node --test tests/core.test.js tests/editing.test.js tests/text.test.js tests/identity.test.js
node scripts/build.mjs
$env:T05_STAGE = 'verify'
node scripts/qa-t05.cjs
```

UI에서는 같은 하트를 여러 개 추가해 번호를 확인하고 레이어 잠금을 켠 뒤 캔버스 드래그·방향키를 시도한다. 잠금을 해제하면 이동할 수 있다. 저장 탭에서 이름을 검색하고 격자를 켠 상태로 출력하면 가이드가 출력되지 않는다.

구현 판단: ID에 번호를 저장하고 모든 변경 경로에 잠금 검사를 둔 설계는 기존 백업 구조를 활용하면서 요구 동작을 충족했다. A/B는 순차 작업으로 범위가 다르므로 결과로 일반적인 도구 우열을 판단할 수 없다.
