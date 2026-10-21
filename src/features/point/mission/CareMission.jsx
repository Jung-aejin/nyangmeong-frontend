import {
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Info,
  PawPrint,
} from 'lucide-react';
import { useState } from 'react';
import { BTN_PRIMARY } from '@/components/buttonStyles';
import { parseYmd, toYmd } from '@/utils/formatDate';
import { useCareMissions } from '../queries';
import { formatPoint, getPercent, sumPoint } from '../shared/pointFormat';
import { CARD, CARD_HEAD, CARD_TITLE, NAV_BUTTON } from '../shared/pointStyles';

const shiftYmd = (ymd, delta) => {
  const date = parseYmd(ymd);
  date.setDate(date.getDate() + delta);
  return toYmd(date);
};

const TAB =
  'inline-flex h-10 items-center gap-2 rounded-full border px-4 font-semibold';

/** 주양육 동물이 없을 때 케어미션 영역을 대신하는 등록 유도 */
function MissionEmpty({ onRegister }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand-500">
        <PawPrint className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-4 text-lg font-bold">
        반려동물을 등록하면 케어미션을 받을 수 있어요
      </p>
      <p className="mt-1 text-muted">
        케어미션은 주양육자로 등록한 반려동물에게만 주어져요
      </p>
      <button
        type="button"
        onClick={onRegister}
        className={`${BTN_PRIMARY} mt-4`}
      >
        반려동물 등록하기
      </button>
    </div>
  );
}

function MissionPanel({ pet }) {
  const doneList = pet.missions.filter((mission) => mission.cmplYn === 'Y');
  const restList = pet.missions.filter((mission) => mission.cmplYn !== 'Y');
  const percent = getPercent(doneList.length, pet.missions.length);

  return (
    <div>
      <div className="rounded-box bg-surface-2 px-5 pt-[22px] pb-4">
        <div className="flex items-baseline justify-between">
          <b className="text-[32px] leading-[1.2]">
            {doneList.length}
            <small className="text-base font-semibold text-muted">
              {' '}
              / {pet.missions.length} 완료
            </small>
          </b>
          <span className="text-xl font-bold text-brand-600">{percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-label={`${pet.petNm} 진행률`}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface-3"
        >
          <div
            className="h-full bg-brand-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
          <span>
            오늘 획득{' '}
            <b className="text-brand-600">+{formatPoint(sumPoint(doneList))}</b>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            남은 미션 {restList.length}개 (+{formatPoint(sumPoint(restList))})
          </span>
        </p>
      </div>
      <ul className="mt-2">
        {pet.missions.map((mission) => {
          const isDone = mission.cmplYn === 'Y';
          return (
            <li
              key={mission.msnSn}
              className={`flex min-h-14 items-center gap-3 border-t border-line-soft first:border-t-0 ${isDone ? 'text-ink' : 'text-muted'}`}
            >
              <span className="min-w-0 flex-1 font-semibold">
                {mission.msnNm}
              </span>
              <span
                className={`text-sm font-medium ${isDone ? 'text-brand-600' : 'text-subtle'}`}
              >
                +{formatPoint(mission.msnPnt)}
              </span>
              <span
                className={`inline-flex h-6 min-w-16 items-center justify-center rounded-full px-2.5 text-badge font-semibold ${isDone ? 'bg-tone-green-bg text-tone-green-fg' : 'bg-tone-gray-bg text-tone-gray-fg'}`}
              >
                {isDone ? '완료' : '미완료'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** todayYmd: 날짜 이동의 오른쪽 끝(미래는 조회하지 않음) */
export default function CareMission({ todayYmd, onRegister }) {
  const [ymd, setYmd] = useState(todayYmd);
  const [selectedPetSn, setSelectedPetSn] = useState(null);
  const { data } = useCareMissions(ymd);

  if (!data) return null;

  const pets = data.pets;
  const pet = pets.find((item) => item.petSn === selectedPetSn) ?? pets[0];

  return (
    <section
      id="care-mission"
      aria-labelledby="care-mission-title"
      className={CARD}
    >
      <div className={CARD_HEAD}>
        <h2 id="care-mission-title" className={CARD_TITLE}>
          <CircleCheckBig
            className="size-5 text-brand-500"
            aria-hidden="true"
          />
          오늘의 케어미션
        </h2>
        {pet && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setYmd(shiftYmd(ymd, -1))}
              aria-label="이전 날짜"
              className={NAV_BUTTON}
            >
              <ChevronLeft className="size-5" />
            </button>
            <b>{ymd}</b>
            {ymd === todayYmd && (
              <span className="inline-flex h-6 items-center rounded-full bg-brand-50 px-2.5 text-badge font-semibold text-brand-600">
                오늘
              </span>
            )}
            <button
              type="button"
              onClick={() => setYmd(shiftYmd(ymd, 1))}
              disabled={ymd >= todayYmd}
              aria-label="다음 날짜"
              className={NAV_BUTTON}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>
      {pet ? (
        <div className="px-[22px] pt-5 pb-[22px]">
          <div
            role="group"
            aria-label="반려동물 선택"
            className="mb-4 flex flex-wrap gap-2"
          >
            {pets.map((item) => {
              const isSelected = item.petSn === pet.petSn;
              const doneCount = item.missions.filter(
                (mission) => mission.cmplYn === 'Y',
              ).length;
              return (
                <button
                  key={item.petSn}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedPetSn(item.petSn)}
                  className={`${TAB} ${isSelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-line bg-white hover:border-line-strong'}`}
                >
                  {item.petNm}
                  <span
                    className={`text-sm ${isSelected ? 'text-brand-100' : 'text-subtle'}`}
                  >
                    {doneCount}/{item.missions.length}
                  </span>
                </button>
              );
            })}
          </div>
          <MissionPanel pet={pet} />
          <p className="mt-2 flex items-center gap-2 text-sm text-subtle">
            <Info className="size-4 shrink-0" aria-hidden="true" />
            미완료 미션은 자정에 진행률만큼 정산돼요
          </p>
        </div>
      ) : (
        <MissionEmpty onRegister={onRegister} />
      )}
    </section>
  );
}
