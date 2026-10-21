import { api } from '@/api/axios';

/** 비로그인 401 랜딩 이동 반복 방지용 이동 끄기 */
export const getMe = () => api.get('/members/me', { skipAuthRedirect: true });

/**
 * [회원 API 가짜 응답]
 * - 회원 요약(LJS)·로그아웃(YAY) API 전까지 사용, api.get()·api.post()로 교체
 * - 필드는 MemberSummaryResponse 기준(docs/api/member.md), 연결 때 Swagger 재확인
 */
export const getMemberSummary = () =>
  Promise.resolve({
    mbrNcnm: '초코보호자',
    maskedAcntEml: 'jin****@gmail.com',
  });

export const logout = () => Promise.resolve();

/**
 * [회원정보 수정 가짜 API]
 * - 회원 조회·수정 API(AIC) 전까지 사용 -> 나오면 본문만 api 요청으로 교체
 * - 미확정 키: acntEml·mbrNcnm·mbrTelno·prflImgUrl·snsTyCd·dplctYn·mbrJoinPathCd·mbrRegDt·mbrLastLgnDt
 * - 주소에 ?fake=sns 가 있으면 소셜 로그인 회원으로 본다
 * - 비밀번호에 wrong 을 넣으면 실패, 닉네임 초코맘2·관리자와 번호 01099998888은 중복,
 *   번호 01000000000은 조회 실패
 */
const FAKE_DELAY_MS = 200;
const DUP_NICKNAMES = ['초코맘2', '관리자'];
const DUP_PHONES = ['01099998888'];
const FAIL_PHONE = '01000000000';

const profile = {
  acntEml: 'chocomom@example.com',
  mbrNcnm: '초코맘',
  mbrTelno: '01012345678',
  prflImgUrl: null,
  mbrRegDt: '2026-08-14 09:12:00',
  mbrLastLgnDt: '2026-10-21 10:42:00',
};

const isFakeSns = () =>
  new URLSearchParams(window.location.search).get('fake') === 'sns';

const wait = (result) =>
  new Promise((resolve) => setTimeout(() => resolve(result), FAKE_DELAY_MS));

const fail = (code) =>
  wait().then(() => {
    throw Object.assign(new Error(code), { code });
  });

export const getMyProfile = () =>
  wait({
    ...profile,
    snsTyCd: isFakeSns() ? 'KAKAO' : null,
    mbrJoinPathCd: isFakeSns() ? 'KAKAO' : 'EMAIL',
  });

export const verifyPassword = ({ pswd }) =>
  pswd === 'wrong' ? fail('MISMATCH') : wait();

export const updateProfileImage = ({ file }) => {
  profile.prflImgUrl = file ? URL.createObjectURL(file) : null;
  return wait({ prflImgUrl: profile.prflImgUrl });
};

export const checkNickname = ({ mbrNcnm }) =>
  wait({ dplctYn: DUP_NICKNAMES.includes(mbrNcnm) });

export const updateNickname = ({ mbrNcnm }) => {
  if (DUP_NICKNAMES.includes(mbrNcnm)) return fail('DUPLICATE');
  profile.mbrNcnm = mbrNcnm;
  return wait();
};

export const checkPhone = ({ mbrTelno }) =>
  mbrTelno === FAIL_PHONE
    ? fail('FAILED')
    : wait({ dplctYn: DUP_PHONES.includes(mbrTelno) });

export const updatePhone = ({ mbrTelno }) => {
  if (DUP_PHONES.includes(mbrTelno)) return fail('DUPLICATE');
  profile.mbrTelno = mbrTelno;
  return wait();
};

export const updatePassword = ({ curPswd }) =>
  curPswd === 'wrong' ? fail('MISMATCH') : wait();
