#!/usr/bin/env bash
# 냥멍케어 프론트엔드 개발 환경 설치. 맥은 터미널에서 `bash setup.sh`, Windows는 cmd·PowerShell에서 `setup.bat`(또는 Git Bash에서 `bash setup.sh`)로 실행한다.
# 이미 맞는 버전이 있으면 건너뛴다. 여러 번 실행해도 된다.
# 백엔드 저장소의 setup.sh와 공통 부분(맨 위 함수와 "공통" 절)이 같다. 고칠 때 둘 다 고친다.
set -euo pipefail
cd "$(dirname "$0")"

TODO=0
NEED_RESTART=0
ok()   { printf '  [완료] %s\n' "$1"; }
skip() { printf '  [있음] %s\n' "$1"; }
todo() { printf '  [직접] %s\n' "$1"; TODO=$((TODO + 1)); }
die()  { printf '\n[중단] %s\n' "$1" >&2; exit 1; }
step() { printf '\n== %s\n' "$1"; }

case "$(uname -s)" in
  Darwin) OS=mac ;;
  MINGW* | MSYS*) OS=win ;;
  *) die "지원하지 않는 환경입니다: $(uname -s). 맥은 터미널에서 bash setup.sh, Windows는 setup.bat로 실행해 주세요." ;;
esac

# 패키지 설치. 맥은 Homebrew, Windows는 winget
# pkg <brew 이름> <formula|cask> <winget ID> [winget 버전]
pkg() {
  if [ "$OS" = mac ]; then
    command -v brew >/dev/null || die "Homebrew가 없습니다. https://brew.sh 의 설치 명령을 먼저 실행해 주세요."
    if [ "$2" = cask ]; then brew install --cask "$1"; else brew install "$1"; fi
  else
    command -v winget.exe >/dev/null || die "winget이 없습니다. Microsoft Store에서 '앱 설치 관리자'를 설치해 주세요."
    if [ -n "${4:-}" ]; then
      winget.exe install --id "$3" -e --version "$4" --accept-package-agreements --accept-source-agreements
    else
      winget.exe install --id "$3" -e --accept-package-agreements --accept-source-agreements
    fi
    # winget이 바꾼 PATH는 새 창에서만 적용된다
    NEED_RESTART=1
  fi
}

# 셸 설정 파일에 한 줄을 넣는다. 이미 있으면 그대로 둔다
persist_line() {
  mkdir -p "$(dirname "$1")"
  touch "$1"
  grep -qxF "$2" "$1" || printf '\n%s\n' "$2" >> "$1"
}

