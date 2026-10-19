// Figma 화면 디자인을 REST API로 받아 .cache/figma/에 두고, /start 기획과 구현이 그 캐시만 읽는다.
// Figma MCP는 Starter 플랜의 호출 한도가 너무 적어 쓰지 않는다. REST API도 View·Collab 시트는 월 20회라
// pull 한 번에 API를 3번(파일 구조, 노드, 이미지)만 쓰고, 캐시가 있으면 --refresh 없이는 다시 받지 않는다.
// 화면 프레임은 이름이 화면 ID(SCR-…)로 시작하는 FRAME이다. 페이지 바로 아래나 섹션 바로 아래에 둔다.
// 사용:
//   node scripts/figma.mjs pull [--refresh]          화면 프레임 목록·PNG·노드 JSON을 받는다
//   node scripts/figma.mjs list [SCR-ID]             받은 화면 프레임 목록
//   node scripts/figma.mjs show <SCR-ID> [--node <노드 ID>] [--depth <N>]
//                                                    레이어 트리(이름·크기·레이아웃·색·글자)를 글자로 출력
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CACHE = '.cache/figma';
const API = 'https://api.figma.com/v1';
const SCR = /^SCR-[A-Z]+-\d{3}/;

// process.exit는 fetch 직후 Windows에서 Node가 비정상 종료되므로 던져서 맨 아래에서 종료 코드만 정한다
class Stop extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
function die(message, code = 1) {
  throw new Stop(message, code);
}

function readEnv() {
  if (!existsSync('.env.local'))
    die('.env.local 이 없습니다. setup 을 먼저 실행해 주세요.');
  const env = {};
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  if (!env.FIGMA_TOKEN)
    die(
      '.env.local 에 FIGMA_TOKEN 이 없습니다. README "Figma 디자인"을 보고 넣어 주세요.',
    );
  // 브랜치 주소(/design/<키>/branch/<브랜치 키>/)는 브랜치 키를 쓴다
  const m = (env.FIGMA_FILE_URL || '').match(
    /\/(?:design|file)\/([0-9a-zA-Z]+)(?:\/branch\/([0-9a-zA-Z]+))?/,
  );
  if (!m) die('.env.local 의 FIGMA_FILE_URL 에서 파일 키를 읽지 못했습니다.');
  return { token: env.FIGMA_TOKEN, fileKey: m[2] || m[1] };
}

async function api(token, path) {
  const res = await fetch(API + path, { headers: { 'X-Figma-Token': token } });
  if (res.status === 429) {
    die(
      `Figma API 한도에 걸렸습니다(Retry-After: ${res.headers.get('retry-after') ?? '없음'}초). 받아 둔 캐시로 작업해 주세요.`,
    );
  }
  if (res.status === 403)
    die(
      'Figma가 거부했습니다(403). FIGMA_TOKEN 이 맞는지, 그 계정이 이 파일을 볼 수 있는지 확인해 주세요.',
    );
  if (!res.ok)
    die(`Figma API 오류 ${res.status}: ${path}\n${await res.text()}`);
  return res.json();
}

const fileName = (scr, id) => `${scr}__${id.replace(/:/g, '-')}`;

function readFrames() {
  const path = join(CACHE, 'frames.json');
  if (!existsSync(path))
    die(
      '받아 둔 디자인이 없습니다. node scripts/figma.mjs pull 을 먼저 실행해 주세요.',
    );
  return JSON.parse(readFileSync(path, 'utf8'));
}

