import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import Icon from '@/components/Icon';
import { formatYmdWeekday, getTodayYmd } from '@/utils/formatDate';
import { CARE_CYCLES, addCycle } from './careDue';
import { useCreateCareItem } from './queries';

// 아이콘 목록과 이름은 퍼블리싱 html/hlt-calendar.html의 관리 항목 추가 모달과 같다
// "기타"는 이모지를 고르지 않고 기본 아이콘(task_alt)을 쓴다
const ICONS = [
  { name: 'brush', label: '빗질' },
  { name: 'cleaning_services', label: '청소' },
  { name: 'dentistry', label: '양치' },
  { name: 'bathtub', label: '목욕' },
  { name: 'hearing', label: '귀' },
  { name: 'content_cut', label: '발톱' },
  { name: 'medication', label: '투약' },
  { name: 'vaccines', label: '주사' },
  { name: 'sentiment_satisfied', label: '구강' },
  { name: 'task_alt', label: '기타 (기본 아이콘)' },
];
const DEFAULT_ICON = 'task_alt';
const MAX_NAME_LENGTH = 30;

// 관리 항목 추가 모달(FN-HLT-003-21~24·38). 고른 반려동물의 토탈 케어리스트에 추가한다
export default function CareItemModal({ petSn, onClose }) {
  const dialogRef = useRef(null);
  const [careItemNm, setCareItemNm] = useState('');
  const [iconChoice, setIconChoice] = useState(null);
  const [rptTypeCd, setRptTypeCd] = useState(null);
  const [rptCycleCd, setRptCycleCd] = useState(null);
  const [rptCycleDayCnt, setRptCycleDayCnt] = useState('');
  const [lastCareYmd, setLastCareYmd] = useState('');
  const createCareItem = useCreateCareItem();
  const todayYmd = getTodayYmd();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const isRegular = rptTypeCd === 'REGULAR';
  const isCustomCycle = rptCycleCd === 'CUSTOM';
  const hasValidCycle =
    rptCycleCd && (!isCustomCycle || Number(rptCycleDayCnt) >= 1);
  const canSubmit =
    careItemNm.trim() !== '' &&
    rptTypeCd !== null &&
    (!isRegular || hasValidCycle) &&
    !createCareItem.isPending;

  // 비우면 오늘(등록일)부터 센다
  const nextDueYmd =
    isRegular && hasValidCycle
      ? addCycle(lastCareYmd || todayYmd, rptCycleCd, rptCycleDayCnt)
      : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    createCareItem.mutate(
      {
        petSn,
        careItemNm: careItemNm.trim(),
        careIconCn: iconChoice ?? DEFAULT_ICON,
        rptTypeCd,
        rptCycleCd: isRegular ? rptCycleCd : null,
        rptCycleDayCnt:
          isRegular && isCustomCycle ? Number(rptCycleDayCnt) : null,
        lastCareYmd: isRegular && lastCareYmd ? lastCareYmd : null,
      },
      { onSuccess: onClose },
    );
  };

  const handleCancel = (event) => {
    event.preventDefault();
    onClose();
  };

  const optionClass = (isSelected) =>
    `h-9 rounded-lg border px-3 text-sm ${
      isSelected
        ? 'border-[#285a5c] bg-[#e6efeb] font-bold text-[#1a3234]'
        : 'border-[#e2e7e7] bg-white text-[#566465] hover:bg-[#f4f6f6]'
    }`;

  return (
    <dialog
      ref={dialogRef}
      aria-label="관리 항목 추가"
      className="m-auto w-[min(440px,calc(100%-32px))] rounded-[14px] bg-white p-0 shadow-lg backdrop:bg-black/40"
      onCancel={handleCancel}
    >
      <form className="flex flex-col gap-5 p-6" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1a3234]">관리 항목 추가</h2>
          <button
            type="button"
            aria-label="닫기"
            className="text-[#566465]"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-bold text-[#1a3234]">
          항목명 *
          <input
            value={careItemNm}
            maxLength={MAX_NAME_LENGTH}
            placeholder="예: 영양제"
            className="h-10 rounded-lg border border-[#d5dcdc] px-3 font-normal"
            onChange={(event) => setCareItemNm(event.target.value)}
          />
        </label>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-bold text-[#1a3234]">
            카테고리 대표 아이콘(선택)
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {ICONS.map((icon) => (
              <button
                key={icon.name}
                type="button"
                title={icon.label}
                aria-label={icon.label}
                aria-pressed={iconChoice === icon.name}
                className={`${optionClass(iconChoice === icon.name)} flex w-10 items-center justify-center px-0`}
                onClick={() =>
                  setIconChoice(iconChoice === icon.name ? null : icon.name)
                }
              >
                <Icon name={icon.name} />
              </button>
            ))}
          </div>
          <p className="text-xs text-[#8a9596]">
            고르지 않으면 기본 아이콘으로 추가돼요
          </p>
        </fieldset>

        <fieldset>
          <legend className="mb-1.5 text-sm font-bold text-[#1a3234]">
            반복 유형 *
          </legend>
          <div className="flex gap-2">
            {[
              { cd: 'DAILY', nm: '매일' },
              { cd: 'REGULAR', nm: '주기' },
            ].map((type) => (
              <button
                key={type.cd}
                type="button"
                aria-pressed={rptTypeCd === type.cd}
                className={optionClass(rptTypeCd === type.cd)}
                onClick={() => setRptTypeCd(type.cd)}
              >
                {type.nm}
              </button>
            ))}
          </div>
        </fieldset>

        {isRegular && (
          <>
            <fieldset>
              <legend className="mb-1.5 text-sm font-bold text-[#1a3234]">
                주기 *
              </legend>
              <div className="flex flex-wrap gap-2">
                {CARE_CYCLES.map((cycle) => (
                  <button
                    key={cycle.cd}
                    type="button"
                    aria-pressed={rptCycleCd === cycle.cd}
                    className={optionClass(rptCycleCd === cycle.cd)}
                    onClick={() => setRptCycleCd(cycle.cd)}
                  >
                    {cycle.nm}
                  </button>
                ))}
              </div>
              {isCustomCycle && (
                <label className="mt-2 flex items-center gap-2 text-sm text-[#3d4a4b]">
                  마지막으로 한 날부터
                  <input
                    type="number"
                    min={1}
                    value={rptCycleDayCnt}
                    aria-label="반복 일수"
                    className="h-9 w-20 rounded-lg border border-[#d5dcdc] px-2"
                    onChange={(event) => setRptCycleDayCnt(event.target.value)}
                  />
                  일마다
                </label>
              )}
            </fieldset>

            <label className="flex flex-col gap-1.5 text-sm font-bold text-[#1a3234]">
              마지막으로 한 날(선택)
              <input
                type="date"
                value={lastCareYmd}
                max={todayYmd}
                className="h-10 rounded-lg border border-[#d5dcdc] px-3 font-normal"
                onChange={(event) => setLastCareYmd(event.target.value)}
              />
              <span className="text-xs font-normal text-[#8a9596]">
                마지막으로 한 날을 알려주시면 다음 예정일을 더 정확하게
                계산해요. 비우면 오늘부터 셉니다
              </span>
            </label>

            {nextDueYmd && (
              <p className="rounded-lg bg-[#f4f8f7] px-3 py-2 text-sm text-[#285a5c]">
                다음 예정일 {formatYmdWeekday(nextDueYmd)}
              </p>
            )}
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="h-10 rounded-lg border border-[#e2e7e7] px-4 text-sm text-[#3d4a4b] hover:bg-[#f4f6f6]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-10 rounded-lg bg-[#285a5c] px-4 text-sm font-bold text-white hover:bg-[#1f4a4c] disabled:opacity-40"
          >
            추가하기
          </button>
        </div>
      </form>
    </dialog>
  );
}