# 새 창에서도 이 폴더의 명령이 잡히도록 PATH에 영구로 넣는다. 맥은 ~/.zshrc, Windows는 사용자 PATH
persist_path() {
  if [ "$OS" = mac ]; then
    persist_line "$HOME/.zshrc" "export PATH=\"$1:\$PATH\""
    return
  fi
  # %USERPROFILE% 같은 항목이 풀리지 않도록 레지스트리 값을 ExpandString으로 그대로 다시 쓴다.
  # 이미 있는지는 양쪽 값을 풀고 끝의 역슬래시와 대소문자를 무시해 비교한다(%USERPROFILE% 형태로 들어 있어도 같은 폴더로 본다)
  # 마지막 줄은 열려 있는 탐색기에 환경변수 변경을 알리려고 빈 변수를 지우는 것이다
  WIN_DIR="$(cygpath -w "$1")" powershell.exe -NoProfile -Command '
    $key = [Microsoft.Win32.Registry]::CurrentUser.OpenSubKey("Environment", $true)
    $parts = @(([string]$key.GetValue("Path", "", "DoNotExpandEnvironmentNames")) -split ";" | Where-Object { $_ })
    $norm = { param($p) [Environment]::ExpandEnvironmentVariables($p).TrimEnd("\").ToLowerInvariant() }
    $want = & $norm $env:WIN_DIR
    if (-not ($parts | Where-Object { (& $norm $_) -eq $want })) {
      $key.SetValue("Path", (($parts + $env:WIN_DIR) -join ";"), [Microsoft.Win32.RegistryValueKind]::ExpandString)
      [Environment]::SetEnvironmentVariable("NYANGMEONG_SETUP", $null, "User")
    }'
}

# VS Code 명령줄 도구 위치. 맥은 PATH에 없으면 앱 안의 것을 쓴다
vscode_cli() {
  if command -v code >/dev/null; then command -v code; return; fi
  if [ "$OS" = mac ]; then
    local app
    app=$(mdfind "kMDItemCFBundleIdentifier == 'com.microsoft.VSCode'" 2>/dev/null | head -1)
    [ -n "$app" ] && [ -x "$app/Contents/Resources/app/bin/code" ] && echo "$app/Contents/Resources/app/bin/code"
  fi
  return 0
}

# .vscode/extensions.json의 확장을 설치한다. VS Code가 없으면 직접 할 일로 남긴다
vscode_extensions() {
  local code installed ext
  code=$(vscode_cli)
  if [ -z "$code" ]; then
    todo "VS Code를 설치한 뒤 다시 실행해 주세요(확장 설치를 위해)."
    return 0
  fi
  installed=$("$code" --list-extensions | tr '[:upper:]' '[:lower:]')
  for ext in $(grep -o '"[^"]*\.[^"]*"' .vscode/extensions.json | tr -d '"'); do
    if printf '%s\n' "$installed" | grep -qx "$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"; then
      skip "VS Code 확장 $ext"
    else
      "$code" --install-extension "$ext" >/dev/null && ok "VS Code 확장 $ext"
    fi
  done
}

# MCP 서버를 감지한 AI 도구에 사용자 범위로 등록한다. 원격 서버의 인증은 OAuth라 브라우저에서 한다
# mcp_add <이름> <URL>              원격(HTTP) 서버
# mcp_add <이름> -- <명령> [인자...]  이 PC에서 띄우는(stdio) 서버
# claude.ai에서 연결한 커넥터(claude.ai <이름>) 중 이름(대소문자 무시)이나 주소가 같은 줄을 출력한다. 커넥터는 claude mcp get 으로 찾을 수 없다
# claude_connector <이름> [URL]. $(...) 안에서 부르므로 목록은 그 전에 claude_ai_list_load 로 읽어 둔다
claude_connector() {
  claude_ai_list_load
  printf '%s\n' "$claude_ai_list" | grep -i -m1 "^claude\.ai $1:" && return 0
  [ -n "${2:-}" ] && printf '%s\n' "$claude_ai_list" | grep -F -m1 ": $2 " && return 0
  return 0
}
# claude mcp list 는 서버마다 연결을 확인해 느리므로 한 번만 읽는다
claude_ai_list_load() {
  [ -n "${claude_ai_list+x}" ] || claude_ai_list=$(claude mcp list 2>/dev/null | grep '^claude\.ai ' || true)
}

mcp_add() {
  local name=$1 connector=""
  shift
  if use_claude; then
    # 같은 커넥터가 이미 연결돼 있으면 다시 등록하지 않는다
    claude_ai_list_load
    if [ "$1" = -- ]; then connector=$(claude_connector "$name"); else connector=$(claude_connector "$name" "$1"); fi
    if [ -n "$connector" ]; then
      skip "Claude Code MCP $name (${connector%%:*} 커넥터)"
    elif claude mcp get "$name" >/dev/null 2>&1; then
      skip "Claude Code MCP $name"
    elif [ "$1" = -- ]; then
      claude mcp add -s user "$name" "$@" >/dev/null && ok "Claude Code MCP $name"
    else
      claude mcp add -s user -t http "$name" "$1" >/dev/null && ok "Claude Code MCP $name"
    fi
    if [ -z "$connector" ] && claude mcp get "$name" 2>/dev/null | grep -q 'Needs authentication'; then
      todo "claude 를 실행해 /mcp 에서 $name 를 고르고 Authenticate 해 주세요"
    fi
  fi
  if use_codex; then
    if codex mcp get "$name" >/dev/null 2>&1; then
      skip "Codex MCP $name"
    elif [ "$1" = -- ]; then
      codex mcp add "$name" "$@" >/dev/null && ok "Codex MCP $name"
    # 원격 서버는 등록하면 바로 브라우저 로그인이 시작된다
    elif codex mcp add "$name" --url "$1"; then
      ok "Codex MCP $name"
    else
      todo "codex mcp login $name 로 로그인해 주세요"
    fi
  fi
}

# 이니셜 a가 b와 한 글자만 다르거나 이웃한 두 글자만 바뀌었으면 참
near() {
  local a=$1 b=$2 i diff=""
  [ "${#a}" = "${#b}" ] || return 1
  for ((i = 0; i < ${#a}; i++)); do
    [ "${a:i:1}" = "${b:i:1}" ] || diff="$diff $i"
  done
  set -- $diff
  [ $# = 1 ] && return 0
  [ $# = 2 ] && [ $(($2 - $1)) = 1 ] && [ "${a:$1:1}" = "${b:$2:1}" ] && [ "${a:$2:1}" = "${b:$1:1}" ]
}

# 입력을 대문자로 바꿔 INITIALS 중 하나로 맞춘다. 같으면 그것, 비슷한 것이 하나면 확인 후 그것, 아니면 다시 묻는다
ask_initials() {
  local input c found answer
  while :; do
    read -rp "  개인 브랜치로 쓸 이니셜을 입력하세요($INITIALS 중 하나): " input
    input=$(printf '%s' "$input" | tr -d '[:space:]' | tr '[:lower:]' '[:upper:]')
    [ -n "$input" ] || continue
    found=""
    for c in $INITIALS; do
      if [ "$c" = "$input" ]; then initials=$c; return 0; fi
      if near "$input" "$c"; then found="$found $c"; fi
    done
    set -- $found
    case $# in
      0) printf '  %s 은(는) 목록에 없습니다.\n' "$input" ;;
      1)
        read -rp "  -> $1 으로 진행할까요? [Y/n] " answer
        case "$answer" in [nN]*) ;; *) initials=$1; return 0 ;; esac
        ;;
      *) printf '  %s 와 비슷한 이니셜이 여럿입니다:%s. 정확히 입력해 주세요.\n' "$input" "$found" ;;
    esac
  done
}

step "공통"

command -v git >/dev/null || die "Git이 없습니다. Windows는 Git for Windows를 설치한 뒤 다시 실행해 주세요."
skip "Git $(git --version | awk '{print $3}')"

# AI 도구: 설치된 Claude Code·Codex를 감지해 그 도구에 MCP를 등록한다. 둘 다 없으면 Claude Code를 설치한다.
# Codex만 쓰려면 Codex를 먼저 설치하고 실행한다. 다시 실행하면 새로 설치한 도구도 감지한다
has_claude=n
has_codex=n
if command -v claude >/dev/null; then
  has_claude=y
  skip "Claude Code $(claude --version 2>/dev/null | awk '{print $1}')"
fi
if command -v codex >/dev/null; then
  has_codex=y
  skip "Codex $(codex --version 2>/dev/null | awk '{print $NF}')"
fi
# Claude Code: 공식 설치 스크립트가 ~/.local/bin에 설치한다. 로그인은 처음 실행할 때 직접 한다
if [ "$has_claude$has_codex" = nn ]; then
  if [ "$OS" = mac ]; then
    curl -fsSL https://claude.ai/install.sh | bash
  else
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command 'irm https://claude.ai/install.ps1 | iex'
  fi
  export PATH="$HOME/.local/bin:$PATH"
  command -v claude >/dev/null || die "Claude Code 설치에 실패했습니다. 위 출력을 확인해 주세요."
  persist_path "$HOME/.local/bin"
  has_claude=y
  ok "Claude Code $(claude --version 2>/dev/null | awk '{print $1}')"
  todo "저장소 폴더에서 claude 를 실행해 로그인해 주세요"
fi
use_claude() { [ "$has_claude" = y ]; }
use_codex() { [ "$has_codex" = y ]; }

# 전역 git 설정(회사 계정 등)은 건드리지 않고 이 저장소에만 둔다. 전역 값이 있으면 그대로 쓸지 묻는다
for key in user.name user.email; do
  if [ -n "$(git config --local "$key" || true)" ]; then
    skip "git $key = $(git config --local "$key")"
  else
    value=$(git config --global "$key" || true)
    if [ -n "$value" ]; then
      read -rp "  이 저장소에도 전역 git $key($value) 값을 사용하시겠습니까? [Y/n] " answer
      case "$answer" in [nN]*) value="" ;; esac
    fi
    while [ -z "$value" ]; do read -rp "  이 저장소에 사용할 git $key 값을 입력하세요: " value; done
    git config --local "$key" "$value"
    ok "git $key = $value"
  fi
done

# 커밋 훅: 커밋 메시지에서 AI 도구가 붙인 Co-Authored-By 줄을 지운다(.githooks/commit-msg, docs/convention/git.md)
if [ "$(git config --local core.hooksPath || true)" = .githooks ]; then
  skip "git 커밋 훅 (.githooks)"
else
  git config --local core.hooksPath .githooks
  ok "git 커밋 훅 (.githooks)"
fi

# 개인 브랜치 이름 = 이니셜. 핸드오프 파일 이름과 커밋 접두사가 여기서 나온다.
# 쓸 수 있는 이니셜은 마일스톤 담당 표(docs/convention/milestone.md "담당" 절)의 첫 열이다
INITIALS=$(awk '/^## /{f = ($0 == "## 담당")} f && /^\| [A-Z]+ \|/{print $2}' docs/convention/milestone.md | tr '\n' ' ' | sed 's/ $//')
[ -n "$INITIALS" ] || die "docs/convention/milestone.md 의 담당 표에서 이니셜을 읽지 못했습니다."
branch=$(git branch --show-current)
branch_ok=y
case "$branch" in
  "" | main | master | develop)
    ask_initials
    if git show-ref --verify --quiet "refs/heads/$initials"; then
      git checkout "$initials"
    elif git ls-remote --exit-code --heads origin "$initials" >/dev/null 2>&1; then
      git fetch origin "$initials" && git checkout -b "$initials" --track "origin/$initials"
    else
      git checkout -b "$initials"
    fi
    branch=$initials
    ok "브랜치 $branch"
    ;;
  *)
    if printf ' %s ' "$INITIALS" | grep -qF " $branch "; then
      skip "브랜치 $branch"
    else
      # 이니셜이 아닌 브랜치는 올리지 않고 이름을 바꾸라고 안내한다. 대소문자만 다르면 -M 이어야 맥·Windows에서 바뀐다
      branch_ok=n
      upper=$(printf '%s' "$branch" | tr '[:lower:]' '[:upper:]')
      if printf ' %s ' "$INITIALS" | grep -qF " $upper "; then
        todo "브랜치 $branch 는 대문자 이니셜이 아닙니다. git branch -M $upper 로 바꾼 뒤 다시 실행해 주세요"
      else
        todo "브랜치 $branch 는 이니셜($INITIALS)이 아닙니다. git checkout develop 한 뒤 다시 실행해 이니셜 브랜치를 만들어 주세요"
      fi
    fi
    ;;
