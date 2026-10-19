import { PawPrint } from 'lucide-react';

export default function PetEmpty({ onRegister }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <PawPrint className="size-10 text-gray-400" />
      <p className="font-semibold">아직 등록된 반려동물이 없어요</p>
      <p className="text-sm text-gray-500">
        반려동물을 등록하고 건강 관리를 시작해 보세요
      </p>
      <button
        type="button"
        onClick={onRegister}
        className="mt-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
      >
        ＋ 반려동물 등록
      </button>
    </div>
  );
}
