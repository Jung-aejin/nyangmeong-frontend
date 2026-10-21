import { useState } from 'react';
import { showToast } from '@/components/toastStore';
import PasswordConfirm from '@/features/member/profile/PasswordConfirm';
import ProfileEditForm from '@/features/member/profile/ProfileEditForm';
import { useMyProfile } from '@/features/member/queries';

export default function ProfileEditPage() {
  const { data: profile, isError } = useMyProfile();
  const [isVerified, setIsVerified] = useState(false);

  // 소셜 로그인 회원은 비밀번호가 없어 본인 확인을 건너뛴다
  const needsVerify = profile && !profile.snsTyCd && !isVerified;

  return (
    <div className="mx-auto max-w-6xl py-6">
      <h1 className="text-page font-bold tracking-[-0.02em]">회원정보 수정</h1>
      <p className="mt-1 mb-6 text-muted">
        프로필 사진, 닉네임, 연락처 등 내 계정 정보를 관리해요
      </p>
      {isError && <p className="text-danger">회원 정보를 불러오지 못했어요</p>}
      {needsVerify && (
        <PasswordConfirm onVerified={() => setIsVerified(true)} />
      )}
      {profile && !needsVerify && (
        <ProfileEditForm
          profile={profile}
          // 회원 탈퇴 화면(SCR-ACC-020, YAY) 경로가 생기면 이동으로 바꾼다
          onWithdraw={() => showToast('준비 중인 기능이에요')}
        />
      )}
    </div>
  );
}
