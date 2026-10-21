import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPet,
  deleteCaregiver,
  deletePet,
  getCaregivers,
  getPet,
  getPets,
  getVarieties,
  updatePet,
} from './api';

export const petKeys = {
  all: ['pets'],
  list: () => ['pets', 'list'],
  detail: (petSn) => ['pets', petSn],
  caregivers: (petSn) => ['pets', petSn, 'caregivers'],
  varieties: (petSeCd) => ['varieties', petSeCd],
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

export const useDeleteCaregiver = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCaregiver,
    onSuccess: (_, { petSn }) =>
      qc.invalidateQueries({ queryKey: petKeys.caregivers(petSn) }),
  });
};
