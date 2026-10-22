import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageSkeleton from '@/components/PageSkeleton';
import Skeleton from '@/components/Skeleton';
import SkeletonCard from '@/components/SkeletonCard';
import InviteModal from '@/features/pet/list/InviteModal';
import PetDeleteDialog from '@/features/pet/list/PetDeleteDialog';
import PetEmpty from '@/features/pet/list/PetEmpty';
import PetFormModal from '@/features/pet/list/PetFormModal';
import PetSlide from '@/features/pet/list/PetSlide';
import PetUnlinkDialog from '@/features/pet/list/PetUnlinkDialog';
import SentInvitations from '@/features/pet/list/SentInvitations';
import { MAX_OWN_PETS, PET_REL } from '@/features/pet/shared/petCodes';
import { usePets } from '@/features/pet/queries';
import SubPageLayout from '@/layouts/SubPageLayout';

export default function PetListPage() {
  const { data: pets = [], isPending } = usePets();
  /** 초대 수락 직후 보여 줄 동물 */
  const focusPetSn = useLocation().state?.petSn;
  const [slideIndex, setSlideIndex] = useState(null);
  /** undefined: 닫힘, null: 등록, 숫자: 해당 petSn 수정 */
  const [modalPetSn, setModalPetSn] = useState(undefined);
  const [deletingPet, setDeletingPet] = useState(null);
  const [unlinkingPet, setUnlinkingPet] = useState(null);
  const [invitingPet, setInvitingPet] = useState(null);

  const focusIndex = pets.findIndex((pet) => pet.petSn === focusPetSn);
  /** 삭제로 위치가 끝을 넘으면 마지막 동물 표시 */
  const currentIndex = Math.min(
    slideIndex ?? Math.max(focusIndex, 0),
    Math.max(pets.length - 1, 0),
  );
  const ownPetCount = pets.filter(
    (pet) => pet.petRelCd === PET_REL.OWNER,
  ).length;
  const isFull = ownPetCount >= MAX_OWN_PETS;

  return (
    <SubPageLayout section="mypage">
      {isPending ? (
        <PageSkeleton>
          <div
            aria-hidden="true"
            className="flex items-center justify-between gap-3"
          >
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <SkeletonCard className="h-[583px] max-[760px]:h-[987px]" />
          <div aria-hidden="true" className="mt-7 flex flex-col gap-5">
            <Skeleton className="h-7 w-32" />
            <SkeletonCard className="h-[395px] max-[760px]:h-[635px]" />
          </div>
        </PageSkeleton>
      ) : pets.length === 0 ? (
        <PetEmpty onRegister={() => setModalPetSn(null)} />
      ) : (
        <PetSlide
          pets={pets}
          index={currentIndex}
          onMove={setSlideIndex}
          onEdit={(pet) => setModalPetSn(pet.petSn)}
          onDelete={setDeletingPet}
          onUnlink={setUnlinkingPet}
          onInvite={setInvitingPet}
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
      {!isPending && <SentInvitations />}
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
      {invitingPet && (
        <InviteModal
          pets={pets}
          initialPetSn={invitingPet.petSn}
          onClose={() => setInvitingPet(null)}
        />
      )}
      {unlinkingPet && (
        <PetUnlinkDialog
          pet={unlinkingPet}
          onClose={() => setUnlinkingPet(null)}
        />
      )}
    </SubPageLayout>
  );
}
