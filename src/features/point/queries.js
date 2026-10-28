import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCareMissions, getPointBalance, getPointHistory } from './api';

export const pointKeys = {
  all: ['points'],
  balance: () => ['points', 'balance'],
  history: (ym) => ['points', 'history', ym],
  missions: (ymd) => ['points', 'missions', ymd],
};

export const usePointBalance = () =>
  useQuery({ queryKey: pointKeys.balance(), queryFn: getPointBalance });

/** 월 전환 시 깜박임 방지용 이전 결과 유지 */
export const usePointHistory = (ym) =>
  useQuery({
    queryKey: pointKeys.history(ym),
    queryFn: () => getPointHistory(ym),
    placeholderData: keepPreviousData,
  });

export const useCareMissions = (ymd) =>
  useQuery({
    queryKey: pointKeys.missions(ymd),
    queryFn: () => getCareMissions(ymd),
    placeholderData: keepPreviousData,
  });
