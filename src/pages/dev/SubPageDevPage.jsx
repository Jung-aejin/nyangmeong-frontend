import { useState } from 'react';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import SubPageLayout from '@/layouts/SubPageLayout';
import { SUB_MENUS } from '@/layouts/subMenus';

/** 확인할 경우 */
const CASES = [
  { key: 'list', label: '목록' },
  { key: 'deep', label: '3단계 title' },
  { key: 'back', label: 'back만' },
  { key: 'noDescription', label: '설명 없음' },
  { key: 'noPixel', label: 'pixel 끔' },
  { key: 'leave', label: 'onLeave' },
];

const DESCRIPTION = '페이지 설명 한 줄이 들어가는 자리예요';

/**
 * [공용 페이지 머리·사이드 메뉴 확인용 DEV 전용 페이지]
 * - 섹션·선택 메뉴·경우를 골라 SubPageLayout 확인
 * - 건강기록·마이페이지·고객센터·커뮤니티 화면이 SubPageLayout으로 옮겨 가면 라우트와 함께 지움
 */
export default function SubPageDevPage() {
  const [section, setSection] = useState('health');
  const [menuIndex, setMenuIndex] = useState(0);
  const [caseKey, setCaseKey] = useState('list');
  const [leaveTo, setLeaveTo] = useState('');

  const sectionMenu = SUB_MENUS[section];
  const menu = sectionMenu.items[menuIndex] ?? sectionMenu.items[0];

  /** 섹션 바꾸기 */
  const handleSection = (key) => {
    setSection(key);
    setMenuIndex(0);
    setLeaveTo('');
  };

  return (
    <>
      <div className="flex flex-col gap-2 rounded-box border border-dashed border-line-strong bg-surface-2 p-3 text-sm">
        <ButtonRow
          items={Object.entries(SUB_MENUS).map(([key, item]) => ({
            key,
            label: item.label,
          }))}
          selected={section}
          onSelect={handleSection}
        />
        <ButtonRow
          items={sectionMenu.items.map((item, index) => ({
            key: index,
            label: item.label,
          }))}
          selected={menuIndex}
          onSelect={setMenuIndex}
        />
        <ButtonRow
          items={CASES}
          selected={caseKey}
          onSelect={(key) => {
            setCaseKey(key);
            setLeaveTo('');
          }}
        />
      </div>
      <SubPageLayout
        key={`${section}-${caseKey}`}
        section={section}
        menu={menu.to}
        title={caseKey === 'deep' || caseKey === 'leave' ? '글쓰기' : undefined}
        back={caseKey === 'back' ? true : undefined}
        description={caseKey === 'noDescription' ? undefined : DESCRIPTION}
        pixel={caseKey !== 'noPixel'}
        onLeave={caseKey === 'leave' ? setLeaveTo : undefined}
      >
        <div className="rounded-card border border-line bg-white p-6 text-muted">
          {leaveTo ? `onLeave 호출: ${leaveTo}` : '본문 자리'}
        </div>
      </SubPageLayout>
    </>
  );
}

/** 하나만 고르는 버튼 줄 */
function ButtonRow({ items, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onSelect(item.key)}
          className={item.key === selected ? BTN_PRIMARY : BTN_SECONDARY}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
