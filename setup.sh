#!/usr/bin/env bash
# 냥멍케어 프론트엔드 개발 환경 설치. 맥은 터미널, Windows는 Git Bash에서 `bash setup.sh`로 실행한다.
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
  *) die "지원하지 않는 환경이다: $(uname -s). 맥 터미널이나 Windows Git Bash에서 실행한다." ;;
esac

# 패키지 설치. 맥은 Homebrew, Windows는 winget
# pkg <brew 이름> <formula|cask> <winget ID> [winget 버전]
pkg() {
  if [ "$OS" = mac ]; then
    command -v brew >/dev/null || die "Homebrew가 없다. https://brew.sh 의 설치 명령을 먼저 실행한다."
    if [ "$2" = cask ]; then brew install --cask "$1"; else brew install "$1"; fi
  else
    command -v winget.exe >/dev/null || die "winget이 없다. Microsoft Store에서 '앱 설치 관리자'를 설치한다."
    if [ -n "${4:-}" ]; then
      winget.exe install --id "$3" -e --version "$4" --accept-package-agreements --accept-source-agreements
    else
      winget.exe install --id "$3" -e --accept-package-agreements --accept-source-agreements
    fi
    # winget이 바꾼 PATH는 새 창에서만 적용된다
    NEED_RESTART=1
  fi
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

step "공통"

command -v git >/dev/null || die "Git이 없다. Windows는 Git for Windows를 설치하고 Git Bash에서 다시 실행한다."
skip "Git $(git --version | awk '{print $3}')"

if command -v claude >/dev/null; then
  skip "Claude Code $(claude --version 2>/dev/null | awk '{print $1}')"
else
  todo "Claude Code 설치. 맥: curl -fsSL https://claude.ai/install.sh | bash / Windows PowerShell: irm https://claude.ai/install.ps1 | iex"
fi

CODE=$(vscode_cli)
if [ -z "$CODE" ]; then
  todo "VS Code 설치 뒤 다시 실행한다(확장 설치를 위해)."
else
  installed=$("$CODE" --list-extensions | tr '[:upper:]' '[:lower:]')
  for ext in $(grep -o '"[^"]*\.[^"]*"' .vscode/extensions.json | tr -d '"'); do
    if printf '%s\n' "$installed" | grep -qx "$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"; then
      skip "VS Code 확장 $ext"
    else
      "$CODE" --install-extension "$ext" >/dev/null && ok "VS Code 확장 $ext"
    fi
  done
fi

# 전역 git 설정(회사 계정 등)은 건드리지 않고 이 저장소에만 둔다
for key in user.name user.email; do
  if [ -n "$(git config --local "$key" || true)" ]; then
    skip "git $key = $(git config --local "$key")"
  else
    read -rp "  이 저장소에 쓸 git $key: " value
    git config --local "$key" "$value"
    ok "git $key = $value"
  fi
done

# 개인 브랜치 이름 = 이니셜. 핸드오프 파일 이름과 커밋 접두사가 여기서 나온다
branch=$(git branch --show-current)
case "$branch" in
  "" | main | master | develop)
    read -rp "  개인 브랜치로 쓸 이니셜(대문자, 예: LJS): " initials
    if git show-ref --verify --quiet "refs/heads/$initials"; then
      git checkout "$initials"
    elif git ls-remote --exit-code --heads origin "$initials" >/dev/null 2>&1; then
      git fetch origin "$initials" && git checkout -b "$initials" --track "origin/$initials"
    else
      git checkout -b "$initials"
    fi
    ok "브랜치 $initials"
    ;;
  *) skip "브랜치 $branch" ;;
esac

step "프론트엔드"

# Node: .nvmrc의 버전. 다른 Node를 덮어쓰지 않도록 버전 관리자 fnm으로 설치한다
want_node=$(tr -d ' \r\n' < .nvmrc)
have_node=$(node -v 2>/dev/null | sed 's/^v//; s/\..*//' || true)
if [ "$have_node" = "$want_node" ]; then
  skip "Node $(node -v)"
else
  command -v fnm >/dev/null || pkg fnm formula Schniz.fnm
  if command -v fnm >/dev/null; then
    eval "$(fnm env --shell bash)"
    fnm install "$want_node" && fnm use "$want_node"
    ok "Node $(node -v) (fnm)"
    todo "셸을 열 때 fnm이 켜지도록 fnm 안내(https://github.com/Schniz/fnm#shell-setup)의 한 줄을 셸 설정 파일에 넣는다"
  fi
fi

if [ "$NEED_RESTART" = 1 ]; then
  printf '\n[다시 실행] 새로 설치한 프로그램은 새 창에서만 잡힌다. Git Bash를 닫았다가 열고 bash setup.sh를 한 번 더 실행한다.\n'
  exit 2
fi

# Yarn: package.json의 packageManager 버전. Node에 딸린 corepack이 이 버전을 내려받는다
want_yarn=$(grep -o '"packageManager": *"yarn@[^"]*"' package.json | sed 's/.*yarn@//; s/"//')
if [ "$(yarn -v 2>/dev/null || true)" = "$want_yarn" ]; then
  skip "Yarn $want_yarn"
else
  corepack enable
  [ "$(yarn -v)" = "$want_yarn" ] || die "Yarn 버전이 $want_yarn 이 아니다: $(yarn -v)"
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

step "확인"
yarn -s lint && ok "yarn lint"
yarn -s build >/dev/null && ok "yarn build"

printf '\n끝. 직접 할 일 %d개(위 [직접] 줄).\n' "$TODO"
