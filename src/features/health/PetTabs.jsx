// 반려동물 선택 탭(FN-HLT-003-01). 건강 일지·종합 건강기록에서도 같이 쓴다
// 캐릭터 이미지는 pet 캐릭터 이미지 조회(LJS)가 생기기 전이라 이름 첫 글자로 자리를 채운다
export default function PetTabs({
  pets,
  selectedPetSn,
  onSelect,
  label = '반려동물 선택 (토탈 케어리스트)',
}) {
  if (pets.length <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex flex-wrap gap-2"
    >
      {pets.map((pet) => {
        const isSelected = pet.petSn === selectedPetSn;
        return (
          <button
            key={pet.petSn}
            type="button"
            role="tab"
            aria-selected={isSelected}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full border pr-3.5 pl-1 text-base/[1.6] font-normal ${
              isSelected
                ? 'border-[#285a5c] bg-[#285a5c] text-white'
                : 'border-[#e2e7e7] bg-white text-[#3d4a4b] hover:bg-[#f4f6f6]'
            }`}
            onClick={() => onSelect(pet.petSn)}
          >
            <span
              aria-hidden="true"
              className={`grid size-7 place-items-center overflow-hidden rounded-full border border-[#e2e7e7] text-sm font-bold text-[#285a5c] ${
                isSelected ? 'bg-white' : 'bg-[#f4f6f6]'
              }`}
            >
              {pet.chrctrImgPath ? (
                <img
                  src={pet.chrctrImgPath}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                pet.petNm.slice(0, 1)
              )}
            </span>
            {pet.petNm}
            <span className={isSelected ? 'text-white' : 'text-[#667374]'}>
              {pet.petSpcsCdNm}
            </span>
          </button>
        );
      })}
    </div>
  );
}
