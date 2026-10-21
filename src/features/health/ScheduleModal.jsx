import { useEffect, useRef, useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import Icon from '@/components/Icon';
import {
  BADGE_COLORS,
  CHECKUP_TYPES,
  HOSPITAL,
  SCHEDULE_TYPES,
  TONES,
} from './scheduleTypes';
import {
  useCreateSchedule,
  useDeleteSchedule,
  useUpdateSchedule,
} from './queries';

// 뱃지 색상 견본 이름. 색은 scheduleTypes의 BADGE_COLORS·TONES와 같다
const BADGE_COLOR_NAMES = {
  '#3b82f6': '파랑',
  '#22a06b': '초록',
  '#e05a8c': '분홍',
  '#8b5cf6': '보라',
  '#f59e0b': '주황',
  '#8a9596': '회색',
};

// 퍼블리싱 시안 .sel의 오른쪽 화살표
const SELECT_ARROW_STYLE = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5' fill='none' stroke='%23566465' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
};

const MAX_HOSPITAL_NAME_LENGTH = 50;
const MAX_SCHEDULE_NAME_LENGTH = 50;
const MAX_MEMO_LENGTH = 200;

const toForm = (schedule, defaultPetSn, defaultYmd) => ({
  petSn: schedule?.petSn ?? defaultPetSn ?? null,
  schdlTypeCd: schedule?.schdlTypeCd ?? null,
  ckupTypeCd: schedule?.ckupTypeCd ?? '',
  hospNm: schedule?.hospNm ?? '',
  schdlNm: schedule?.schdlNm ?? '',
  schdlYmd: schedule?.schdlYmd ?? defaultYmd,
  schdlTm: schedule?.schdlTm ?? '',
  schdlMemoCn: schedule?.schdlMemoCn ?? '',
  bdgClrCd: schedule?.bdgClrCd ?? null,
});

