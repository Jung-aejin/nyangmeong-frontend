import { useState } from 'react';
import Card from '@/components/Card';
import Icon from '@/components/Icon';
import { diffDays, formatDate } from '@/utils/formatDate';
import { findObservationChange } from '../diaryTypes';
import {
  formatDiff,
  formatPart,
  formatSize,
} from '../diary/observationUtils';
import PhotoModal from './PhotoModal';
import { CardTitle, MoreLink, SummaryEmpty } from './SummaryParts';
import { DIARY_OBS_PATH } from './summaryUtils';

/**
 * [관찰 기록] (FN-HLT-011-10)
 * - 관찰중 항목을 탭으로(1개면 탭 없음), 선택 항목의 첫 기록 사진과 최근 사진을 나란히 비교
 * - 사진 아래는 관찰일·회차 1줄, 크기(증감) 1줄. 요약 줄은 크기 변화량 → 변화 단계 → 없음 순
 * - 조회 전용: 등록·사진 추가·종료는 건강 일지에서만
 */
export default function ObservationSummaryCard({ observations }) {
  const [selectedSn, setSelectedSn] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const item =
    observations.find((candidate) => candidate.obsvItmSn === selectedSn) ??
    observations[0];

  return (
    <Card
      title={<CardTitle icon="favorite">관찰 기록</CardTitle>}
      sub={observations.length > 0 && `관찰중 ${observations.length}건`}
      action={observations.length > 0 && <MoreLink to={DIARY_OBS_PATH} />}
    >
      {!item ? (
        <SummaryEmpty
          icon="favorite"
          description="계속 지켜볼 곳을 사진으로 남기면 처음과 최근을 비교해 보여요"
          action="건강 일지 지속 관찰로 가기"
          to={DIARY_OBS_PATH}
        />
      ) : (
        <>
          {observations.length > 1 && (
            <div
              role="radiogroup"
              aria-label="관찰 항목 선택"
              className="mb-4 flex flex-wrap gap-2"
            >
              {observations.map((candidate) => {
                const isSelected = candidate.obsvItmSn === item.obsvItmSn;
                return (
                  <button
                    key={candidate.obsvItmSn}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-line bg-white text-ink hover:bg-surface-2'
                    }`}
                    onClick={() => setSelectedSn(candidate.obsvItmSn)}
                  >
                    {candidate.obsvItmNm}
                    <span className="opacity-80">{formatPart(candidate)}</span>
                  </button>
                );
              })}
            </div>
          )}
          <Compare key={item.obsvItmSn} item={item} onView={setPhotoUrl} />
        </>
      )}
      {photoUrl && (
        <PhotoModal src={photoUrl} onClose={() => setPhotoUrl(null)} />
      )}
    </Card>
  );
}

function Compare({ item, onView }) {
  const { rounds } = item;
  const first = rounds[0];
  const lastIndex = rounds.length - 1;
  const last = rounds[lastIndex];
  const hasCompare = rounds.length > 1;
  const summaryText = hasCompare ? getSummaryText(rounds) : '';

  return (
    <>
      <div
        className={`grid gap-4 ${hasCompare ? 'sm:grid-cols-2' : 'sm:grid-cols-[minmax(0,1fr)]'}`}
      >
        <Photo
          label="첫 기록 사진"
          round={first}
          roundNo={1}
          onView={onView}
        />
        {hasCompare && (
          <Photo
            label="최근 사진"
            round={last}
            roundNo={lastIndex + 1}
            diffFrom={first}
            isRecent
            onView={onView}
          />
        )}
      </div>
      {summaryText && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-[10px] bg-surface-2 px-4 py-3">
          <p>{summaryText}</p>
          <MoreLink to={DIARY_OBS_PATH}>회차별 기록 보기</MoreLink>
        </div>
      )}
    </>
  );
}

function Photo({ label, round, roundNo, diffFrom, isRecent = false, onView }) {
  const diff =
    diffFrom && round.obsvSizeMm !== null && diffFrom.obsvSizeMm !== null
      ? formatDiff(round.obsvSizeMm - diffFrom.obsvSizeMm)
      : '';

  return (
    <div>
      <button
        type="button"
        disabled={!round.photoPath}
        aria-label={`${label} 원본 보기`}
        className={`grid h-48 w-full cursor-zoom-in place-items-center overflow-hidden rounded-[10px] border border-dashed bg-surface-2 text-subtle disabled:cursor-default ${
          isRecent ? 'border-solid border-brand-500' : 'border-line-strong'
        }`}
        onClick={() => onView(round.photoPath)}
      >
        {round.photoPath ? (
          <img
            src={round.photoPath}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <span className="flex flex-col items-center gap-1.5">
            <Icon name="image" className="text-[52px] text-line-strong" />
            {label}
          </span>
        )}
      </button>
      <div className="mt-2 text-center">
        <p className="text-sm/[1.6] text-subtle">
          {formatDate(round.obsvYmd)} · {roundNo}회차
        </p>
        {round.obsvSizeMm !== null && (
          <p className="text-lg/[1.6] font-semibold">
            {formatSize(round.obsvSizeMm)}
            {diff && (
              <span className="ml-1 text-sm/[1.6] font-normal text-muted">
                {diff}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

/** "16일 동안 ▲0.5mm 커짐" / 크기가 없으면 "16일 동안 커짐" / 둘 다 없으면 빈 문자열 */
function getSummaryText(rounds) {
  const first = rounds[0];
  const last = rounds[rounds.length - 1];
  const days = diffDays(first.obsvYmd, last.obsvYmd);
  if (first.obsvSizeMm !== null && last.obsvSizeMm !== null) {
    const diff = last.obsvSizeMm - first.obsvSizeMm;
    const diffText = formatDiff(diff);
    if (!diffText) return `${days}일 동안 변화 없음`;
    return `${days}일 동안 ${diffText}mm ${diff > 0 ? '커짐' : '작아짐'}`;
  }
  const changeRound = [...rounds].reverse().find((round) => round.obsvChgCd);
  return changeRound
    ? `${days}일 동안 ${findObservationChange(changeRound.obsvChgCd).nm}`
    : '';
}
