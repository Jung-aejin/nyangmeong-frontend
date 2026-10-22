import CharacterCard from './CharacterCard';

/** 캐릭터 카드 그리드: 5열(좁으면 3·2열) */
export default function CharacterGrid({ pets, mode, ...handlers }) {
  return (
    <div className="grid grid-cols-2 gap-4 min-[600px]:grid-cols-3 min-[1101px]:grid-cols-5">
      {pets.map((pet, index) => (
        <CharacterCard
          key={pet.petSn}
          pet={pet}
          mode={mode}
          toneIndex={index}
          {...handlers}
        />
      ))}
    </div>
  );
}
