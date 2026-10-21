/**
 * [반려동물 선택 칩]
 * - 서버가 반려동물을 정하지 못해 되물을 때 표시
 * - 누르면 이름을 다음 메시지로 전송
 */
export default function PetChoiceChips({ pets, isDisabled, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 pl-12">
      {pets.map((pet) => (
        <button
          key={pet.petSn}
          type="button"
          disabled={isDisabled}
          className="h-9 rounded-full border border-[#e2e7e7] bg-white px-4 text-base text-[#3d4a4b] enabled:hover:bg-[#f4f6f6] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => onSelect(pet.petNm)}
        >
          {pet.petNm}
        </button>
      ))}
    </div>
  );
}
