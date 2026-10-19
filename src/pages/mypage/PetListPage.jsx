import { useState } from 'react';
import { showToast } from '@/components/toastStore';
import PetDeleteDialog from '@/features/pet/PetDeleteDialog';
import PetEmpty from '@/features/pet/PetEmpty';
import PetFormModal from '@/features/pet/PetFormModal';
import PetSlide from '@/features/pet/PetSlide';
import { MAX_OWN_PETS, PET_REL } from '@/features/pet/petCodes';
import { usePets } from '@/features/pet/queries';

export default function PetListPage() {
  const { data: pets = [], isPending } = usePets();
  const [slideIndex, setSlideIndex] = useState(0);
  // undefined: 닫힘, null: 등록, 숫자: 그 petSn 수정
  const [modalPetSn, setModalPetSn] = useState(undefined);
  const [deletingPet, setDeletingPet] = useState(null);

  // 삭제로 목록이 줄어 위치가 끝을 넘으면 마지막 동물을 보인다
  const currentIndex = Math.min(slideIndex, Math.max(pets.length - 1, 0));
  const ownPetCount = pets.filter(
    (pet) => pet.petRelCd === PET_REL.OWNER,
  ).length;
  const isFull = ownPetCount >= MAX_OWN_PETS;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">반려동물 관리</h1>
        <button
          type="button"
          onClick={() => setModalPetSn(null)}
          disabled={isFull}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:bg-gray-300"
        >
          ＋ 반려동물 등록
        </button>
      </div>
      {isFull && (
        <p className="mb-4 text-right text-sm text-gray-500">
          반려동물은 최대 {MAX_OWN_PETS}마리까지 등록할 수 있어요
        </p>
      )}
      {isPending ? null : pets.length === 0 ? (
        <PetEmpty onRegister={() => setModalPetSn(null)} />
      ) : (
        <PetSlide
          pets={pets}
          index={currentIndex}
          onMove={setSlideIndex}
          onEdit={(pet) => setModalPetSn(pet.petSn)}
          onDelete={setDeletingPet}
          onUnlink={() => showToast('준비 중인 기능이에요')}
        />
      )}
      {modalPetSn !== undefined && (
        <PetFormModal
          petSn={modalPetSn}
          onClose={() => setModalPetSn(undefined)}
        />
      )}
      {deletingPet && (
        <PetDeleteDialog
          pet={deletingPet}
          onClose={() => setDeletingPet(null)}
        />
      )}
    </div>
  );
}
