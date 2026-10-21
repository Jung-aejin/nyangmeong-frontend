import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import { BTN_SECONDARY } from '@/components/buttonStyles';
import { getTodayYmd } from '@/utils/formatDate';
import {
  OBSERVATION_CHANGES,
  OBSERVATION_PARTS,
  PHOTO_EXTENSIONS,
  PHOTO_MAX_BYTES,
} from '../diaryTypes';
import {
  useCreateObservation,
  useCreateObservationRound,
  useUpdateObservationRound,
} from '../queries';
import FieldError from './FieldError';
import FormModal from './FormModal';
import {
  INPUT_CLASS,
  LABEL_CLASS,
  SELECT_ARROW_STYLE,
  SELECT_CLASS,
  TEXTAREA_CLASS,
} from './formStyles';
import { formatPart } from './observationUtils';

const MAX_ITEM_NAME_LENGTH = 40;
const MAX_PART_DETAIL_LENGTH = 40;
const MAX_MEMO_LENGTH = 200;

const REQUIRED = <span className="ml-0.5 font-bold text-[#b4473a]">*</span>;
const OPTIONAL = (
  <span className="ml-1 text-[13px] font-medium text-[#667374]">선택</span>
);

const getModalTitle = (mode, item, round) => {
  if (mode === 'A') return '관찰 항목 등록';
  const nextNo = item.rounds.length + 1;
  if (mode === 'B') return `${item.obsvItmNm} · ${nextNo}회차 추가`;
  const roundNo =
    item.rounds.findIndex((target) => target.obsvRndSn === round.obsvRndSn) + 1;
  return `${item.obsvItmNm} · ${roundNo}회차 수정`;
};

/**
 * [관찰 기록 등록 모달]
 * - mode A: 새 관찰 항목 + 1회차 / B: 선택 항목에 회차 추가(항목명·부위 고정) / E: 선택 회차 수정
 * - 사진은 필수(jpg·jpeg·png·webp, 10MB 이하). 가짜 응답에서는 브라우저 임시 주소로 미리보기만 함
 */
