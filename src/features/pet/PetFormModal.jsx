import { Lock, X } from 'lucide-react';
import { useState } from 'react';
import { showToast } from '@/components/toastStore';
import {
  COLR_DRCT_INPT,
  COLR_OPTIONS,
  PET_GNDR_OPTIONS,
  PET_SE_OPTIONS,
} from './petCodes';
import { useCreatePet, usePet, useUpdatePet, useVarieties } from './queries';

// 품종 select에서 [직접 입력]을 고른 상태. 서버에는 vrtySn 없이 vrtyDrctInptNm만 보낸다
const VRTY_DRCT_INPT = 'DRCT_INPT';

const EMPTY_FORM = {
  petNm: '',
  petSeCd: '',
  vrtySn: '',
  vrtyDrctInptNm: '',
  petBrdt: '',
  chipNo: '',
  petGndrCd: '',
  nutrYn: 'N',
  petBdwg: '',
  goalBdwg: '',
  minBdwg: '',
  maxBdwg: '',
  colrCd: '',
  colrDrctInptNm: '',
  chrcCn: '',
  algyCn: '',
  dssCn: '',
};

const toText = (value) => (value == null ? '' : String(value));

const toForm = (pet) => ({
  ...Object.fromEntries(
    Object.keys(EMPTY_FORM).map((key) => [key, toText(pet[key])]),
  ),
  vrtySn: pet.vrtySn == null ? VRTY_DRCT_INPT : String(pet.vrtySn),
});

// 0보다 큰 숫자, 소수 셋째 자리까지(DB decimal(8,3))
const DECIMAL_INPUT = /^\d{0,5}(\.\d{0,3})?$/;
const isPositive = (value) => value !== '' && Number(value) > 0;

// "새우, ,닭고기 " → "새우,닭고기". 빈 값이면 null
const normalizeList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .join(',') || null;

const toNumberOrNull = (value) => (value === '' ? null : Number(value));
const toTextOrNull = (value) => value.trim() || null;

const formatRecordDate = (rcdDt) => rcdDt.slice(5, 10);

