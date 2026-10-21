import { useState } from 'react';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import ReceiptUploadModal from '@/features/ai/receipt/ReceiptUploadModal';

const ONE_PET = [{ petSn: 1, petNm: '초코' }];
const TWO_PETS = [
  { petSn: 1, petNm: '초코', vrtyNm: '말티즈' },
  { petSn: 2, petNm: '뭉치', vrtyNm: '코리안 숏헤어' },
];

/**
 * SCR-AIM-008 확인용 DEV 전용 페이지
 * 건강 일지(SCR-HLT-002, JAJ)가 모달을 열게 되면 이 페이지와 라우트를 지운다
 */
export default function ReceiptUploadDevPage() {
  const [pets, setPets] = useState(TWO_PETS);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="py-6">
      <h1 className="mb-2 text-page font-bold tracking-[-0.02em]">
        영수증 업로드 모달 확인
      </h1>
      <p className="mb-4 text-sm text-muted">
        파일 이름에 slow(20초)·error(오류)·fail(추출 0건)·partial(일부만 인식)을 넣으면 해당 상황이
        나와요
      </p>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setPets(ONE_PET)}
          className={pets === ONE_PET ? BTN_PRIMARY : BTN_SECONDARY}
        >
          반려동물 1마리
        </button>
        <button
          type="button"
          onClick={() => setPets(TWO_PETS)}
          className={pets === TWO_PETS ? BTN_PRIMARY : BTN_SECONDARY}
        >
          반려동물 2마리
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={BTN_PRIMARY}
        >
          영수증으로 등록하기
        </button>
      </div>
      {message && (
        <pre className="rounded-box bg-surface-2 p-3 text-sm whitespace-pre-wrap">
          {message}
        </pre>
      )}
      {isOpen && (
        <ReceiptUploadModal
          pets={pets}
          defaultPetSn={pets[0].petSn}
          onRecognized={(result) => {
            setMessage(JSON.stringify(result, null, 2));
            setIsOpen(false);
          }}
          onManualInput={(options) => {
            setMessage(`직접 입력으로 전환
${JSON.stringify(options)}`);
            setIsOpen(false);
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
