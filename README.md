# 냥멍케어 프론트엔드

반려동물 케어 웹서비스 냥멍케어의 프론트엔드. React 19 + Vite, JavaScript.

코드를 쓰기 전에 `AGENTS.md`를 읽는다. 나머지 규칙은 `docs/convention/`에 있다. 아직 정하지 않은 것은 `docs/OPEN_ISSUES.md`에 있다.

## 실행

처음 받으면 맥은 터미널에서 `bash setup.sh`, Windows는 cmd에서 `setup.bat`, PowerShell에서 `.\setup.bat`(탐색기에서 더블클릭해도 된다)로 필요한 도구를 설치한다. PowerShell·cmd에서 `bash setup.sh`를 치면 Git Bash가 아니라 WSL이 실행되므로 `setup.bat`를 쓴다. 여러 번 실행해도 된다.

Codex를 쓰면 Codex CLI를 먼저 설치하고 setup을 실행한다. setup은 Claude Code와 Codex 중 설치된 것을 감지하고, 둘 다 없으면 Claude Code를 설치한다.

setup은 감지한 AI 도구에 MCP 세 개를 사용자 범위로 등록한다. Claude Code에 이름이나 주소가 같은 claude.ai 커넥터(예: `claude.ai dms`)가 이미 연결돼 있으면 Claude Code에는 등록하지 않는다. 감지한 도구 모두에 `dms`가 이미 있으면 `DMS_MCP_URL`은 비워 둬도 된다.

| MCP | 용도 | 주소 |
| --- | --- | --- |
| `dms` | 요구사항정의서·화면설계서·기능명세서 | `.env.local`의 `DMS_MCP_URL`(디스코드로 받는다) |
| `figma` | 디자인 | `https://mcp.figma.com/mcp` |
| `playwright` | 화면 완료 조건 확인용 브라우저(창 없이 실행) | `npx @playwright/mcp@latest --headless` |

인증은 처음 한 번 브라우저에서 한다. Claude Code는 `claude`를 실행해 `/mcp`에서 서버를 고르고 Authenticate, Codex는 등록할 때 로그인 창이 열린다(놓쳤으면 `codex mcp login <이름>`).

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

claude.ai 계정으로 로그인하면 claude.ai에서 연결한 커넥터(`claude.ai dms`, `claude.ai Figma`)는 따로 인증하지 않아도 된다. setup이 등록한 서버 중 인증이 필요한 것은 터미널·VS Code에서 `/mcp`를 입력해 서버를 고르고 Authenticate 한다. 데스크탑 앱은 Connectors 화면에서 한다(확인 필요).

### 작업 흐름

1. `/start` — 할 작업을 고르고 기획을 핸드오프에 쓴 뒤 멈춘다. 특정 마일스톤은 `/start M3`.
   - 마일스톤 파일이 없으면 `마일스톤 만들어줘`라고 요청해 만든 뒤 새 대화에서 `/start`.
2. 기획을 확인한다. 고칠 점은 답하고, 그대로 가려면 모델을 Sonnet으로 바꾼 뒤 `승인`이라고 답한다. 구현은 기획에 적은 파일만 고친다.
3. 검증 명령이 통과했다고 안내하면 `/verify` — 구현한 대화를 보지 않는 별도 에이전트(Opus)가 저장소만 보고 판정한다.
4. 판정이 통과면 `/done` — 핸드오프와 마일스톤 상태를 갱신한다. 실패면 고친 뒤 다시 `/verify`.
5. 새 대화를 열고 다음 작업을 `/start`로 시작한다. 이전 대화를 이어 쓰면 그만큼 토큰을 계속 쓴다.

도구마다 다른 조작:

| | 모델 바꾸기 | 새 대화(`/clear`) |
| --- | --- | --- |
| 데스크탑 앱 | 보내기 버튼 옆 모델 선택 | + New session(Ctrl+N) |
| VS Code 확장 | `/model` 또는 입력창 아래 모델 이름 | `/clear` (확인 필요. 안 되면 명령 팔레트의 Open in New Tab) |
| 터미널 | `/model sonnet` | `/clear` |

`/start`는 기획하는 동안만 Opus로 돌고, 다음 입력부터는 원래 모델로 돌아간다. VS Code 확장은 터미널보다 쓸 수 있는 명령이 적다. 스킬이 `/` 목록에 없으면 새 대화를 연다.

## PR 전 확인

```
yarn lint
yarn build
```