esac

# 원격에 없는 개인 브랜치는 공개 저장소이므로 물어보고 올린다
if [ "$branch_ok" = y ] && ! git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
  read -rp "  origin에 $branch 브랜치가 없습니다. 지금 올리시겠습니까? [Y/n] " answer
  case "$answer" in
    [nN]*) todo "개인 브랜치를 올려 주세요: git push -u origin $branch" ;;
    *)
      if git push -q -u origin "$branch"; then ok "브랜치 $branch 푸시"
      else todo "푸시하지 못했습니다. 저장소 권한을 확인한 뒤 git push -u origin $branch 를 실행해 주세요"; fi
      ;;
  esac
fi

step "프론트엔드"

vscode_extensions

# Node: .nvmrc의 버전. 다른 Node를 덮어쓰지 않도록 버전 관리자 fnm으로 설치한다
want_node=$(tr -d ' \r\n' < .nvmrc)
have_node=$(node -v 2>/dev/null | sed 's/^v//; s/\..*//' || true)
if [ "$have_node" = "$want_node" ]; then
  skip "Node $(node -v)"
else
  command -v fnm >/dev/null || pkg fnm formula Schniz.fnm
  if command -v fnm >/dev/null; then
    eval "$(fnm env --shell bash)"
    fnm install "$want_node" && fnm use "$want_node" && fnm default "$want_node"
    ok "Node $(node -v) (fnm)"
    # 새 창에서도 fnm의 Node가 기존 Node보다 먼저 잡히도록 셸 설정에 넣는다
    if [ "$OS" = mac ]; then
      persist_line "$HOME/.zshrc" 'eval "$(fnm env --use-on-cd --shell zsh)"'
    else
      persist_line "$HOME/.bashrc" 'eval "$(fnm env --use-on-cd --shell bash)"'
      ps_profile=$(cygpath -u "$(powershell.exe -NoProfile -Command '$PROFILE' | tr -d '\r')")
      persist_line "$ps_profile" 'fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression'
      case "$(powershell.exe -NoProfile -Command 'Get-ExecutionPolicy' | tr -d '\r')" in
        Restricted | AllSigned | Undefined)
          todo "PowerShell이 프로필을 실행하도록 PowerShell에서 Set-ExecutionPolicy -Scope CurrentUser RemoteSigned 를 실행해 주세요" ;;
      esac
    fi
    ok "fnm 셸 설정"
  fi
