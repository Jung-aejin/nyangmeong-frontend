import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  acceptInvitation,
  createInvitation,
  createPet,
  deleteCaregiver,
  deletePet,
  getCaregivers,
  getInvitation,
  getPet,
  getPets,
  getSentInvitations,
  getVarieties,
  leavePet,
  rejectInvitation,
  updatePet,
} from './api';

export const petKeys = {
  all: ['pets'],
  list: () => ['pets', 'list'],
  detail: (petSn) => ['pets', petSn],
  caregivers: (petSn) => ['pets', petSn, 'caregivers'],
  varieties: (petSeCd) => ['varieties', petSeCd],
};

export const invitationKeys = {
  all: ['invitations'],
  sent: () => ['invitations', 'sent'],
  detail: (invitationToken) => ['invitations', invitationToken],
};

export const usePets = () =>
  useQuery({ queryKey: petKeys.list(), queryFn: getPets });

export const usePet = (petSn) =>
  useQuery({
    queryKey: petKeys.detail(petSn),
    queryFn: () => getPet(petSn),
    enabled: petSn != null,
  });

export const useVarieties = (petSeCd) =>
  useQuery({
    queryKey: petKeys.varieties(petSeCd),
    queryFn: () => getVarieties(petSeCd),
    enabled: !!petSeCd,
  });

export const useCreatePet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPet,
    onSuccess: () => qc.invalidateQueries({ queryKey: petKeys.all }),
  });
};

export const useUpdatePet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updatePet,
    onSuccess: () => qc.invalidateQueries({ queryKey: petKeys.all }),
  });
};

export const useDeletePet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePet,
    onSuccess: () => qc.invalidateQueries({ queryKey: petKeys.all }),
  });
};

export const useCaregivers = (petSn) =>
  useQuery({
    queryKey: petKeys.caregivers(petSn),
    queryFn: () => getCaregivers(petSn),
    enabled: petSn != null,
  });

/** 여러 동물의 양육관계 한 번에 조회 (초대 대상 인원 표시용) */
export const useCaregiversOf = (petSns) =>
  useQueries({
    queries: petSns.map((petSn) => ({
      queryKey: petKeys.caregivers(petSn),
      queryFn: () => getCaregivers(petSn),
    })),
  });

export const useDeleteCaregiver = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCaregiver,
    onSuccess: (_, { petSn }) =>
      qc.invalidateQueries({ queryKey: petKeys.caregivers(petSn) }),
  });
};

export const useLeavePet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: leavePet,
    onSuccess: () => qc.invalidateQueries({ queryKey: petKeys.all }),
  });
};

export const useSentInvitations = () =>
  useQuery({ queryKey: invitationKeys.sent(), queryFn: getSentInvitations });

export const useCreateInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createInvitation,
    onSuccess: () => qc.invalidateQueries({ queryKey: invitationKeys.sent() }),
  });
};

export const useInvitation = (invitationToken) =>
  useQuery({
    queryKey: invitationKeys.detail(invitationToken),
    queryFn: () => getInvitation(invitationToken),
    enabled: !!invitationToken,
    retry: false,
  });

export const useAcceptInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.all });
      qc.invalidateQueries({ queryKey: petKeys.all });
    },
  });
};

export const useRejectInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rejectInvitation,
    onSuccess: () => qc.invalidateQueries({ queryKey: invitationKeys.all }),
  });
};
