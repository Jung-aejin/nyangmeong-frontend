# 냥멍케어 프론트엔드

반려동물 케어 웹서비스 냥멍케어의 프론트엔드. React 19 + Vite, JavaScript.

코드를 쓰기 전에 `AGENTS.md`를 읽는다. 나머지 규칙은 `docs/convention/`에 있다. 아직 정하지 않은 것은 `docs/OPEN_ISSUES.md`에 있다.

## 실행

처음 받으면 맥은 터미널에서 `bash setup.sh`, Windows는 cmd에서 `setup.bat`, PowerShell에서 `.\setup.bat`(탐색기에서 더블클릭해도 된다)로 필요한 도구를 설치한다. PowerShell·cmd에서 `bash setup.sh`를 치면 Git Bash가 아니라 WSL이 실행되므로 `setup.bat`를 쓴다. 여러 번 실행해도 된다.

Codex를 쓰면 Codex CLI를 먼저 설치하고 setup을 실행한다. setup은 Claude Code와 Codex 중 설치된 것을 감지하고, 둘 다 없으면 Claude Code를 설치한다.

setup은 감지한 AI 도구에 MCP 세 개를 사용자 범위로 등록한다. Claude Code에 이름이나 주소가 같은 claude.ai 커넥터(예: `claude.ai dms`)가 이미 연결돼 있으면 Claude Code에는 등록하지 않는다.

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

## PR 전 확인

```
yarn lint
yarn build
```
