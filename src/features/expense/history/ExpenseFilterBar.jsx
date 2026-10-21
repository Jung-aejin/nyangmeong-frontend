import Select from '@/components/Select';
import {
  EXPND_CLSF_LIST,
  FILTER_ALL,
  FILTER_SHARED,
  PET_STTS,
  SORT,
} from '../shared/expenseCodes';
import { getPetFilterLabel } from '../shared/expenseFormat';

const SORT_OPTIONS = [
  { value: SORT.LATEST, label: '최신순' },
  { value: SORT.AMOUNT, label: '금액순' },
];

const CATEGORY_OPTIONS = [
  { value: FILTER_ALL, label: '전체 카테고리' },
  ...EXPND_CLSF_LIST.map((clsf) => ({ value: clsf.code, label: clsf.name })),
];

/** 필터 선택지 (조회·삭제 전용 항목 포함) */
const getPetOptions = (pets) => {
  const activePets = pets.filter((pet) => pet.petStts === PET_STTS.ACTIVE);
  const removedPets = pets.filter((pet) => pet.petStts !== PET_STTS.ACTIVE);
  return [
    { value: FILTER_ALL, label: '전체 반려동물' },
    ...activePets.map((pet) => ({
      value: String(pet.petSn),
      label: getPetFilterLabel(pet),
    })),
    { value: FILTER_SHARED, label: '공용' },
    ...removedPets.map((pet) => ({
      value: String(pet.petSn),
      label: getPetFilterLabel(pet),
    })),
  ];
};

/** children: 오른쪽 끝 편집 버튼 */
export default function ExpenseFilterBar({
  pets,
  petFilter,
  categoryFilter,
  sort,
  hasSort,
  onChangePet,
  onChangeCategory,
  onChangeSort,
  children,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        label="반려동물 필터"
        value={petFilter}
        options={getPetOptions(pets)}
        onChange={onChangePet}
        className="w-44"
      />
      <Select
        label="카테고리 필터"
        value={categoryFilter}
        options={CATEGORY_OPTIONS}
        onChange={onChangeCategory}
        className="w-44"
      />
      <div className="ml-auto flex items-center gap-2">
        {hasSort && (
          <Select
            label="정렬"
            value={sort}
            options={SORT_OPTIONS}
            onChange={onChangeSort}
            className="w-32"
          />
        )}
        {children}
      </div>
    </div>
  );
}
