import { Plus } from 'lucide-react';
import { useState } from 'react';
import { showToast } from '@/components/toastStore';
import PetDeleteDialog from '@/features/pet/list/PetDeleteDialog';
import PetEmpty from '@/features/pet/list/PetEmpty';
import PetFormModal from '@/features/pet/list/PetFormModal';
import PetSlide from '@/features/pet/list/PetSlide';
import { MAX_OWN_PETS, PET_REL } from '@/features/pet/shared/petCodes';
import { usePets } from '@/features/pet/queries';

export default function PetListPage() {
  const { data: pets = [], isPending } = usePets();
  const [slideIndex, setSlideIndex] = useState(0);
  /** undefined: 닫힘, null: 등록, 숫자: 해당 petSn 수정 */
  const [modalPetSn, setModalPetSn] = useState(undefined);
  const [deletingPet, setDeletingPet] = useState(null);

  /** 삭제로 위치가 끝을 넘으면 마지막 동물 표시 */
  const currentIndex = Math.min(slideIndex, Math.max(pets.length - 1, 0));
  const ownPetCount = pets.filter(
    (pet) => pet.petRelCd === PET_REL.OWNER,
  ).length;
  const isFull = ownPetCount >= MAX_OWN_PETS;
  const showPreparing = () => showToast('준비 중인 기능이에요');

  return (
    <div className="mx-auto max-w-5xl py-6">
      <h1 className="mb-6 text-page font-bold tracking-[-0.02em]">
        반려동물 관리
      </h1>
      {isPending ? null : pets.length === 0 ? (
        <PetEmpty onRegister={() => setModalPetSn(null)} />
      ) : (
        <PetSlide
          pets={pets}
          index={currentIndex}
          onMove={setSlideIndex}
          onEdit={(pet) => setModalPetSn(pet.petSn)}
          onDelete={setDeletingPet}
          onUnlink={showPreparing}
          onInvite={showPreparing}
          action={
            <button
              type="button"
              onClick={() => setModalPetSn(null)}
              disabled={isFull}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-line-strong"
            >
              <Plus className="size-[18px]" />
              반려동물 등록
            </button>
          }
        />
      )}
      {isFull && (
        <p className="mt-3 text-right text-sm text-subtle">
          반려동물은 최대 {MAX_OWN_PETS}마리까지 등록할 수 있어요
        </p>
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
