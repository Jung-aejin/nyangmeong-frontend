import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/components/toastStore';
import {
  cancelCareRecord,
  cancelLastDose,
  checkCareItem,
  createCareItem,
  createSchedule,
  deleteSchedule,
  getCareItems,
  getPets,
  getSchedules,
  toggleCareMain,
  updateSchedule,
} from './api';
import {
  createCheckup,
  createDailyRecord,
  createObservation,
  createObservationRound,
  deleteCheckup,
  deleteDailyRecord,
  deleteObservationRound,
  endObservation,
  findNearSchedule,
  getCheckups,
  getDailyRecords,
  getObservations,
  updateDailyRecord,
  updateObservationRound,
} from './diaryApi';
import {
  getReceiptDetail,
  prepareReceiptSave,
  saveReceiptCheckups,
} from './receiptApi';

export const healthKeys = {
  all: ['health'],
  pets: ['health', 'pets'],
  schedules: ['health', 'schedules'],
  scheduleList: (params) => ['health', 'schedules', params],
  careItems: ['health', 'care-items'],
  careItemList: (petSn) => ['health', 'care-items', petSn],
  dailyRecords: ['health', 'daily-records'],
  dailyRecordList: (petSn) => ['health', 'daily-records', petSn],
  observations: ['health', 'observations'],
  observationList: (petSn) => ['health', 'observations', petSn],
  checkups: ['health', 'checkups'],
  checkupList: (params) => ['health', 'checkups', params],
  receiptDetail: (rcptSn) => ['health', 'receipt-detail', rcptSn],
};

const showErrorToast = (error) => showToast(error.message);

export const usePets = () =>
  useQuery({ queryKey: healthKeys.pets, queryFn: getPets });

// params: { startYmd, endYmd }
export const useSchedules = (params) =>
  useQuery({
    queryKey: healthKeys.scheduleList(params),
    queryFn: () => getSchedules(params),
  });

const useScheduleMutation = (mutationFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    // 반려동물을 바꾼 병원 일정은 연동 케어 항목도 옮겨지므로 케어리스트도 다시 읽는다
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthKeys.schedules });
      queryClient.invalidateQueries({ queryKey: healthKeys.careItems });
      queryClient.invalidateQueries({ queryKey: healthKeys.checkups });
    },
    onError: showErrorToast,
  });
};

export const useCreateSchedule = () => useScheduleMutation(createSchedule);

export const useUpdateSchedule = () => useScheduleMutation(updateSchedule);

export const useDeleteSchedule = () => useScheduleMutation(deleteSchedule);

export const useCareItems = (petSn) =>
  useQuery({
    queryKey: healthKeys.careItemList(petSn),
    queryFn: () => getCareItems(petSn),
    enabled: petSn != null,
  });

const useCareMutation = (mutationFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: healthKeys.careItems }),
    onError: showErrorToast,
  });
};

export const useCheckCareItem = () => useCareMutation(checkCareItem);

export const useCancelLastDose = () => useCareMutation(cancelLastDose);

export const useCancelCareRecord = () => useCareMutation(cancelCareRecord);

export const useToggleCareMain = () => useCareMutation(toggleCareMain);

export const useCreateCareItem = () => useCareMutation(createCareItem);

export const useDailyRecords = (petSn) =>
  useQuery({
    queryKey: healthKeys.dailyRecordList(petSn),
    queryFn: () => getDailyRecords({ petSn }),
    enabled: petSn != null,
  });

const useDailyRecordMutation = (mutationFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: healthKeys.dailyRecords }),
    onError: showErrorToast,
  });
};

export const useCreateDailyRecord = () =>
  useDailyRecordMutation(createDailyRecord);

export const useUpdateDailyRecord = () =>
  useDailyRecordMutation(updateDailyRecord);

export const useDeleteDailyRecord = () =>
  useDailyRecordMutation(deleteDailyRecord);

export const useObservations = (petSn) =>
  useQuery({
    queryKey: healthKeys.observationList(petSn),
    queryFn: () => getObservations({ petSn }),
    enabled: petSn != null,
  });

const useObservationMutation = (mutationFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: healthKeys.observations }),
    onError: showErrorToast,
  });
};

export const useCreateObservation = () =>
  useObservationMutation(createObservation);

export const useCreateObservationRound = () =>
  useObservationMutation(createObservationRound);

export const useUpdateObservationRound = () =>
  useObservationMutation(updateObservationRound);

export const useDeleteObservationRound = () =>
  useObservationMutation(deleteObservationRound);

export const useEndObservation = () => useObservationMutation(endObservation);

/** params: { petSn, year } */
export const useCheckups = (params) =>
  useQuery({
    queryKey: healthKeys.checkupList(params),
    queryFn: () => getCheckups(params),
    enabled: params.petSn != null,
  });

/** 검진기록 변경은 병원 일정·검진기록 수와 연동 케어 항목에 이어진다 */
const useCheckupMutation = (mutationFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthKeys.checkups });
      queryClient.invalidateQueries({ queryKey: healthKeys.schedules });
      queryClient.invalidateQueries({ queryKey: healthKeys.careItems });
    },
    onError: showErrorToast,
  });
};

export const useCreateCheckup = () => useCheckupMutation(createCheckup);

export const useDeleteCheckup = () => useCheckupMutation(deleteCheckup);

/** 저장 전 가까운 예정 일정 확인: 조회지만 저장 시점에 한 번만 부름 */
export const useFindNearSchedule = () =>
  useMutation({ mutationFn: findNearSchedule, onError: showErrorToast });

/** 영수증 인식 결과의 나머지 칸. 같은 영수증은 다시 불러오지 않는다 */
export const useReceiptDetail = (result) =>
  useQuery({
    queryKey: healthKeys.receiptDetail(result.rcptSn),
    queryFn: () => getReceiptDetail(result),
    staleTime: Infinity,
  });

/** 저장 전 가계부 중복·가까운 예정 일정 확인. 실패 안내는 모달 안에서 한다 */
export const usePrepareReceiptSave = () =>
  useMutation({ mutationFn: prepareReceiptSave });

/** 영수증으로 검진기록 저장. 실패하면 입력값을 유지한 채 모달 안에서 다시 시도하게 한다 */
export const useSaveReceiptCheckups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveReceiptCheckups,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthKeys.checkups });
      queryClient.invalidateQueries({ queryKey: healthKeys.schedules });
      queryClient.invalidateQueries({ queryKey: healthKeys.careItems });
    },
  });
};
