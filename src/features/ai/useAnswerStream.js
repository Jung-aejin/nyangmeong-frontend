import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { streamAnswer } from './api';
import { aiKeys } from './queries';

// 첫 글자가 이 시간 안에 오지 않으면 오류로 본다 (FN-AIM-002-07)
const FIRST_TOKEN_TIMEOUT_MS = 10_000;
// 답변 하나를 받는 데 걸리는 전체 시간의 상한이다
const TOTAL_TIMEOUT_MS = 60_000;

const idleState = {
  status: 'idle', // idle | waiting | streaming | done | error | incomplete
  text: '',
  shortcuts: [],
  question: '',
  aiCnvrsRoomSn: null,
  // 이 답이 화면에서 대신하는 저장된 메시지들이다. 목록에서 빼서 두 번 보이지 않게 한다
  hiddenMsgSns: [],
};

// 질문 하나에 대한 AI 답변을 받는 동안의 화면 상태를 맡는다. 저장은 서버(가짜)가 한다
export default function useAnswerStream() {
  const queryClient = useQueryClient();
  const [state, setState] = useState(idleState);
  // 이미 버린 요청의 늦은 응답이 화면을 덮어쓰지 않게 요청마다 번호를 매긴다
  const runIdRef = useRef(0);
  const abortRef = useRef(null);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const reset = useCallback(() => {
    runIdRef.current += 1;
    abortRef.current?.abort();
    clearTimers();
    setState(idleState);
  }, []);

  // 창이 닫힐 때 진행 중인 요청과 타이머를 정리한다
  useEffect(() => reset, [reset]);

  // replaceMsgSn이 있으면 그 AI 메시지를 새 답으로 바꾼다(다시 생성)
  const start = useCallback(
    async ({ aiCnvrsRoomSn, question, replaceMsgSn }) => {
      runIdRef.current += 1;
      const runId = runIdRef.current;
      abortRef.current?.abort();
      clearTimers();

      const controller = new AbortController();
      abortRef.current = controller;
      let text = '';
      let isFirstTokenReceived = false;

      setState({
        ...idleState,
        status: 'waiting',
        question,
        aiCnvrsRoomSn,
        hiddenMsgSns: replaceMsgSn ? [replaceMsgSn] : [],
      });

      timersRef.current = [
        setTimeout(() => {
          if (!isFirstTokenReceived) controller.abort();
        }, FIRST_TOKEN_TIMEOUT_MS),
        setTimeout(() => controller.abort(), TOTAL_TIMEOUT_MS),
      ];

      const isCurrent = () => runIdRef.current === runId;

      try {
        const result = await streamAnswer({
          aiCnvrsRoomSn,
          question,
          replaceMsgSn,
          signal: controller.signal,
          onToken: (chunk) => {
            if (!isCurrent()) return;
            isFirstTokenReceived = true;
            text += chunk;
            setState((prev) => ({ ...prev, status: 'streaming', text }));
          },
        });
        if (!isCurrent()) return;
        clearTimers();

        // 첫 글자를 받기 전에 끊겼다
        if (text === '') {
          setState((prev) => ({ ...prev, status: 'error' }));
          return;
        }

        const isComplete = result.aiCnvrsMsgCmptnYn === 'Y';
        setState((prev) => ({
          ...prev,
          status: isComplete ? 'done' : 'incomplete',
          text: result.aiCnvrsMsgCn ?? text,
          shortcuts: isComplete ? result.rltdShrtcts : [],
          hiddenMsgSns: [...prev.hiddenMsgSns, result.aiCnvrsMsgSn],
        }));
        queryClient.invalidateQueries({ queryKey: aiKeys.lists });
        queryClient.invalidateQueries({
          queryKey: aiKeys.detail(aiCnvrsRoomSn),
        });
      } catch {
        if (!isCurrent()) return;
        clearTimers();
        // 받은 글자가 있으면 지우지 않고 미완료로 남긴다
        setState((prev) => ({
          ...prev,
          status: text === '' ? 'error' : 'incomplete',
          text,
        }));
      }
    },
    [queryClient],
  );

  return { ...state, start, reset };
}
