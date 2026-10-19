// 반려동물 선택 탭(FN-HLT-003-01). 건강 일지·종합 건강기록에서도 같이 쓴다
// 캐릭터 이미지는 pet 캐릭터 이미지 조회(LJS)가 생기기 전이라 이름 첫 글자로 자리를 채운다
export default function PetTabs({ pets, selectedPetSn, onSelect }) {
  if (pets.length <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="반려동물 선택 (토탈 케어리스트)"
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
            className={`inline-flex h-9 items-center gap-1.5 rounded-full border pr-3.5 pl-1 text-base ${
              isSelected
                ? 'border-[#285a5c] bg-[#285a5c] font-semibold text-white'
                : 'border-[#e2e7e7] bg-white text-[#1a3234] hover:bg-[#f4f6f6]'
            }`}
            onClick={() => onSelect(pet.petSn)}
          >
            {pet.chrctrImgPath ? (
              <img
                src={pet.chrctrImgPath}
                alt=""
                className="size-7 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className={`grid size-7 place-items-center rounded-full text-sm font-bold ${
                  isSelected
                    ? 'bg-white text-[#285a5c]'
                    : 'bg-[#f4f6f6] text-[#285a5c]'
                }`}
              >
                {pet.petNm.slice(0, 1)}
              </span>
            )}
            {pet.petNm}
            <span
              className={`text-sm font-normal ${
                isSelected ? 'text-white' : 'text-[#667374]'
              }`}
            >
              {pet.petSpcsCdNm}
            </span>
          </button>
        );
      })}
    </div>
  );
}