async function pull(refresh) {
  if (existsSync(join(CACHE, 'frames.json')) && !refresh) {
    die(
      '이미 받아 둔 디자인이 있습니다. 디자인이 바뀌었을 때만 --refresh 로 다시 받아 주세요(API 한도가 적습니다).',
      0,
    );
  }
  const { token, fileKey } = readEnv();

  // 1회: 페이지 → 섹션 → 프레임까지만 받는다
  const file = await api(token, `/files/${fileKey}?depth=3`);
  const frames = [];
  const others = [];
  for (const page of file.document.children) {
    for (const node of page.children ?? []) {
      const inner = node.type === 'SECTION' ? (node.children ?? []) : [node];
      for (const n of inner) {
        const m = n.name.match(SCR);
        if (n.type === 'FRAME' && m)
          frames.push({ scr: m[0], id: n.id, name: n.name, page: page.name });
        else others.push(`${page.name} / ${n.name} (${n.type})`);
      }
    }
  }
  if (frames.length === 0) {
    die(
      `이름이 SCR-… 로 시작하는 화면 프레임이 없습니다. 최상위 노드:\n${others.map((o) => `  ${o}`).join('\n')}`,
    );
  }
  mkdirSync(CACHE, { recursive: true });
  const ids = frames.map((f) => f.id).join(',');

  // 2회: 화면 프레임 전체의 노드 JSON
  const nodes = await api(token, `/files/${fileKey}/nodes?ids=${ids}`);
  for (const f of frames) {
    writeFileSync(
      join(CACHE, `${fileName(f.scr, f.id)}.json`),
      JSON.stringify(nodes.nodes[f.id]),
    );
  }

  // 3회: 화면 프레임 전체의 PNG 주소. 내려받기는 Figma API 호출이 아니다
  const images = await api(
    token,
    `/images/${fileKey}?ids=${ids}&format=png&scale=1`,
  );
  for (const f of frames) {
    const url = images.images[f.id];
    if (!url) continue;
    const res = await fetch(url);
    if (res.ok)
      writeFileSync(
        join(CACHE, `${fileName(f.scr, f.id)}.png`),
        Buffer.from(await res.arrayBuffer()),
      );
  }

  writeFileSync(join(CACHE, 'frames.json'), JSON.stringify(frames, null, 2));
  writeFileSync(
    join(CACHE, 'meta.json'),
    JSON.stringify(
      {
        fileKey,
        lastModified: file.lastModified,
        pulledAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
  console.log(
    `화면 프레임 ${frames.length}개를 ${CACHE}/ 에 받았습니다(API 3회).`,
  );
  list();
}

function list(scr) {
  const frames = readFrames().filter((f) => !scr || f.scr === scr);
  if (scr && frames.length === 0)
    die(
      `${scr} 프레임이 없습니다. 디자인 없음, 화면설계서 기준으로 진행합니다.`,
    );
  for (const f of frames)
    console.log(
      `${f.scr}\t${f.id}\t${f.name}\t${CACHE}/${fileName(f.scr, f.id)}.png`,
    );
}

const hex = (c) =>
  '#' +
  [c.r, c.g, c.b]
    .map((v) =>
      Math.round(v * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('') +
  (c.a !== undefined && c.a < 1 ? `/${Math.round(c.a * 100)}%` : '');

function paints(list) {
  return (list ?? [])
    .filter((p) => p.visible !== false)
    .map((p) =>
      p.type === 'SOLID'
        ? hex({ ...p.color, a: (p.opacity ?? 1) * p.color.a })
        : p.type.toLowerCase(),
    )
    .join(',');
}

// 한 줄에 노드 하나: 이름 [종류] 크기 · 레이아웃 · 색 · 글자
function describe(n) {
  const parts = [`${n.name} [${n.type}] ${n.id}`];
  const box = n.absoluteBoundingBox;
  if (box) parts.push(`${Math.round(box.width)}x${Math.round(box.height)}`);
  if (n.layoutMode && n.layoutMode !== 'NONE') {
    const pad = [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft]
      .map((v) => v ?? 0)
      .join('/');
    parts.push(
      `${n.layoutMode === 'HORIZONTAL' ? 'row' : 'col'} gap ${n.itemSpacing ?? 0} pad ${pad}`,
    );
  }
  if (n.cornerRadius) parts.push(`radius ${n.cornerRadius}`);
  const fill = paints(n.fills);
  if (fill) parts.push(`${n.type === 'TEXT' ? 'color' : 'bg'} ${fill}`);
  const stroke = paints(n.strokes);
  if (stroke) parts.push(`border ${n.strokeWeight ?? 1} ${stroke}`);
  if (n.type === 'TEXT') {
    const s = n.style ?? {};
    parts.push(
      `${s.fontFamily ?? ''} ${s.fontSize ?? ''}/${s.fontWeight ?? ''}`.trim(),
    );
    parts.push(
      JSON.stringify(
        n.characters.length > 80
          ? n.characters.slice(0, 80) + '…'
          : n.characters,
      ),
    );
  }
  return parts.join(' · ');
}

function find(node, id) {
  if (node.id === id) return node;
  for (const c of node.children ?? []) {
    const hit = find(c, id);
    if (hit) return hit;
  }
  return null;
}

function show(scr, nodeId, maxDepth) {
  const frames = readFrames().filter((f) => f.scr === scr);
  if (frames.length === 0)
    die(
      `${scr} 프레임이 없습니다. 디자인 없음, 화면설계서 기준으로 진행합니다.`,
    );
  for (const f of frames) {
    const data = JSON.parse(
      readFileSync(join(CACHE, `${fileName(f.scr, f.id)}.json`), 'utf8'),
    );
    const root = nodeId ? find(data.document, nodeId) : data.document;
    if (!root) continue;
    console.log(`# ${f.name} (${CACHE}/${fileName(f.scr, f.id)}.png)`);
    const walk = (n, depth) => {
      if (n.visible === false) return;
      // 인스턴스는 원본 컴포넌트 이름을 붙인다. 같은 컴포넌트는 components/의 같은 컴포넌트로 만든다
      const comp =
        n.type === 'INSTANCE' && data.components?.[n.componentId]?.name;
      console.log(
        `${'  '.repeat(depth)}${describe(n)}${comp ? ` · 컴포넌트 ${comp}` : ''}`,
      );
      if (depth + 1 >= maxDepth) {
        if (n.children?.length)
          console.log(
            `${'  '.repeat(depth + 1)}… 하위 ${n.children.length}개(--node ${n.id})`,
          );
        return;
      }
      for (const c of n.children ?? []) walk(c, depth + 1);
    };
    walk(root, 0);
  }
}

const [cmd, ...args] = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
try {
  if (cmd === 'pull') await pull(args.includes('--refresh'));
  else if (cmd === 'list') list(args[0]);
  else if (cmd === 'show' && args[0])
    show(args[0], opt('--node'), Number(opt('--depth') ?? 4));
  else
    die(
      '사용: node scripts/figma.mjs pull [--refresh] | list [SCR-ID] | show <SCR-ID> [--node <노드 ID>] [--depth <N>]',
      2,
    );
} catch (e) {
  if (!(e instanceof Stop)) throw e;
  (e.code === 0 ? console.log : console.error)(e.message);
  process.exitCode = e.code;
}
