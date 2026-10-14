# 냥멍케어 프론트엔드

반려동물 케어 웹서비스 냥멍케어의 프론트엔드. React 19 + Vite, JavaScript.

코드를 쓰기 전에 `AGENTS.md`를 읽는다. 나머지 규칙은 `docs/convention/`에 있다. 아직 정하지 않은 것은 `docs/OPEN_ISSUES.md`에 있다.

## 실행

처음 받으면 `bash setup.sh`로 필요한 도구를 설치한다. Windows는 Git Bash에서 실행한다. 여러 번 실행해도 된다.

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