export default function ObservationModal({
  mode,
  petSn,
  item,
  round,
  onSaved,
  onClose,
}) {
  const isCreateItem = mode === 'A';
  const isEdit = mode === 'E';
  const roundIndex = isEdit
    ? item.rounds.findIndex((target) => target.obsvRndSn === round.obsvRndSn)
    : -1;
  const isFirstRound = isCreateItem || roundIndex === 0;

  const [name, setName] = useState(item?.obsvItmNm ?? '');
  const [partCd, setPartCd] = useState('');
  const [partDetail, setPartDetail] = useState('');
  const [obsvYmd, setObsvYmd] = useState(round?.obsvYmd ?? getTodayYmd());
  const [photoPath, setPhotoPath] = useState(round?.photoPath ?? null);
  const [photoError, setPhotoError] = useState('');
  const [sizeMm, setSizeMm] = useState(round?.obsvSizeMm ?? '');
  const [chgCd, setChgCd] = useState(round?.obsvChgCd ?? '');
  const [memo, setMemo] = useState(round?.obsvMemoCn ?? '');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cameraRef = useRef(null);
  const albumRef = useRef(null);
  /** 이 모달에서 만든 임시 주소. 저장하지 않고 닫으면 해제 */
  const localPhotoRef = useRef(null);
  const isSavedRef = useRef(false);

  const createItem = useCreateObservation();
  const createRound = useCreateObservationRound();
  const updateRound = useUpdateObservationRound();
  const isPending =
    createItem.isPending || createRound.isPending || updateRound.isPending;

  useEffect(
    () => () => {
      if (localPhotoRef.current && !isSavedRef.current)
        URL.revokeObjectURL(localPhotoRef.current);
    },
    [],
  );

  const today = getTodayYmd();
  const errors = {
    name: isCreateItem && name.trim() === '',
    part: isCreateItem && partCd === '',
    date: obsvYmd === '' || obsvYmd > today,
    photo: photoPath === null && !isEdit,
  };
  const hasError = Object.values(errors).some(Boolean);
  const isInvalid = (field) => isSubmitted && errors[field];

  const handleFile = (event) => {
    const [file] = event.target.files;
    event.target.value = '';
    if (!file) return;
    const extension = file.name.split('.').pop().toLowerCase();
    if (
      !PHOTO_EXTENSIONS.includes(extension) ||
      !file.type.startsWith('image/')
    ) {
      setPhotoError('jpg·jpeg·png·webp 형식만 올릴 수 있어요');
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      setPhotoError('사진은 10MB 이하만 올릴 수 있어요');
      return;
    }
    if (localPhotoRef.current) URL.revokeObjectURL(localPhotoRef.current);
    localPhotoRef.current = URL.createObjectURL(file);
    setPhotoPath(localPhotoRef.current);
    setPhotoError('');
  };

  const handleSaved = (result) => {
    isSavedRef.current = true;
    onSaved(result);
    onClose();
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (hasError) return;
    const roundBody = {
      obsvYmd,
      photoPath,
      obsvSizeMm: sizeMm,
      obsvChgCd: isFirstRound ? null : chgCd,
      obsvMemoCn: memo.trim(),
    };
    const options = { onSuccess: handleSaved };
    if (isCreateItem) {
      createItem.mutate(
        {
          petSn,
          obsvItmNm: name.trim(),
          obsvPrtCd: partCd,
          obsvPrtDtlNm: partDetail.trim(),
          ...roundBody,
        },
        options,
      );
    } else if (isEdit) {
      updateRound.mutate({ obsvRndSn: round.obsvRndSn, ...roundBody }, options);
    } else {
      createRound.mutate({ obsvItmSn: item.obsvItmSn, ...roundBody }, options);
    }
  };

  return (
    <FormModal
      icon="photo_camera"
      title={getModalTitle(mode, item, round)}
      isPending={isPending}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>관찰 항목{REQUIRED}</span>
        <input
          value={name}
          readOnly={!isCreateItem}
          maxLength={MAX_ITEM_NAME_LENGTH}
          aria-invalid={isInvalid('name')}
          className={INPUT_CLASS}
          onChange={(event) => setName(event.target.value)}
        />
        {isInvalid('name') && (
          <FieldError>관찰 항목을 입력해 주세요</FieldError>
        )}
      </label>

      <div className="flex flex-col gap-1.5">
        <span id="obsv-part-label" className={LABEL_CLASS}>
          관찰 부위{REQUIRED}
        </span>
        {isCreateItem ? (
          <div className="grid grid-cols-2 gap-x-4">
            <select
              aria-labelledby="obsv-part-label"
              value={partCd}
              aria-invalid={isInvalid('part')}
              className={SELECT_CLASS}
              style={SELECT_ARROW_STYLE}
              onChange={(event) => setPartCd(event.target.value)}
            >
              <option value="">대분류 선택</option>
              {OBSERVATION_PARTS.map((part) => (
                <option key={part.cd} value={part.cd}>
                  {part.nm}
                </option>
              ))}
            </select>
            <input
              value={partDetail}
              maxLength={MAX_PART_DETAIL_LENGTH}
              placeholder="세부 위치 (선택)"
              aria-label="세부 위치 (선택)"
              className={INPUT_CLASS}
              onChange={(event) => setPartDetail(event.target.value)}
            />
          </div>
        ) : (
          <input
            readOnly
            aria-labelledby="obsv-part-label"
            value={formatPart(item)}
            className={INPUT_CLASS}
          />
        )}
        {isInvalid('part') && (
          <FieldError>관찰 부위를 선택해 주세요</FieldError>
        )}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>관찰일{REQUIRED}</span>
        <input
          type="date"
          value={obsvYmd}
          max={today}
          aria-invalid={isInvalid('date')}
          className={`${INPUT_CLASS} tabular-nums`}
          onChange={(event) => setObsvYmd(event.target.value)}
        />
        {isInvalid('date') && (
          <FieldError>오늘 이후 날짜는 고를 수 없어요</FieldError>
        )}
      </label>

      <div className="rounded-xl bg-[#f4f6f6] p-4">
        <span className={LABEL_CLASS}>사진{REQUIRED}</span>
        <div className="mt-2 grid h-40 place-items-center overflow-hidden rounded-[10px] border border-dashed border-line-strong bg-white text-subtle">
          {photoPath ? (
            <img
              src={photoPath}
              alt="선택한 사진"
              className="size-full object-contain"
            />
          ) : (
            <span className="flex flex-col items-center gap-1">
              <Icon name="image" className="text-[28px]" />
              사진 미리보기
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={`${BTN_SECONDARY} h-8! px-3!`}
            onClick={() => cameraRef.current.click()}
          >
            <Icon name="photo_camera" />
            촬영하기
          </button>
          <button
            type="button"
            className={`${BTN_SECONDARY} h-8! px-3!`}
            onClick={() => albumRef.current.click()}
          >
            <Icon name="photo_library" />
            앨범에서 선택
          </button>
        </div>
        <input
          ref={cameraRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          hidden
          onChange={handleFile}
        />
        <input
          ref={albumRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handleFile}
        />
        {(photoError || isInvalid('photo')) && (
          <FieldError>{photoError || '사진을 등록해 주세요'}</FieldError>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>크기{OPTIONAL}</span>
          <span className="relative block">
            <input
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              value={sizeMm}
              placeholder="선택 입력"
              className={`${INPUT_CLASS} pr-12 tabular-nums`}
              onChange={(event) => setSizeMm(event.target.value)}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted">
              mm
            </span>
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>변화{OPTIONAL}</span>
          {isFirstRound ? (
            <input
              disabled
              value="1회차는 비교 없음"
              aria-label="변화 (1회차는 비교 없음)"
              className={INPUT_CLASS}
            />
          ) : (
            <select
              value={chgCd}
              className={SELECT_CLASS}
              style={SELECT_ARROW_STYLE}
              onChange={(event) => setChgCd(event.target.value)}
            >
              <option value="">선택 안 함</option>
              {OBSERVATION_CHANGES.map((change) => (
                <option key={change.cd} value={change.cd}>
                  {change.nm}
                </option>
              ))}
            </select>
          )}
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>메모{OPTIONAL}</span>
        <textarea
          value={memo}
          maxLength={MAX_MEMO_LENGTH}
          placeholder="선택 입력"
          className={TEXTAREA_CLASS}
          onChange={(event) => setMemo(event.target.value)}
        />
      </label>
    </FormModal>
  );
}
