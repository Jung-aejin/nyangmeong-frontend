import Icon from '@/components/Icon';
import { BTN_SECONDARY } from '@/components/buttonStyles';
import { formatDate, formatMonthDayDot } from '@/utils/formatDate';
import { findObservationChange } from '../diaryTypes';
import LineChart from './LineChart';
import {
  formatDiff,
  formatPart,
  formatSize,
  getSizeDiff,
} from './observationUtils';

/**
 * [관찰 항목 상세]
 * - 항목 헤더·회차별 사진 필름스트립·크기 변화 그래프·선택 회차 상세 (FN-HLT-002-16~19)
 * - 종료한 항목은 [관찰 기록 추가]·[관찰 종료]를 보이지 않음
 */
export default function ObservationDetail({
  item,
  selectedIndex,
  onSelectRound,
  onEditRound,
  onDeleteRound,
  onAddRound,
  onEnd,
  onViewPhoto,
}) {
  const { rounds } = item;
  const round = rounds[selectedIndex];
  const isEnded = item.obsvEndYmd !== null;
  const sizedRounds = rounds.filter((target) => target.obsvSizeMm !== null);
  const sizeDiff = getSizeDiff(rounds, selectedIndex);

  return (
    <div aria-live="polite" className="min-w-0">
      <div className="mb-4 flex flex-wrap items-baseline gap-2 border-b border-line pb-3">
        <h3 className="text-lg/[1.6] font-semibold text-ink">
          {item.obsvItmNm}
        </h3>
        <span className="text-subtle tabular-nums">
          {formatPart(item)} · {rounds.length}회차
        </span>
      </div>

      <div
        role="group"
        aria-label="회차별 사진"
        className="mb-4 flex gap-2 overflow-x-auto pb-1"
      >
        {rounds.map((target, index) => (
          <button
            key={target.obsvRndSn}
            type="button"
            aria-pressed={index === selectedIndex}
            aria-label={`${index + 1}회차 ${formatDate(target.obsvYmd)}`}
            className="flex w-[88px] shrink-0 flex-col text-center"
            onClick={() => onSelectRound(target.obsvRndSn)}
          >
            <span
              className={`relative grid aspect-square w-full place-content-center place-items-center gap-0 overflow-hidden rounded-[10px] border bg-surface-2 text-subtle ${
                index === selectedIndex
                  ? 'border-brand-500'
                  : 'border-dashed border-line-strong'
              }`}
            >
              {target.photoPath ? (
                <>
                  <img
                    src={target.photoPath}
                    alt=""
                    className="size-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1.5 text-[12px] leading-5 text-white">
                    {index + 1}회차
                  </span>
                </>
              ) : (
                <>
                  <Icon
                    name="image"
                    className="text-[52px] text-line-strong [font-variation-settings:'FILL'_0,'wght'_500,'GRAD'_0,'opsz'_24]"
                  />
                  {index + 1}회차
                </>
              )}
            </span>
            <span className="mt-1 text-sm/[1.6] text-subtle tabular-nums">
              {formatMonthDayDot(target.obsvYmd)}
            </span>
            {target.obsvSizeMm !== null && (
              <span className="text-sm/[1.6] tabular-nums">
                {formatSize(target.obsvSizeMm)}
              </span>
            )}
          </button>
        ))}
      </div>

      {sizedRounds.length >= 2 && (
        <div className="mb-4">
          <LineChart
            points={sizedRounds.map((target) => ({
              label: formatMonthDayDot(target.obsvYmd),
              value: target.obsvSizeMm,
            }))}
            formatValue={formatSize}
            formatTag={(value) => value.toFixed(1)}
            height={200}
            ariaLabel={`크기 변화 선그래프 · ${sizedRounds
              .map((target) => formatSize(target.obsvSizeMm))
              .join(' → ')} (크기 없는 회차는 건너뜀)`}
          />
        </div>
      )}
      {rounds.length === 1 && (
        <p className="mb-4 text-sm/[1.6] text-subtle">
          회차가 2개 이상 쌓이면 크기 변화 그래프로 보여요
        </p>
      )}

      <div className="rounded-[10px] bg-surface-2 p-4">
        <p className="text-sm/[1.6] text-subtle tabular-nums">
          선택 회차 · {selectedIndex + 1}회차 {formatDate(round.obsvYmd)}
        </p>
        <dl className="mt-2">
          {round.obsvSizeMm !== null && (
            <DetailRow label="크기">
              <span className="tabular-nums">
                {formatSize(round.obsvSizeMm)}
              </span>
              {sizeDiff && (
                <span className="text-subtle tabular-nums">
                  {' '}
                  ({sizeDiff.prevIndex + 1}회차{' '}
                  {formatSize(sizeDiff.prevSizeMm)} 대비{' '}
                  {formatDiff(sizeDiff.diff) || '변화 없음'}
                  {formatDiff(sizeDiff.diff) && 'mm'})
                </span>
              )}
            </DetailRow>
          )}
          {round.obsvChgCd && (
            <DetailRow label="변화">
              {findObservationChange(round.obsvChgCd).nm}
            </DetailRow>
          )}
          {round.obsvMemoCn && (
            <DetailRow label="메모">{round.obsvMemoCn}</DetailRow>
          )}
        </dl>
        <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
          <button
            type="button"
            disabled={!round.photoPath}
            className={`${BTN_SECONDARY} h-8! px-3!`}
            onClick={() => onViewPhoto(round.photoPath)}
          >
            사진 원본 보기
          </button>
          <button
            type="button"
            className={`${BTN_SECONDARY} h-8! px-3!`}
            onClick={() => onEditRound(round)}
          >
            이 회차 수정
          </button>
          <button
            type="button"
            className={`${BTN_SECONDARY} h-8! px-3!`}
            onClick={() => onDeleteRound(round)}
          >
            삭제
          </button>
        </div>
      </div>

      {!isEnded && (
        <>
          <button
            type="button"
            className={`${BTN_SECONDARY} mt-4 w-full`}
            onClick={onAddRound}
          >
            관찰 기록 추가 · {rounds.length + 1}회차
          </button>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="min-h-9 px-1 font-semibold text-muted hover:text-ink hover:underline"
              onClick={onEnd}
            >
              관찰 종료
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex items-center gap-3 border-t border-dashed border-line py-2.5 first:border-t-0">
      <dt className="w-14 shrink-0 text-ink-2">{label}</dt>
      <dd className="min-w-0 flex-1 font-semibold text-ink-2">{children}</dd>
    </div>
  );
}