fi

if [ "$NEED_RESTART" = 1 ]; then
  printf '\n[다시 실행] 새로 설치한 프로그램은 새 창에서만 인식됩니다. 창을 닫았다가 새로 열고 같은 명령(setup.bat 또는 bash setup.sh)을 한 번 더 실행해 주세요.\n'
  exit 2
fi

# Yarn: package.json의 packageManager 버전. Node에 딸린 corepack이 이 버전을 내려받는다
want_yarn=$(grep -o '"packageManager": *"yarn@[^"]*"' package.json | sed 's/.*yarn@//; s/"//')
if [ "$(yarn -v 2>/dev/null || true)" = "$want_yarn" ]; then
  skip "Yarn $want_yarn"
else
  # Node가 관리자 권한 폴더(Windows Program Files, 맥 /usr/local)에 있으면 실패한다. 그때는 사용자 폴더에 둔다
  if ! corepack enable >/dev/null 2>&1; then
    yarn_dir="$HOME/.local/bin"
    mkdir -p "$yarn_dir"
    corepack enable --install-directory "$yarn_dir" yarn
    case ":$PATH:" in *":$yarn_dir:"*) ;; *) export PATH="$yarn_dir:$PATH" ;; esac
    persist_path "$yarn_dir"
  fi
  hash -r
  [ "$(yarn -v)" = "$want_yarn" ] || die "Yarn 버전이 $want_yarn 이 아닙니다: $(yarn -v) ($(command -v yarn)). 이 yarn을 지우거나 PATH 순서를 바꿔 주세요."
  ok "Yarn $want_yarn (corepack)"