// 일정 등록·수정 모달(FN-HLT-003-32~37). schedule이 있으면 수정, 없으면 등록이다
export default function ScheduleModal({
  pets,
  schedule,
  defaultPetSn,
  defaultYmd,
  onClose,
  onCreateNew,
}) {
  const dialogRef = useRef(null);
  const isEdit = schedule != null;
  const onlyPetSn = pets.length === 1 ? pets[0].petSn : null;
  const [form, setForm] = useState(() =>
    toForm(schedule, onlyPetSn ?? defaultPetSn, defaultYmd),
  );
  const [confirm, setConfirm] = useState(null);
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();
  const isPending =
    createSchedule.isPending ||
    updateSchedule.isPending ||
    deleteSchedule.isPending;

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  // 종류를 바꾸면 이전 종류의 입력값은 유지하지 않는다(FN-HLT-003-35)
  const handleTypeChange = (schdlTypeCd) =>
    setForm((prev) => ({
      ...prev,
      schdlTypeCd,
      ckupTypeCd: '',
      hospNm: '',
      schdlNm: '',
    }));

  const isHospitalForm = form.schdlTypeCd === HOSPITAL;
  const canSubmit =
    form.petSn != null &&
    form.schdlTypeCd !== null &&
    form.schdlYmd !== '' &&
    (isHospitalForm
      ? form.ckupTypeCd !== '' && form.hospNm.trim() !== ''
      : form.schdlNm.trim() !== '') &&
    !isPending;

  const toBody = () => ({
    petSn: form.petSn,
    schdlTypeCd: form.schdlTypeCd,
    ckupTypeCd: isHospitalForm ? form.ckupTypeCd : null,
    hospNm: isHospitalForm ? form.hospNm.trim() : null,
    schdlNm: isHospitalForm ? null : form.schdlNm.trim(),
    schdlYmd: form.schdlYmd,
    schdlTm: form.schdlTm || null,
    schdlMemoCn: form.schdlMemoCn.trim(),
    bdgClrCd: form.bdgClrCd,
  });

  const save = () => {
    const options = { onSuccess: onClose };
    if (isEdit)
      updateSchedule.mutate(
        { schdlSn: schedule.schdlSn, ...toBody() },
        options,
      );
    else createSchedule.mutate(toBody(), options);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    // 검진기록이 연결된 병원 일정의 반려동물을 바꾸면 연동 데이터도 옮겨지므로 먼저 확인받는다(FN-HLT-003-37)
    const movesLinkedRecords =
      isEdit &&
      schedule.schdlTypeCd === HOSPITAL &&
      schedule.ckupRcdCnt > 0 &&
      form.petSn !== schedule.petSn;
    if (movesLinkedRecords) {
      setConfirm('move');
      return;
    }
    save();
  };

  const handleDelete = () =>
    deleteSchedule.mutate(schedule.schdlSn, { onSuccess: onClose });

  const handleCancel = (event) => {
    event.preventDefault();
    if (!isPending) onClose();
  };

  const targetPetNm = pets.find((pet) => pet.petSn === form.petSn)?.petNm;

  const labelClass =
    'flex items-center gap-0.5 text-base leading-[1.4] font-semibold text-[#1a3234]';
  const inputClass =
    'block h-10 w-full rounded-[6px] border border-[#d3dae2] bg-white px-3 text-base leading-[1.4] text-[#1a3234] outline-none hover:border-[#b9c4c4] focus:border-[#285a5c] focus:shadow-[0_0_0_3px_rgba(40,90,92,0.18)]';
  const selectClass = `${inputClass} appearance-none pt-px pr-9`;
  const secondaryButtonClass =
    'inline-flex h-10 min-w-24 items-center justify-center rounded-[6px] border border-[#e2e7e7] bg-white px-4 text-base font-semibold whitespace-nowrap text-[#1a3234] hover:border-[#b9c4c4] hover:bg-[#f4f6f6] disabled:opacity-50';
  const required = <span className="ml-0.5 font-bold text-[#b4473a]">*</span>;
  const optional = (
    <span className="ml-1 text-[13px] font-medium text-[#667374]">선택</span>
  );

  return (
    <dialog
      ref={dialogRef}
      aria-label="일정 등록·수정"
      className="m-auto w-[min(720px,calc(100%-32px))] rounded-[20px] bg-white p-0 shadow-[0_24px_64px_-12px_rgba(15,23,35,0.35)] backdrop:bg-[rgba(15,23,35,0.45)] backdrop:backdrop-blur-[2px]"
      onCancel={handleCancel}
    >
      <form onSubmit={handleSubmit}>
        <header className="flex items-start gap-3.5 border-b border-[#edf1f1] px-7 pt-6 pb-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e9f2f2] text-[#285a5c]">
            <Icon name="calendar_month" />
          </span>
          <h2 className="flex-1 text-xl leading-[1.35] font-bold text-[#1a3234]">
            {isEdit ? '일정 수정' : '일정 등록'}
          </h2>
          <button
            type="button"
            aria-label="닫기"
            className="-mt-1 -mr-2 grid size-9 shrink-0 place-items-center rounded-[10px] text-[#566465] hover:bg-[#ebf0f0] hover:text-[#1a3234]"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="flex flex-col gap-5 px-7 pt-6 pb-7">
          {onlyPetSn === null && (
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>반려동물{required}</span>
              <select
                value={form.petSn ?? ''}
                className={selectClass}
                style={SELECT_ARROW_STYLE}
                onChange={(event) =>
                  setField(
                    'petSn',
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
            </label>
          )}

          <fieldset className="flex flex-col gap-1.5">
            <legend className={`${labelClass} mb-1.5`}>
              일정 종류{required}
            </legend>
            <div className="flex h-10 rounded-[6px] border border-[#e6eaeb] bg-[#f1f3f4] p-[3px]">
              {SCHEDULE_TYPES.map((type) => {
                const isSelected = form.schdlTypeCd === type.cd;
                return (
                  <button
                    key={type.cd}
                    type="button"
                    aria-pressed={isSelected}
                    className={`flex flex-1 items-center justify-center rounded-[4px] whitespace-nowrap ${
                      isSelected
                        ? 'bg-white font-semibold text-[#1e4a4c] shadow-[0_1px_2px_rgba(26,50,52,0.08),0_0_0_1px_rgba(40,90,92,0.18)]'
                        : 'font-medium text-[#566465] hover:text-[#1a3234]'
                    }`}
                    onClick={() => handleTypeChange(type.cd)}
                  >
                    {type.nm}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-x-8">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>날짜{required}</span>
              <input
                type="date"
                required
                value={form.schdlYmd}
                className={`${inputClass} tabular-nums`}
                onChange={(event) => setField('schdlYmd', event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>시간{optional}</span>
              <input
                type="time"
                value={form.schdlTm}
                className={`${inputClass} tabular-nums`}
                onChange={(event) => setField('schdlTm', event.target.value)}
              />
            </label>
          </div>

          {isHospitalForm && (
            <div className="rounded-xl bg-[#f4f6f6] p-4">
              <div className="grid grid-cols-2 gap-x-8">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>검진유형{required}</span>
                  <select
                    value={form.ckupTypeCd}
                    className={selectClass}
                    style={SELECT_ARROW_STYLE}
                    onChange={(event) =>
                      setField('ckupTypeCd', event.target.value)
                    }
                  >
                    <option value="">선택</option>
                    {CHECKUP_TYPES.map((type) => (
                      <option key={type.cd} value={type.cd}>
                        {type.nm}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>병원명{required}</span>
                  <input
                    value={form.hospNm}
                    maxLength={MAX_HOSPITAL_NAME_LENGTH}
                    className={inputClass}
                    onChange={(event) => setField('hospNm', event.target.value)}
                  />
                </label>
              </div>
            </div>
          )}

          {form.schdlTypeCd !== null && !isHospitalForm && (
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>일정명{required}</span>
              <input
                value={form.schdlNm}
                maxLength={MAX_SCHEDULE_NAME_LENGTH}
                className={inputClass}
                onChange={(event) => setField('schdlNm', event.target.value)}
              />
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>일정 메모{optional}</span>
            <input
              value={form.schdlMemoCn}
              maxLength={MAX_MEMO_LENGTH}
              className={inputClass}
              onChange={(event) => setField('schdlMemoCn', event.target.value)}
            />
          </label>

          <fieldset className="flex flex-col gap-1.5">
            <legend className={`${labelClass} mb-1.5`}>
              캘린더 뱃지 색상{optional}
            </legend>
            <div className="flex flex-wrap gap-2">
              {BADGE_COLORS.map((color) => {
                const isSelected = form.bdgClrCd === color;
                return (
                  <button
                    key={color}
                    type="button"
                    title={BADGE_COLOR_NAMES[color]}
                    aria-label={BADGE_COLOR_NAMES[color]}
                    aria-pressed={isSelected}
                    className={`grid size-8 place-items-center rounded-full ${
                      isSelected ? 'shadow-[0_0_0_3px_rgba(40,90,92,0.18)]' : ''
                    }`}
                    style={{
                      backgroundColor: TONES[color].bg,
                      color: TONES[color].fg,
                    }}
                    onClick={() =>
                      setField('bdgClrCd', isSelected ? null : color)
                    }
                  >
                    {isSelected && (
                      <Icon name="check" className="text-lg font-semibold" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-sm leading-normal text-[#566465]">
              고르지 않으면 일정 종류의 기본 색상이 적용돼요
            </p>
          </fieldset>
        </div>

        <footer className="flex items-center justify-end gap-2 rounded-b-[20px] border-t border-[#e2e7e7] bg-[#fbfcfd] px-7 py-4">
          {isEdit ? (
            <button
              type="button"
              className="mr-auto text-base font-semibold text-[#1e4a4c] hover:underline hover:underline-offset-[3px]"
              onClick={onCreateNew}
            >
              새 일정 등록
            </button>
          ) : (
            <p className="mr-auto text-[#566465]">
              <span className="font-bold text-[#b4473a]">*</span> 표시는 필수
              항목이에요
            </p>
          )}
          <button
            type="button"
            disabled={isPending}
            className={secondaryButtonClass}
            onClick={onClose}
          >
            취소
          </button>
          {isEdit && (
            <button
              type="button"
              disabled={isPending}
              className={secondaryButtonClass}
              onClick={() => setConfirm('delete')}
            >
              일정 삭제하기
            </button>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-10 min-w-24 items-center justify-center rounded-[6px] bg-[#285a5c] px-4 text-base font-semibold whitespace-nowrap text-white hover:bg-[#1e4a4c] disabled:opacity-40"
          >
            {isEdit ? '일정 수정하기' : '저장하기'}
          </button>
        </footer>
      </form>

      {confirm === 'move' && (
        <ConfirmModal
          title={`이 일정의 검진기록과 연동된 케어 항목도 ${targetPetNm}(으)로 옮겨집니다`}
          confirmLabel="옮기기"
          isPending={isPending}
          onConfirm={() => {
            setConfirm(null);
            save();
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm === 'delete' && (
        <ConfirmModal
          title="이 일정을 삭제할까요? 연결된 검진기록은 그대로 남아요"
          confirmLabel="삭제하기"
          isPending={isPending}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </dialog>
  );
}
