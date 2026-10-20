import Select from '@/components/Select';
import {
  EXPND_CLSF_LIST,
  FILTER_ALL,
  FILTER_SHARED,
  PET_STTS,
  SORT,
} from './expenseCodes';
import { getPetFilterLabel } from './expenseFormat';

const SORT_OPTIONS = [
  { value: SORT.LATEST, label: '최신순' },
  { value: SORT.AMOUNT, label: '금액순' },
];

const CATEGORY_OPTIONS = [
  { value: FILTER_ALL, label: '전체 카테고리' },
  ...EXPND_CLSF_LIST.map((clsf) => ({ value: clsf.code, label: clsf.name })),
];

// 현재 연동 중인 동물, 공용, 연동 해제·삭제된 동물 순이다. 뒤의 둘은 조회·삭제에만 쓴다
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

// children은 오른쪽 끝에 놓인다(편집 버튼). 편집 중에는 정렬을 보이지 않는다
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
