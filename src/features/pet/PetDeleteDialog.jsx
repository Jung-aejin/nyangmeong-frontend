import { showToast } from '@/components/toastStore';
import { useDeletePet } from './queries';

// 이름은 영문·숫자·특수문자로 끝날 수 있어, 완성형 한글이 아니면 받침을 알 수 없어 "을(를)"을 쓴다
const withObjectParticle = (name) => {
  const code = name.charCodeAt(name.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return `${name}을(를)`;
  return `${name}${code % 28 === 0 ? '를' : '을'}`;
};

export default function PetDeleteDialog({ pet, onClose }) {
  const deletePet = useDeletePet();

  const handleDelete = () =>
    deletePet.mutate(pet.petSn, {
      onSuccess: onClose,
      onError: () => showToast('삭제하지 못했어요. 잠시 후 다시 시도해 주세요'),
    });

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <p className="text-center font-semibold">
          {withObjectParticle(pet.petNm)} 삭제하시겠습니까?
        </p>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border py-2"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deletePet.isPending}
            className="flex-1 rounded-lg bg-red-600 py-2 font-semibold text-white disabled:opacity-50"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
