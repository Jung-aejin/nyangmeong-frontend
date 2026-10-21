import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import { showToast } from '@/components/toastStore';
import { PATHS } from '@/routes/paths';
import { formatDate, getDay, getMonth, getTodayYmd } from '@/utils/formatDate';
import { useCreateCheckup, useFindNearSchedule } from '../queries';
import { CHECKUP_TYPES } from '../scheduleTypes';
import FieldError from './FieldError';
import FormModal from './FormModal';
import {
  INPUT_CLASS,
  LABEL_CLASS,
  SELECT_ARROW_STYLE,
  SELECT_CLASS,
  TEXTAREA_CLASS,
} from './formStyles';

const MAX_HOSPITAL_NAME_LENGTH = 50;
const MAX_CONTENT_LENGTH = 500;
const MAX_MEMO_LENGTH = 200;

const REQUIRED = <span className="ml-0.5 font-bold text-[#b4473a]">*</span>;
const OPTIONAL = (
  <span className="ml-1 text-[13px] font-medium text-[#667374]">선택</span>
);

/** "9/12" */
const formatMonthDaySlash = (ymd) => `${getMonth(ymd)}/${getDay(ymd)}`;

const findCheckupTypeNm = (cd) =>
  CHECKUP_TYPES.find((type) => type.cd === cd)?.nm;

/**
 * [검진기록 등록 모달]
 * - 1단계 방법 선택 → 직접 입력 (FN-HLT-002-33·26~31). 영수증 등록은 따로 만듦
 * - 저장하면 같은 날 병원 일정에 연결하고, 없고 앞뒤 7일 안에 예정 일정이 있으면 옮겨 연결할지 먼저 확인
 * - 저장 뒤 새 검진기록의 검진상세로 이동
 */
