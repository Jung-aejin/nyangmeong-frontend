# 냥멍케어 프론트엔드

반려동물 케어 웹서비스 냥멍케어의 프론트엔드. React 19 + Vite, JavaScript.

- 규칙: `AGENTS.md`, 나머지는 `docs/convention/`
- 아직 정하지 않은 것: `docs/OPEN_ISSUES.md`

## 처음 받았을 때

```mermaid
flowchart LR
  A[setup 실행] --> B[앱 다시 켜기] --> C[MCP 인증 한 번] --> D["/start"]
```

### setup

| OS | 실행 |
| --- | --- |
| Windows | `setup.bat` (cmd·PowerShell·탐색기 더블클릭) |
| 맥 | `bash setup.sh` |

- 여러 번 실행해도 된다.
- Windows에서 `bash setup.sh`를 치면 WSL이 떠서 안 된다.
- Codex를 쓰려면 Codex를 먼저 설치하고 setup을 실행한다.
- 끝나면 앱(VS Code·데스크탑 앱)을 다시 켠다. 새 PATH는 다시 켜야 잡힌다.

| setup이 하는 일 | 내용 |
| --- | --- |
| Git | 사용자 설정, 이니셜 브랜치, 훅(커밋의 `Co-Authored-By` 삭제, `yarn.lock`이 바뀌면 pull·브랜치 전환 뒤 `yarn install`) |
| AI 도구 | Claude Code·Codex 감지. 둘 다 없으면 Claude Code 설치 |
| VS Code 확장 | Prettier, ESLint, Claude Code |
| Node 24 · Yarn 1.22 | 없으면 설치, `yarn install` |
| `.env.local` | 없으면 `.env.example` 복사 |
| MCP | 아래 표 |
| 확인 | lint, build, dev 서버 |

### MCP

| MCP | 용도 |
| --- | --- |
| `dms` | 요구사항정의서·화면설계서·기능명세서 |
| `figma` | 디자인 |
| `playwright` | 화면 확인용 브라우저(창 없이 실행) |

- claude.ai 커넥터로 이미 연결돼 있으면 Claude Code에는 등록하지 않는다.
- 그 경우 `.env.local`의 `DMS_MCP_URL`은 비워도 된다. 아니면 디스코드에서 받는다.
- 인증: `/mcp` → 서버 선택 → Authenticate
- 데스크탑 앱은 Connectors 화면에서 인증한다(확인 필요).
- Codex는 등록할 때 로그인 창이 뜬다. 놓쳤으면 `codex mcp login <이름>`.

### 직접 실행

```
yarn dev
```

`/api` 요청은 `http://localhost:8080`(백엔드)으로 넘어간다.

## AI로 작업하기

```mermaid
flowchart LR
  subgraph tools[도구]
    A[데스크탑 앱]
    B[VS Code 확장]
    C[터미널 claude]
  end
  tools --> SK[".claude/skills<br/>/start · /verify · /done"]
  SK --> HO["handoff/이니셜.md<br/>기획 · 진행 상황"]
  SK --> MS["milestones/이니셜.md<br/>화면 ID별 할 일"]
  SK --> MCP["MCP<br/>dms · figma · playwright"]
```

| 도구 | 시작 |
| --- | --- |
| 데스크탑 앱 | [다운로드](https://claude.com/download) → Code 탭 → New session → Local, 이 폴더 |
| VS Code 확장 | 이 폴더 열기 → 왼쪽 막대의 Claude 아이콘 |
| 터미널 | 이 폴더에서 `claude` |

셋 다 같은 스킬과 MCP를 쓴다.

### 작업 흐름

```mermaid
flowchart TD
  S["/start<br/>작업 고르기 · 기획 (Opus)"] --> P{기획 확인}
  P -- 고칠 점 --> S
  P -- 승인 --> I["구현 (Sonnet)<br/>lint · build"]
  I --> V["/verify<br/>별도 에이전트가 판정 (Opus)"]
  V -- 실패 --> I
  V -- 통과 --> H["사람 확인<br/>직접 띄워서 확인"]
  H -- 문제 --> I
  H -- 확인 --> D["/done<br/>마일스톤 끝 · 커밋 제안"]
  D --> N["새 대화 → /start"]
```

| 할 일 | 입력 |
| --- | --- |
| 다음 작업 시작 | `/start` |
| 특정 화면 시작 | `/start COM-003` |
| 기획 승인 | `승인` |
| 검증 | `/verify` |
| 마무리 | `/done` → `확인` → `커밋` → `푸시` → (마일스톤이 끝나면) `PR`. 병합은 GitHub에서 사람이 |
| 새 대화 | 터미널·VS Code `/clear`, 데스크탑 앱 Ctrl+N |

- 마일스톤 파일이 없으면 첫 `/start`가 먼저 만든다. 시간이 더 걸린다.
- 모델은 바꾸지 않는다. 기본은 Sonnet, `/start`·`/verify`만 Opus로 돈다.
- 스킬이 `/` 목록에 없으면 새 대화를 연다.
- VS Code의 `/clear`는 확인 필요. 안 되면 명령 팔레트의 Open in New Tab.

### 사람 확인

`/verify`가 끝에 주는 "사람 확인" 목록대로 확인한다.

1. 백엔드가 필요하면 백엔드 저장소에서 `./gradlew bootRun`
2. `/verify`가 띄워 둔 dev 서버가 있으면 그대로 쓴다. 없으면 이 저장소에서 `yarn dev` → `http://localhost:5173`
3. 목록의 주소에서 동작해 보고 기대 결과와 비교한다.
4. 아직 없는 남의 API는 가짜 응답으로 보인다.
5. 목록의 "바뀐 파일"을 훑어본다. 기획에 없는 파일이면 문제로 답한다.
6. Ctrl+C로 끈다.

## PR 전 확인

```
yarn lint
yarn build
```
