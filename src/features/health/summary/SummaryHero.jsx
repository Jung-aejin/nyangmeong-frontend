import { Link } from 'react-router-dom';
import Icon from '@/components/Icon';
import { PATHS } from '@/routes/paths';
import { diffDays, formatDate } from '@/utils/formatDate';
import { formatAge, getGndrName, getVrtyName } from '@/utils/petFormat';
import { DOSING } from '../checkup/checkupTypes';
import { countItems, formatRange } from './summaryUtils';

const REGISTER_PATH = `${PATHS.MYPAGE_PETS}?register=1`;

/**
 * [종합 건강기록 히어로]
 * - 반려동물 선택 탭 + 조회 기준일 + 요약 바 (FN-HLT-011-01·02)
 * - 탭은 반려동물이 2마리 이상일 때만, [반려동물 등록 ＞]은 항상 보임
 * - 캐릭터 이미지는 pet 캐릭터 이미지 조회(LJS) 전이라 없으면 이름 첫 글자로 채움
 */
export default function SummaryHero({
  pets,
  pet,
  summary,
  onSelect,
}) {
  const { profile, latestCheckup, lab, prescriptions } = summary;
  const firstLabItem = lab?.items[0];
  const dosing = prescriptions.filter((item) => item.dosSttsCd === DOSING);
  const allergyCount = countItems(profile.allrgCn);
  const diseaseCount = countItems(profile.undrlDiseCn);

  return (
    <section
      aria-label="종합 건강기록 요약"
      className="relative overflow-hidden rounded-[20px] bg-brand-500 px-5 py-6 text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] before:bg-size-[20px_20px] before:mask-[linear-gradient(105deg,transparent_35%,#000_75%)] before:content-[''] sm:px-10 sm:pt-9 sm:pb-8 [&>*]:relative [&>*]:z-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex flex-wrap items-center gap-2">
          {pets.length > 1 && (
            <div
              role="tablist"
              aria-label="반려동물 선택"
              className="flex flex-wrap gap-2"
            >
              {pets.map((item) => {
                const isSelected = item.petSn === pet.petSn;
                return (
                  <button
                    key={item.petSn}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`inline-flex h-10 items-center gap-2 rounded-full border pr-3.5 pl-[5px] font-semibold ${
                      isSelected
                        ? 'border-[#f9eaa6] bg-[#f9eaa6] text-ink'
                        : 'border-white/26 bg-white/12 hover:border-white/50'
                    }`}
                    onClick={() => onSelect(item.petSn)}
                  >
                    <PetImage
                      pet={item}
                      className={`size-[30px] ${isSelected ? 'bg-ink/10' : 'bg-white/18'}`}
                    />
                    {item.petNm}
                    <span
                      className={
                        isSelected ? 'font-medium text-ink/70' : 'font-medium text-[#dbe8e8]'
                      }
                    >
                      {item.petSpcsCdNm}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {pets.length > 1 && (
            <span
              aria-hidden="true"
              className="mx-2 my-1 self-stretch border-l border-white/26"
            />
          )}
          {pets.length > 1 ? (
            <Link
              to={REGISTER_PATH}
              className="inline-flex items-center gap-1 text-sm/[1.6] text-[#f9eaa6] underline underline-offset-4"
            >
              반려동물 등록
              <Icon name="chevron_right" className="text-[18px]" />
            </Link>
          ) : (
            <Link
              to={REGISTER_PATH}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f9eaa6] pr-3.5 pl-[5px] font-semibold text-[#f9eaa6] hover:bg-[#f9eaa6]/10"
            >
              <span
                aria-hidden="true"
                className="grid size-[30px] place-items-center rounded-full border border-[#f9eaa6] bg-[#f9eaa6]/20"
              >
                <Icon name="add" className="text-xl" />
              </span>
              반려동물 등록
            </Link>
          )}
        </div>
        <span className="inline-flex items-center gap-2 before:size-2 before:rounded-full before:bg-[#f9eaa6] before:shadow-[0_0_0_4px_rgba(249,234,166,0.25)] before:content-['']">
          {formatDate(summary.baseYmd)} 기준
          {summary.lastRecordYmd &&
            ` · 마지막 기록 ${formatDate(summary.lastRecordYmd)}`}
        </span>
      </div>

      <div className="mt-7 grid gap-4 min-[1101px]:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        <div className="flex items-start gap-4 rounded-[14px] border border-white/16 bg-[rgba(9,32,34,0.28)] p-5">
          <PetImage pet={pet} className="size-[76px]" isLarge />
          <div className="min-w-0">
            <p className="text-lg leading-none font-bold">{pet.petNm}</p>
            <p className="mt-1 text-[#dbe8e8]">
              {getVrtyName(profile)} ·{' '}
              {formatAge(profile.petBrdt, new Date(summary.baseYmd))} ·{' '}
              {getGndrName(profile)}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              <ProfileTag>{profile.wghtVal}kg</ProfileTag>
              {allergyCount > 0 && <ProfileTag>알레르기 {allergyCount}</ProfileTag>}
              {diseaseCount > 0 && <ProfileTag>기저질환 {diseaseCount}</ProfileTag>}
            </div>
          </div>
        </div>

        <div className="grid overflow-hidden rounded-[14px] border border-white/16 bg-[rgba(9,32,34,0.28)] max-sm:grid-cols-1 sm:grid-cols-3">
          <Stat
            icon="calendar_month"
            label="최근 검진"
            value={
              latestCheckup
                ? diffDays(latestCheckup.ckupYmd, summary.baseYmd)
                : null
            }
            unit="일 전"
            sub={
              latestCheckup &&
              `${formatDate(latestCheckup.ckupYmd)} · ${latestCheckup.hospNm}`
            }
          />
          <Stat
            icon="science"
            label={`검사 수치${firstLabItem ? ` · ${firstLabItem.inspItmNm}` : ''}`}
            value={firstLabItem?.rsltVal ?? null}
            unit={firstLabItem?.unitNm}
            sub={
              firstLabItem &&
              `참고범위 ${formatRange(firstLabItem.refMinVal, firstLabItem.refMaxVal, '~')}`
            }
          />
          <Stat
            icon="medication"
            label="현재 처방"
            value={dosing.length}
            unit="건"
            sub={
              dosing.length > 0 ? (
                <>
                  <span className="block">{dosing[0].medNm}</span>
                  <span className="block">복용 중</span>
                </>
              ) : (
                '복용 중인 처방 없음'
              )
            }
          />
        </div>
      </div>
    </section>
  );
}

function PetImage({ pet, className, isLarge = false }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center overflow-hidden ${
        isLarge
          ? 'rounded-[20px] bg-white text-sm leading-tight text-subtle'
          : 'rounded-full border border-line font-semibold'
      } ${className}`}
    >
      {pet.chrctrImgPath ? (
        <img src={pet.chrctrImgPath} alt="" className="size-full object-cover" />
      ) : (
        pet.petNm.slice(0, 1)
      )}
    </span>
  );
}

function ProfileTag({ children }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-white/26 px-2 text-[13px] font-semibold">
      {children}
    </span>
  );
}

function Stat({ icon, label, value, unit, sub }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 border-white/26 px-5 py-[18px] max-sm:border-t max-sm:first:border-t-0 sm:border-l sm:first:border-l-0">
      <span className="flex items-center gap-1.5 text-[#dbe8e8]">
        <Icon name={icon} className="text-xl" />
        {label}
      </span>
      <span className="text-[30px] leading-[1.1] font-bold tracking-[-0.02em] [&_small]:leading-[1.1]">
        {value ?? '-'}
        {value != null && unit && (
          <small className="ml-[3px] text-base font-semibold text-[#dbe8e8]">
            {unit}
          </small>
        )}
      </span>
      <span className="leading-[1.45] text-[#dbe8e8]">{sub ?? '등록된 기록 없음'}</span>
    </div>
  );
}
