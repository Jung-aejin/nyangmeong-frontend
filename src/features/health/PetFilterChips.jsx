// 표시 반려동물 필터(FN-HLT-003-39). 반려동물 선택 탭과 별개로 캘린더·인라인 상세·다가오는 일정에만 쓴다
export default function PetFilterChips({ pets, selectedPetSns, onChange }) {
  if (pets.length <= 1) return null;

  const isAllSelected = selectedPetSns.length === pets.length;

  // [전체] 상태에서는 칩이 꺼져 보이므로, 누른 반려동물만 고르는 것으로 받는다. 마지막 1마리는 해제되지 않는다
  const handleToggle = (petSn) => {
    if (isAllSelected) {
      onChange([petSn]);
      return;
    }
    if (!selectedPetSns.includes(petSn)) {
      onChange([...selectedPetSns, petSn]);
      return;
    }
    if (selectedPetSns.length === 1) return;
    onChange(selectedPetSns.filter((sn) => sn !== petSn));
  };

  const chipClass = (isSelected) =>
    `inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-base ${
      isSelected
        ? 'border-[#285a5c] bg-[#285a5c] text-white'
        : 'border-[#e2e7e7] bg-white text-[#3d4a4b] hover:border-[#b9c4c4] hover:text-[#1a3234]'
    }`;

  return (
    <div
      role="group"
      aria-label="표시 반려동물"
      className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-[#edf1f1] pb-4"
    >
      <button
        type="button"
        aria-pressed={isAllSelected}
        className={chipClass(isAllSelected)}
        onClick={() => onChange(pets.map((pet) => pet.petSn))}
      >
        전체
      </button>
      <span
        aria-hidden="true"
        className="mx-2 my-1 self-stretch border-l border-[#b9c4c4]"
      />
      {pets.map((pet) => {
        const isSelected = !isAllSelected && selectedPetSns.includes(pet.petSn);
        return (
          <button
            key={pet.petSn}
            type="button"
            aria-pressed={isSelected}
            className={chipClass(isSelected)}
            onClick={() => handleToggle(pet.petSn)}
          >
            {pet.petNm}
          </button>
        );
      })}
    </div>
  );
}
