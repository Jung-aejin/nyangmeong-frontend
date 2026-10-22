import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createCare,
  deleteCare,
  getCare,
  getCareList,
  reportCare,
  toggleCareLike,
  updateCare,
} from './careApi';

export const careKeys = {
  all: ['care'],
  list: (params) => ['care', 'list', params],
  detail: (petPrtcRcrtSn) => ['care', petPrtcRcrtSn],
};

export const useCareList = (params) =>
  useQuery({
    queryKey: careKeys.list(params),
    queryFn: () => getCareList(params),
    /** 필터를 바꾸는 동안 이전 목록을 유지해 필터 영역이 사라지지 않게 한다 */
    placeholderData: keepPreviousData,
  });

export const useCare = (petPrtcRcrtSn) =>
  useQuery({
    queryKey: careKeys.detail(petPrtcRcrtSn),
    queryFn: () => getCare(petPrtcRcrtSn),
    retry: false,
  });

/** 글·좋아요가 바뀌면 목록·상세를 모두 다시 받는다 */
const useInvalidatingMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: careKeys.all }),
  });
};

export const useCreateCare = () => useInvalidatingMutation(createCare);
export const useUpdateCare = () => useInvalidatingMutation(updateCare);
export const useDeleteCare = () => useInvalidatingMutation(deleteCare);
export const useToggleCareLike = () => useInvalidatingMutation(toggleCareLike);

/** 신고는 화면이 바뀌지 않아 다시 받지 않는다 */
export const useReportCare = () => useMutation({ mutationFn: reportCare });