export default function CheckupModal({ pets, defaultPetSn, onClose }) {
  const navigate = useNavigate();
  const onlyPetSn = pets.length === 1 ? pets[0].petSn : null;
  const [step, setStep] = useState('select');
  const [petSn, setPetSn] = useState(onlyPetSn ?? defaultPetSn);
  const [ckupYmd, setCkupYmd] = useState(getTodayYmd);
  const [hospNm, setHospNm] = useState('');
  const [ckupTypeCd, setCkupTypeCd] = useState('');
  const [ckupCn, setCkupCn] = useState('');
  const [ckupMemoCn, setCkupMemoCn] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [nearSchedule, setNearSchedule] = useState(null);
  const findNearSchedule = useFindNearSchedule();
  const createCheckup = useCreateCheckup();
  const isPending = findNearSchedule.isPending || createCheckup.isPending;

  const errors = {
    pet: petSn == null,
    date: ckupYmd === '',
    hosp: hospNm.trim() === '',
    type: ckupTypeCd === '',
  };
  const isInvalid = (field) => isSubmitted && errors[field];

  const save = (nearSchdlSn) =>
    createCheckup.mutate(
      {
        petSn,
        ckupYmd,
        hospNm: hospNm.trim(),
        ckupTypeCd,
        ckupCn: ckupCn.trim(),
        ckupMemoCn: ckupMemoCn.trim(),
        nearSchdlSn,
      },
      {
        onSuccess: (checkup) => {
          onClose();
          navigate(
            generatePath(PATHS.HEALTH_CHECKUP_DETAIL, {
              ckupRcdSn: checkup.ckupRcdSn,
            }),
          );
        },
      },
    );

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    findNearSchedule.mutate(
      { petSn, ckupYmd },
      {
        onSuccess: (schedule) => {
          if (schedule) setNearSchedule(schedule);
          else save();
        },
      },
    );
  };

  const handleReceipt = () => {
    showToast('영수증으로 등록하는 기능은 준비 중이에요');
  };

  return (
    <>
      <FormModal
        icon="local_hospital"
        title="검진기록 등록"
        hasFooter={step === 'form'}
        widthClassName="w-[min(560px,calc(100%-32px))]"
        isPending={isPending}
        onSubmit={handleSubmit}
        onClose={onClose}
      >
        {step === 'select' ? (
          <div className="grid gap-3">
            <button
              type="button"
              className="flex flex-col items-center gap-1 rounded-[10px] border border-line px-4 py-6 hover:border-brand-500 hover:bg-brand-50"
              onClick={() => setStep('form')}
            >
              <span className="text-lg/[1.6] font-semibold text-ink">
                직접 입력하기
              </span>
              <span className="text-subtle">
                영수증이 없거나 직접 적고 싶을 때
              </span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-1 rounded-[10px] border border-line px-4 py-6 hover:border-brand-500 hover:bg-brand-50"
              onClick={handleReceipt}
            >
              <span className="text-lg/[1.6] font-semibold text-ink">
                영수증으로 등록하기
              </span>
              <span className="text-subtle">사진에서 자동 인식</span>
            </button>
          </div>
        ) : (
          <>
            {onlyPetSn === null && (
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASS}>반려동물{REQUIRED}</span>
                <select
                  value={petSn ?? ''}
                  aria-invalid={isInvalid('pet')}
                  className={SELECT_CLASS}
                  style={SELECT_ARROW_STYLE}
                  onChange={(event) =>
                    setPetSn(
                      event.target.value === ''
                        ? null
                        : Number(event.target.value),
                    )
                  }
                >
                  <option value="">반려동물 선택</option>
                  {pets.map((pet) => (
                    <option key={pet.petSn} value={pet.petSn}>
                      {pet.petNm}
                    </option>
                  ))}
                </select>
                {isInvalid('pet') && (
                  <FieldError>반려동물을 선택해 주세요</FieldError>
                )}
              </label>
            )}

            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASS}>검진일{REQUIRED}</span>
              <input
                type="date"
                value={ckupYmd}
                aria-invalid={isInvalid('date')}
                className={`${INPUT_CLASS} tabular-nums`}
                onChange={(event) => setCkupYmd(event.target.value)}
              />
              <p className="text-subtle">
                예정된 일정은 케어 캘린더에서 등록해 주세요
              </p>
              {isInvalid('date') && (
                <FieldError>검진일을 입력해 주세요</FieldError>
              )}
            </label>

            <div className="grid grid-cols-2 gap-x-4">
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASS}>동물병원명{REQUIRED}</span>
                <input
                  value={hospNm}
                  maxLength={MAX_HOSPITAL_NAME_LENGTH}
                  aria-invalid={isInvalid('hosp')}
                  className={INPUT_CLASS}
                  onChange={(event) => setHospNm(event.target.value)}
                />
                {isInvalid('hosp') && (
                  <FieldError>병원명을 입력해 주세요</FieldError>
                )}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASS}>검진 종류{REQUIRED}</span>
                <select
                  value={ckupTypeCd}
                  aria-invalid={isInvalid('type')}
                  className={SELECT_CLASS}
                  style={SELECT_ARROW_STYLE}
                  onChange={(event) => setCkupTypeCd(event.target.value)}
                >
                  <option value="">선택해 주세요</option>
                  {CHECKUP_TYPES.map((type) => (
                    <option key={type.cd} value={type.cd}>
                      {type.nm}
                    </option>
                  ))}
                </select>
                {isInvalid('type') && (
                  <FieldError>검진 종류를 선택해 주세요</FieldError>
                )}
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASS}>검진 내용{OPTIONAL}</span>
              <textarea
                value={ckupCn}
                maxLength={MAX_CONTENT_LENGTH}
                placeholder="진료받은 내용을 적어주세요"
                className={TEXTAREA_CLASS}
                onChange={(event) => setCkupCn(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASS}>검진 메모{OPTIONAL}</span>
              <input
                value={ckupMemoCn}
                maxLength={MAX_MEMO_LENGTH}
                placeholder="다음에 확인할 것"
                className={INPUT_CLASS}
                onChange={(event) => setCkupMemoCn(event.target.value)}
              />
            </label>

            <p className="flex gap-2 rounded-[10px] bg-surface-2 px-4 py-3 text-muted">
              <Icon name="event" className="shrink-0 text-xl" />
              저장하면 케어 캘린더에도 표시됩니다. 같은 날짜에 등록한 병원
              일정이 있으면 그 일정과 자동으로 연결됩니다
            </p>
          </>
        )}
      </FormModal>

      {nearSchedule && (
        <Modal
          isConfirm
          title={`${formatMonthDaySlash(nearSchedule.schdlYmd)} ${findCheckupTypeNm(nearSchedule.ckupTypeCd)} 일정이 있어요`}
          description={`이 검진기록과 연결하고 일정을 ${formatMonthDaySlash(ckupYmd)}로 옮길까요?`}
          isPending={isPending}
          onClose={() => setNearSchedule(null)}
          footer={
            <>
              <button
                type="button"
                className={BTN_SECONDARY}
                disabled={isPending}
                onClick={() => save()}
              >
                새 일정으로 저장하기
              </button>
              <button
                type="button"
                className={BTN_PRIMARY}
                disabled={isPending}
                onClick={() => save(nearSchedule.schdlSn)}
              >
                {formatMonthDaySlash(ckupYmd)}로 옮겨 연결하기
              </button>
            </>
          }
        >
          <p className="mt-4 rounded-[8px] bg-surface-2 px-3 py-2 text-ink-2 tabular-nums">
            [병원]{' '}
            {formatDate(nearSchedule.schdlYmd, {
              separator: '-',
              hasYear: false,
            })}{' '}
            · {nearSchedule.petNm} ·{' '}
            {findCheckupTypeNm(nearSchedule.ckupTypeCd)} · {nearSchedule.hospNm}
          </p>
          <button
            type="button"
            aria-label="닫기 (저장하지 않음)"
            disabled={isPending}
            className="absolute top-3 right-3 grid size-8 place-items-center rounded-md text-subtle hover:bg-surface-2"
            onClick={() => setNearSchedule(null)}
          >
            <Icon name="close" />
          </button>
        </Modal>
      )}
    </>
  );
}
