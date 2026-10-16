# 냥멍케어 프론트엔드

반려동물 케어 웹서비스 냥멍케어의 프론트엔드. React 19 + Vite, JavaScript.

코드를 쓰기 전에 `AGENTS.md`를 읽는다. 나머지 규칙은 `docs/convention/`에 있다. 아직 정하지 않은 것은 `docs/OPEN_ISSUES.md`에 있다.

## 실행

처음 받으면 setup을 실행한다. 여러 번 실행해도 된다.

| OS | 실행 |
| --- | --- |
| Windows | cmd `setup.bat`, PowerShell `.\setup.bat`, 또는 탐색기에서 더블클릭. `bash setup.sh`는 WSL이 실행되므로 쓰지 않는다 |
| 맥 | 터미널에서 `bash setup.sh` |

setup이 하는 일:

| 항목 | 내용 |
| --- | --- |
| Git | 이 저장소의 git 사용자 설정, 커밋 훅(`Co-Authored-By` 줄 삭제), 이니셜 브랜치 만들기·올리기 |
| AI 도구 | Claude Code·Codex 중 설치된 것을 감지. 둘 다 없으면 Claude Code 설치(Codex를 쓰려면 먼저 설치) |
| VS Code 확장 | Prettier, ESLint, Claude Code |
| Node 24 · Yarn 1.22 | 없으면 fnm·corepack으로 설치. `yarn install` |
| `.env.local` | 없으면 `.env.example`을 복사 |
| MCP | 아래 표. 같은 claude.ai 커넥터가 이미 있으면 Claude Code에는 등록하지 않는다 |
| 확인 | lint, build, dev 서버 기동 후 종료 |

| MCP | 용도 | 주소 |
| --- | --- | --- |
| `dms` | 요구사항정의서·화면설계서·기능명세서 | `.env.local`의 `DMS_MCP_URL`(디스코드로 받는다) |
| `figma` | 디자인 | `https://mcp.figma.com/mcp` |
| `playwright` | 화면 완료 조건 확인용 브라우저(창 없이 실행) | `npx @playwright/mcp@latest --headless` |

감지한 도구 모두에 `dms`가 이미 있으면 `DMS_MCP_URL`은 비워 둬도 된다. 인증은 아래 "처음 한 번: MCP 인증"을 따른다.

Node 24와 Yarn 1.22가 필요하다.

```
yarn install
yarn dev
```

`/api` 요청은 `http://localhost:8080`(백엔드)으로 넘어간다.

## AI 도구로 작업하기

setup을 먼저 실행한다. 아래 세 가지 중 편한 것을 쓴다. 셋 다 같은 설정(`~/.claude`의 MCP, 이 저장소의 `.claude/skills`)을 쓰므로 `/start`·`/verify`·`/done`이 똑같이 동작한다.

| | 설치 | 이 저장소에서 시작 |
| --- | --- | --- |
| 데스크탑 앱 | https://claude.com/download | 로그인 → Code 탭 → + New session(Ctrl+N) → 환경 Local, 이 저장소 폴더 선택 |
| VS Code 확장 | 확장 `anthropic.claude-code`(Anthropic의 Claude Code). VS Code 설치 시 setup이 설치한다 | 이 저장소 폴더를 열고 왼쪽 막대의 Claude 아이콘 또는 상태 표시줄의 ✻ Claude Code |
| 터미널 | setup이 설치한다 | 이 저장소 폴더에서 `claude` |

setup을 실행한 뒤에는 앱을 다시 켠다. 새로 설치한 프로그램과 PATH는 다시 켜야 잡힌다.

### 처음 한 번: MCP 인증

claude.ai 계정으로 로그인하면 claude.ai에서 연결한 커넥터(`claude.ai dms`, `claude.ai Figma`)는 따로 인증하지 않아도 된다. setup이 등록한 서버 중 인증이 필요한 것은 터미널·VS Code에서 `/mcp`를 입력해 서버를 고르고 Authenticate 한다. 데스크탑 앱은 Connectors 화면에서 한다(확인 필요). Codex는 setup이 등록할 때 로그인 창이 열린다(놓쳤으면 `codex mcp login <이름>`).

### 작업 흐름

1. `/start` — 할 작업을 고르고 기획을 핸드오프에 쓴 뒤 멈춘다. 특정 마일스톤은 화면 ID로 `/start COM-003`.
   - 마일스톤 파일(`milestones/<이니셜>.md`)이 없으면 DMS 기능명세서로 먼저 만들고 이어서 기획한다. 이때는 시간이 더 걸린다.
2. 기획을 확인한다. 고칠 점은 답하고, 그대로 가려면 `승인`이라고 답한다. 구현은 기획에 적은 파일만 고친다.
3. 검증 명령이 통과했다고 안내하면 `/verify` — 구현한 대화를 보지 않는 별도 에이전트(Opus)가 저장소만 보고 판정하고, 끝에 "사람 확인" 목록(띄우는 명령, 열어 볼 곳, 할 동작, 기대 결과)을 준다. 실패면 고친 뒤 다시 `/verify`.
4. 사람이 확인한다 — 아래 "사람 확인" 방법으로 직접 띄워서 목록대로 해 본다.
5. `/done` — 사람 확인을 했는지 묻는다. `확인`이라고 답하면 마일스톤을 끝내고 커밋 메시지를 제안한다(`커밋`이라고 답하면 커밋). 문제를 답하면 끝내지 않고 핸드오프에 남긴다.
6. 새 대화를 열고 다음 작업을 `/start`로 시작한다. 이전 대화를 이어 쓰면 그만큼 토큰을 계속 쓴다.

새 대화는 터미널에서 `/clear`, 데스크탑 앱에서 + New session(Ctrl+N), VS Code 확장에서 `/clear`(확인 필요. 안 되면 명령 팔레트의 Open in New Tab)로 연다.

모델은 바꾸지 않는다. 프로젝트 기본 모델이 Sonnet(`.claude/settings.json`)이고, `/start`·`/verify`만 그동안 Opus로 돈다. 세션에서 모델을 직접 바꿨다면 Sonnet으로 되돌린다. VS Code 확장은 터미널보다 쓸 수 있는 명령이 적다. 스킬이 `/` 목록에 없으면 새 대화를 연다.

### 사람 확인

`/verify`의 "사람 확인" 목록을 이 방법으로 확인한다.

1. 백엔드가 필요한 화면이면 백엔드 저장소에서 `./gradlew bootRun`을 먼저 띄운다. `/api` 요청은 `http://localhost:8080`으로 넘어간다.
2. 이 저장소에서 `yarn dev`를 실행하고, 터미널에 나온 주소(기본 `http://localhost:5173`)를 브라우저로 연다.
3. 목록의 주소로 가서 적힌 동작을 해 보고 기대 결과와 같은지 본다. 아직 없는 남의 API는 가짜 응답으로 보인다.
4. 목록의 "바뀐 파일"을 VS Code에서 훑어본다. 기획에 없는 파일이 바뀌었으면 문제로 답한다.
5. 끝나면 터미널에서 Ctrl+C로 끈다.

## PR 전 확인

```
yarn lint
yarn build
```