export default function PetFormModal({ petSn = null, onClose }) {
  const { data: pet, isPending } = usePet(petSn);
  const isEdit = petSn != null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {isEdit ? '반려동물 수정' : '반려동물 등록'}
          </h2>
          <button type="button" onClick={onClose} aria-label="닫기">
            <X className="size-5" />
          </button>
        </div>
        {isEdit && isPending ? null : (
          <PetForm pet={isEdit ? pet : null} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function PetForm({ pet, onClose }) {
  const [form, setForm] = useState(() => (pet ? toForm(pet) : EMPTY_FORM));
  const [fieldErrors, setFieldErrors] = useState({});
  const { data: varieties = [] } = useVarieties(form.petSeCd);
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();

  const isEdit = pet != null;
  const lastBdwgRcd = pet?.lastBdwgRcd ?? null;
  const isVrtyDrctInpt = form.vrtySn === VRTY_DRCT_INPT;
  const isColrDrctInpt = form.colrCd === COLR_DRCT_INPT;
  const colrOptions = COLR_OPTIONS[form.petSeCd] ?? [];
  const isRangeInvalid =
    isPositive(form.minBdwg) &&
    isPositive(form.maxBdwg) &&
    Number(form.minBdwg) >= Number(form.maxBdwg);
  const isPending = createPet.isPending || updatePet.isPending;

  const canSubmit =
    form.petNm.trim() &&
    form.petSeCd &&
    (isVrtyDrctInpt ? form.vrtyDrctInptNm.trim() : form.vrtySn) &&
    form.petBrdt &&
    form.petGndrCd &&
    isPositive(form.petBdwg) &&
    (form.goalBdwg === '' || isPositive(form.goalBdwg)) &&
    isPositive(form.minBdwg) &&
    isPositive(form.maxBdwg) &&
    !isRangeInvalid &&
    (isColrDrctInpt ? form.colrDrctInptNm.trim() : form.colrCd) &&
    !isPending;

  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleChange = (e) => setField(e.target.name, e.target.value);

  const handleDecimalChange = (e) => {
    if (DECIMAL_INPUT.test(e.target.value)) handleChange(e);
  };

  const handleChipNoChange = (e) => {
    if (/^\d*$/.test(e.target.value)) handleChange(e);
  };

  // 품종·털색 목록이 종류마다 달라 종류를 바꾸면 고른 값을 비운다
  const handlePetSeChange = (code) =>
    setForm((prev) =>
      prev.petSeCd === code
        ? prev
        : {
            ...prev,
            petSeCd: code,
            vrtySn: '',
            vrtyDrctInptNm: '',
            colrCd: '',
            colrDrctInptNm: '',
          },
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const body = {
      petNm: form.petNm.trim(),
      petSeCd: form.petSeCd,
      vrtySn: isVrtyDrctInpt ? null : Number(form.vrtySn),
      vrtyDrctInptNm: isVrtyDrctInpt ? form.vrtyDrctInptNm.trim() : null,
      petBrdt: form.petBrdt,
      chipNo: form.chipNo || null,
      petGndrCd: form.petGndrCd,
      nutrYn: form.nutrYn,
      petBdwg: Number(form.petBdwg),
      goalBdwg: toNumberOrNull(form.goalBdwg),
      minBdwg: Number(form.minBdwg),
      maxBdwg: Number(form.maxBdwg),
      colrCd: form.colrCd,
      colrDrctInptNm: isColrDrctInpt ? form.colrDrctInptNm.trim() : null,
      chrcCn: toTextOrNull(form.chrcCn),
      algyCn: normalizeList(form.algyCn),
      dssCn: normalizeList(form.dssCn),
    };
    const options = {
      onSuccess: () => {
        showToast(
          isEdit ? '반려동물 정보를 수정했어요.' : '반려동물을 등록했어요.',
        );
        onClose();
      },
      onError: (error) => {
        if (error.fields) {
          setFieldErrors(
            Object.fromEntries(error.fields.map((f) => [f.field, f.message])),
          );
        } else {
          showToast(error.message);
        }
      },
    };
    if (isEdit) updatePet.mutate({ petSn: pet.petSn, ...body }, options);
    else createPet.mutate(body, options);
  };

  // toISOString은 UTC라 한국 자정~오전 9시에 어제 날짜가 된다
  const today = new Date().toLocaleDateString('sv-SE');

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <Field label="이름" error={fieldErrors.petNm}>
        <input
          name="petNm"
          value={form.petNm}
          onChange={handleChange}
          maxLength={20}
          placeholder="이름 입력 (최대 20자)"
          className={INPUT}
        />
      </Field>

      <Field label="종류" error={fieldErrors.petSeCd}>
        <ChipGroup
          options={PET_SE_OPTIONS}
          value={form.petSeCd}
          onChange={handlePetSeChange}
        />
      </Field>

      <Field
        label="품종"
        error={fieldErrors.vrtySn ?? fieldErrors.vrtyDrctInptNm}
      >
        <select
          name="vrtySn"
          value={form.vrtySn}
          onChange={handleChange}
          disabled={!form.petSeCd}
          className={INPUT}
        >
          <option value="">
            {form.petSeCd ? '선택' : '종류를 먼저 선택해 주세요'}
          </option>
          {varieties.map((vrty) => (
            <option key={vrty.vrtySn} value={vrty.vrtySn}>
              {vrty.vrtyNm}
            </option>
          ))}
          {form.petSeCd && <option value={VRTY_DRCT_INPT}>직접 입력</option>}
        </select>
        {isVrtyDrctInpt && (
          <input
            name="vrtyDrctInptNm"
            value={form.vrtyDrctInptNm}
            onChange={handleChange}
            maxLength={40}
            placeholder="품종 직접 입력 (최대 40자)"
            className={`${INPUT} mt-2`}
          />
        )}
      </Field>

      <Field label="생년월일" error={fieldErrors.petBrdt}>
        <input
          type="date"
          name="petBrdt"
          value={form.petBrdt}
          onChange={handleChange}
          max={today}
          className={INPUT}
        />
      </Field>

      <Field label="인식칩 번호 (선택)" error={fieldErrors.chipNo}>
        <input
          name="chipNo"
          value={form.chipNo}
          onChange={handleChipNoChange}
          inputMode="numeric"
          maxLength={20}
          placeholder="숫자만 입력 (최대 20자리)"
          className={INPUT}
        />
      </Field>

      <Field label="성별" error={fieldErrors.petGndrCd}>
        <ChipGroup
          options={PET_GNDR_OPTIONS}
          value={form.petGndrCd}
          onChange={(code) => setField('petGndrCd', code)}
        />
      </Field>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.nutrYn === 'Y'}
          onChange={(e) => setField('nutrYn', e.target.checked ? 'Y' : 'N')}
        />
        중성화 완료
      </label>

      <Field label="체중(kg)" error={fieldErrors.petBdwg}>
        {lastBdwgRcd ? (
          <>
            <div
              className={`${INPUT} flex items-center gap-2 bg-gray-100 text-gray-500`}
            >
              <Lock className="size-4" />
              {lastBdwgRcd.rcdNvl}
            </div>
            <p className={HINT}>
              건강 일지에 기록된 체중이에요 (
              {formatRecordDate(lastBdwgRcd.rcdDt)} 기록)
            </p>
            {/* 건강 일지(SCR-HLT-002, JAJ) 경로가 생기면 연결한다 */}
            <button
              type="button"
              className="mt-1 text-sm text-blue-600 underline"
            >
              건강 일지에서 기록하기
            </button>
          </>
        ) : (
          <>
            <input
              name="petBdwg"
              value={form.petBdwg}
              onChange={handleDecimalChange}
              inputMode="decimal"
              placeholder="예: 4.2"
              className={INPUT}
            />
            <p className={HINT}>
              {isEdit
                ? '잘못 입력한 체중만 고칠 수 있어요. 체중이 바뀌었다면 건강 일지에 기록해 주세요'
                : '대략적인 체중이어도 괜찮아요. 건강기록에서 정확히 기록하면 자동으로 바뀌어요'}
            </p>
          </>
        )}
      </Field>

      <Field label="목표체중(kg) (선택)" error={fieldErrors.goalBdwg}>
        <input
          name="goalBdwg"
          value={form.goalBdwg}
          onChange={handleDecimalChange}
          inputMode="decimal"
          placeholder="예: 4.0"
          className={INPUT}
        />
      </Field>

      <Field
        label="체중 정상범위(kg)"
        error={fieldErrors.minBdwg ?? fieldErrors.maxBdwg}
      >
        <div className="flex items-center gap-2">
          <input
            name="minBdwg"
            value={form.minBdwg}
            onChange={handleDecimalChange}
            inputMode="decimal"
            placeholder="최소"
            className={INPUT}
          />
          <span>~</span>
          <input
            name="maxBdwg"
            value={form.maxBdwg}
            onChange={handleDecimalChange}
            inputMode="decimal"
            placeholder="최대"
            className={INPUT}
          />
        </div>
        {isRangeInvalid && (
          <p className={ERROR}>최소 체중은 최대 체중보다 작아야 해요</p>
        )}
        <p className={HINT}>
          동물병원에서 확인한 범위를 입력해 주세요. 언제든 수정할 수 있어요
        </p>
      </Field>

      <Field
        label="털색"
        error={fieldErrors.colrCd ?? fieldErrors.colrDrctInptNm}
      >
        <select
          name="colrCd"
          value={form.colrCd}
          onChange={handleChange}
          disabled={!form.petSeCd}
          className={INPUT}
        >
          <option value="">
            {form.petSeCd ? '선택' : '종류를 먼저 선택해 주세요'}
          </option>
          {colrOptions.map((colr) => (
            <option key={colr.code} value={colr.code}>
              {colr.name}
            </option>
          ))}
        </select>
        {isColrDrctInpt && (
          <input
            name="colrDrctInptNm"
            value={form.colrDrctInptNm}
            onChange={handleChange}
            maxLength={20}
            placeholder="털색 직접 입력 (최대 20자)"
            className={`${INPUT} mt-2`}
          />
        )}
      </Field>

      <Field label="특징 (선택)" error={fieldErrors.chrcCn}>
        <textarea
          name="chrcCn"
          value={form.chrcCn}
          onChange={handleChange}
          maxLength={1000}
          rows={2}
          placeholder="예) 오른쪽 귀 한쪽만 접힘, 배에 흰 털"
          className={INPUT}
        />
      </Field>

      <Field label="알레르기 (선택)" error={fieldErrors.algyCn}>
        <input
          name="algyCn"
          value={form.algyCn}
          onChange={handleChange}
          maxLength={1000}
          placeholder="예) 새우, 닭고기"
          className={INPUT}
        />
        <p className={HINT}>여러 건이면 쉼표(,)로 구분해 입력</p>
      </Field>

      <Field label="기저질환 (선택)" error={fieldErrors.dssCn}>
        <input
          name="dssCn"
          value={form.dssCn}
          onChange={handleChange}
          maxLength={1000}
          placeholder="예) 슬개골 탈구, 만성 신부전"
          className={INPUT}
        />
        <p className={HINT}>여러 건이면 쉼표(,)로 구분해 입력</p>
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border px-4 py-2"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:bg-gray-300"
        >
          {isEdit ? '수정하기' : '등록하기'}
        </button>
      </div>
    </form>
  );
}

const INPUT = 'w-full rounded-lg border px-3 py-2';
const HINT = 'mt-1 text-xs text-gray-500';
const ERROR = 'mt-1 text-xs text-red-600';

function Field({ label, error, children }) {
  return (
    <div>
      <p className="mb-1 font-semibold">{label}</p>
      {children}
      {error && <p className={ERROR}>{error}</p>}
    </div>
  );
}

function ChipGroup({ options, value, onChange }) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => onChange(option.code)}
          className={`rounded-full border px-4 py-1.5 ${
            value === option.code
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'text-gray-600'
          }`}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
}
