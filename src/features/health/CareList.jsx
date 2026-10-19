import { useState } from 'react';
import Card from '@/components/Card';
import CareItemModal from './CareItemModal';
import CareRecordList from './CareRecordList';
import CareTile from './CareTile';
import { MAX_MAIN_CARE } from './careDue';
import {
  useCancelCareRecord,
  useCancelLastDose,
  useCareItems,
  useCheckCareItem,
  useToggleCareMain,
} from './queries';

// 토탈 케어리스트 카드(FN-HLT-003-12·13). 반려동물 선택 탭에서 고른 반려동물 기준이다
export default function CareList({ petSn }) {
  const { data, isPending, isError, error, refetch } = useCareItems(petSn);
  const [isAdding, setIsAdding] = useState(false);
  const checkCareItem = useCheckCareItem();
  const cancelLastDose = useCancelLastDose();
  const cancelCareRecord = useCancelCareRecord();
  const toggleCareMain = useToggleCareMain();

  if (isPending)
    return <p className="text-sm text-[#566465]">불러오는 중이에요</p>;
  if (isError) {
    return (
      <div
        role="alert"
        className="flex items-center gap-3 text-sm text-[#566465]"
      >
        {error.message}
        <button type="button" className="underline" onClick={() => refetch()}>
          다시 시도
        </button>
      </div>
    );
  }

  const { careItems, careRecords } = data;
  const dailyItems = careItems.filter((item) => item.rptTypeCd === 'DAILY');
  const regularItems = careItems.filter((item) => item.rptTypeCd === 'REGULAR');
  const doneCount = careItems.filter((item) => item.todayDoneYn).length;
  const mainCount = careItems.filter((item) => item.mainExpsrYn).length;

  const renderZone = (label, items, note, className = '') => (
    <div className={className}>
      <p className="border-b border-[#e2e7e7] pb-2 text-base text-[#3d4a4b]">
        {label}
      </p>
      <div className="sm:columns-2 sm:gap-x-8">
        {items.map((item) => (
          <CareTile
            key={item.careItemSn}
            item={item}
            onCheck={(target) => checkCareItem.mutate(target.careItemSn)}
            onToggleMain={(target) => toggleCareMain.mutate(target.careItemSn)}
            onCancelLastDose={(target) =>
              cancelLastDose.mutate(target.careItemSn)
            }
          />
        ))}
      </div>
      {note && (
        <p className="mt-3 rounded-[10px] border border-dashed border-[#b9c4c4] px-4 py-3 text-sm text-[#566465]">
          {note}
        </p>
      )}
    </div>
  );

  return (
    <>
      <Card
        title="토탈 케어리스트"
        sub={`오늘 ${doneCount}/${careItems.length} 완료`}
        action={
          <button
            type="button"
            className="inline-flex h-8 shrink-0 items-center rounded-[6px] bg-[#e9f2f2] px-3 text-sm font-semibold text-[#1e4a4c] hover:bg-[#cde0e0]"
            onClick={() => setIsAdding(true)}
          >
            관리 항목 추가
          </button>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[#566465]">
          <span>★ 표시한 항목이 메인 화면에 보여요</span>
          <span className="ml-auto">
            메인 표시{' '}
            <span className="text-lg font-semibold text-[#1a3234] tabular-nums">
              {mainCount}
            </span>{' '}
            / {MAX_MAIN_CARE}
          </span>
        </div>

        {renderZone(
          '정기관리(REGULAR)',
          regularItems,
          '심장사상충 예방·구충제는 검진상세에서 반복 예방을 등록하면 여기에 추가돼요',
        )}
        {renderZone('일상관리(DAILY)', dailyItems, null, 'mt-8')}

        <CareRecordList
          records={careRecords}
          onCancel={(record) => cancelCareRecord.mutate(record.careRcdSn)}
        />
      </Card>

      {isAdding && (
        <CareItemModal petSn={petSn} onClose={() => setIsAdding(false)} />
      )}
    </>
  );
}
