import { Cat, Dog } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BarChart from '@/components/BarChart';
import CurveChart from '@/components/CurveChart';
import AiReportCard from '@/features/dashboard/AiReportCard';
import {
  LAB_LABELS,
  LAB_RANGE,
  WEEK_LABELS,
  getDashboardSample,
} from '@/features/dashboard/dashboardSample';
import HealthSummary from '@/features/dashboard/HealthSummary';
import HealthWidget from '@/features/dashboard/HealthWidget';
import HeroAsk from '@/features/dashboard/HeroAsk';
import MissionList from '@/features/dashboard/MissionList';
import PetProfileCard from '@/features/pet/PetProfileCard';
import { PET_SE } from '@/features/pet/petCodes';
import { getVrtyName } from '@/features/pet/petFormat';
import { usePets } from '@/features/pet/queries';
import { PATHS } from '@/routes/paths';

const WEEK_PERIOD = '최근 5주';
const WEEK_DELTA = '지난주 대비';

const joinSeries = (series, labels, unit) =>
  series.map((v, i) => `${labels[i]} ${v}${unit}`).join(', ');

function PetChip({ pet, isSelected, onSelect }) {
  const Icon = pet.petSeCd === PET_SE.CAT ? Cat : Dog;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(pet)}
      className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 font-semibold ${isSelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-line bg-white text-ink-2 hover:border-line-strong'}`}
    >
      <Icon className="size-4" aria-hidden="true" />
      {pet.petNm}
    </button>
  );
}

export default function MainPage() {
  const { data: pets = [] } = usePets();
  const [selectedPetSn, setSelectedPetSn] = useState(null);

  const representativePet = pets.find((pet) => pet.rprsYn === 'Y') ?? pets[0];
  const selectedIndex = Math.max(
    pets.findIndex((pet) => pet.petSn === selectedPetSn),
    0,
  );
  const selectedPet = pets[selectedIndex];
  const sample = getDashboardSample(selectedIndex);
  const { weight, meal, water, walk, lab } = sample.widgets;

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <section
        aria-labelledby="main-title"
        className="flex flex-col items-center px-4 pt-6 pb-16 text-center"
      >
        <h1 id="main-title" className="sr-only">
          냥멍케어 메인 AI 매니저
        </h1>
        {representativePet && (
          <p className="mb-2 text-muted">
            <b className="text-ink">{representativePet.petNm}</b>
            {getVrtyName(representativePet) &&
              ` (${getVrtyName(representativePet)})`}
          </p>
        )}
        <HeroAsk petNm={representativePet?.petNm ?? '우리 아이'} />
      </section>

      {selectedPet ? (
        <>
          <section aria-label="반려동물 프로필">
            {pets.length > 1 && (
              <div
                role="radiogroup"
                aria-label="반려동물 선택"
                className="mb-3 flex flex-wrap gap-2"
              >
                {pets.map((pet) => (
                  <PetChip
                    key={pet.petSn}
                    pet={pet}
                    isSelected={pet.petSn === selectedPet.petSn}
                    onSelect={(next) => setSelectedPetSn(next.petSn)}
                  />
                ))}
              </div>
            )}
            <div className="grid rounded-card border border-line bg-white shadow-depth-sm min-[1101px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <PetProfileCard pet={selectedPet} />
              <HealthSummary exam={sample.exam} lab={lab} rx={sample.rx} />
            </div>
          </section>

          <div className="mt-10 mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold">건강기록 통합대시보드</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
            <AiReportCard petNm={selectedPet.petNm} report={sample.report} />
            <HealthWidget
              title="체중"
              period={WEEK_PERIOD}
              value={weight.value}
              unit="kg"
              delta={weight.delta}
              deltaLabel={WEEK_DELTA}
              deltaUnit="kg"
            >
              <CurveChart
                values={weight.series}
                labels={WEEK_LABELS}
                formatValue={(v) => `${v}kg`}
                label={`체중 변화 곡선 그래프 · ${joinSeries(weight.series, WEEK_LABELS, 'kg')}`}
              />
            </HealthWidget>
            <HealthWidget
              title="식사량"
              period={WEEK_PERIOD}
              value={meal.value}
              unit="g / 1일"
              delta={meal.delta}
              deltaLabel={WEEK_DELTA}
              deltaUnit="g"
            >
              <CurveChart
                values={meal.series}
                labels={WEEK_LABELS}
                formatValue={(v) => `${v}g`}
                label={`식사량 변화 곡선 그래프 · ${joinSeries(meal.series, WEEK_LABELS, 'g')}`}
              />
            </HealthWidget>
            <HealthWidget
              title="음수량"
              period={WEEK_PERIOD}
              value={water.value}
              unit="ml / 1일"
              delta={water.delta}
              deltaLabel={WEEK_DELTA}
              deltaUnit="ml"
            >
              <CurveChart
                values={water.series}
                labels={WEEK_LABELS}
                formatValue={(v) => `${v}ml`}
                label={`음수량 변화 곡선 그래프 · ${joinSeries(water.series, WEEK_LABELS, 'ml')}`}
              />
            </HealthWidget>
            <HealthWidget
              title="산책"
              period={WEEK_PERIOD}
              value={walk.value}
              unit="분 / 1일"
              delta={walk.delta}
              deltaLabel={WEEK_DELTA}
              deltaUnit="분"
            >
              <BarChart
                values={walk.series}
                labels={WEEK_LABELS}
                label={`산책 시간 막대그래프 · ${joinSeries(walk.series, WEEK_LABELS, '분')} · 점선은 평균`}
              />
            </HealthWidget>
            <HealthWidget
              title="혈액검사 · CREA"
              period="최근 5회"
              value={lab.value}
              unit="mg/dL"
              delta={lab.delta}
              deltaLabel="지난 검사 대비"
              deltaUnit=""
            >
              <CurveChart
                values={lab.series}
                labels={LAB_LABELS}
                band={LAB_RANGE}
                label={`CREA 수치 변화 곡선 그래프 · 참고범위 ${LAB_RANGE[0]}~${LAB_RANGE[1]} 점선 표시 · ${joinSeries(lab.series, LAB_LABELS, '')} mg/dL`}
              />
            </HealthWidget>
          </div>

          <MissionList missions={sample.missions} />

          <p className="mt-8 flex justify-center">
            <Link
              to={PATHS.HEALTH}
              className="inline-flex h-[46px] items-center rounded-md bg-brand-500 px-8 font-semibold text-white hover:bg-brand-600"
            >
              통합대시보드 전체 보기
            </Link>
          </p>
        </>
      ) : (
        <p className="text-center text-muted">
          등록된 반려동물이 없어요.{' '}
          <Link
            to={PATHS.MYPAGE_PETS}
            className="font-semibold text-brand-600 underline"
          >
            반려동물 등록하기
          </Link>
        </p>
      )}
    </div>
  );
}
