import { useState } from 'react';
import PetFormModal from '@/features/pet/PetFormModal';
import { usePets } from '@/features/pet/queries';

// 슬라이드·삭제 등 목록 화면(SCR-MYP-002)은 다음 마일스톤에서 채운다
export default function PetListPage() {
  const { data: pets = [] } = usePets();
  // undefined: 닫힘, null: 등록, 숫자: 그 petSn 수정
  const [modalPetSn, setModalPetSn] = useState(undefined);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">반려동물 관리</h1>
        <button
          type="button"
          onClick={() => setModalPetSn(null)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
        >
          ＋ 반려동물 등록
        </button>
      </div>
      <ul className="space-y-2">
        {pets.map((pet) => (
          <li
            key={pet.petSn}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <span>{pet.petNm}</span>
            <button
              type="button"
              onClick={() => setModalPetSn(pet.petSn)}
              className="rounded-lg border px-3 py-1"
            >
              수정
            </button>
          </li>
        ))}
      </ul>
      {modalPetSn !== undefined && (
        <PetFormModal
          petSn={modalPetSn}
          onClose={() => setModalPetSn(undefined)}
        />
      )}
    </div>
  );
}