fi

yarn install --frozen-lockfile --silent && ok "yarn install"

# 환경변수 파일. 키 목록은 .env.example에 있고 값은 각자 채운다
if [ -f .env.local ]; then
  skip ".env.local"
else
  cp .env.example .env.local
  ok ".env.local (.env.example 복사)"
fi

# MCP: DMS(요구사항정의서·화면설계서·기능명세서), Figma, Playwright. DMS 주소는 공개 저장소에 두지 않고 .env.local의 DMS_MCP_URL에서 읽는다
step "MCP"
dms_url=$(sed -n 's/^DMS_MCP_URL=//p' .env.local 2>/dev/null | tr -d '\r' | head -1 || true)
! use_claude || claude_ai_list_load
if [ ! -f .env.local ]; then
  :  # .env.local이 없다는 안내는 위에서 했다
elif [ -n "$dms_url" ]; then
  mcp_add dms "$dms_url"
# 주소가 없어도 감지한 도구에 dms가 이미 있으면(Claude Code는 claude.ai 커넥터, Codex는 등록된 것) 할 일로 남기지 않는다
elif { ! use_claude || [ -n "$(claude_connector dms)" ]; } && { ! use_codex || codex mcp get dms >/dev/null 2>&1; }; then
  skip "MCP dms (이미 연결돼 있어 DMS_MCP_URL 없이 건너뜀)"
else
  todo ".env.local 에 DMS_MCP_URL 값이 없습니다. 디스코드의 최신 .env.local 로 바꿔 주세요"
fi
mcp_add figma https://mcp.figma.com/mcp
# 화면 완료 조건 확인용 브라우저. 창 없이(headless) 띄운다
mcp_add playwright -- npx @playwright/mcp@latest --headless

step "확인"
yarn -s lint && ok "yarn lint"
yarn -s build >/dev/null && ok "yarn build"

# 개발 서버가 뜨는지 보고 끈다. yarn을 거치면 Windows에서 자식 프로세스가 남으므로 vite를 직접 띄운다
log=$(mktemp)
NO_COLOR=1 node node_modules/vite/bin/vite.js > "$log" 2>&1 &
pid=$!
for _ in $(seq 1 30); do
  grep -q 'Local:' "$log" && break
  kill -0 "$pid" 2>/dev/null || break
  sleep 1
done
started=$(grep -o 'http://localhost:[0-9]*' "$log" | head -1 || true)
kill "$pid" 2>/dev/null || true
wait "$pid" 2>/dev/null || true
if [ -z "$started" ]; then
  cat "$log"
  rm -f "$log"
  die "개발 서버가 뜨지 않았습니다. 위 출력을 확인해 주세요."
fi
rm -f "$log"
ok "yarn dev ($started)"

printf '\n설치가 끝났습니다. 직접 할 일 %d개(위 [직접] 줄).\n' "$TODO"
# 직접 할 일이 남으면 0이 아닌 코드로 끝낸다
[ "$TODO" = 0 ] || exit 3
