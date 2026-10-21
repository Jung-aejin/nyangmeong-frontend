import { ChevronRight, Lock } from 'lucide-react';
import { useState } from 'react';
import { CARD_ROWS, SECTION_TITLE } from '../shared/profileStyles';
import { SNS_NAME } from '../shared/snsCodes';
import AccountInfoCard from './AccountInfoCard';
import NicknameField from './NicknameField';
import PasswordChangeCard from './PasswordChangeCard';
import PhoneField from './PhoneField';
import ProfileImageField from './ProfileImageField';
import SnsBadge from './SnsBadge';

export default function ProfileEditForm({ profile, onWithdraw }) {
  const { snsTyCd, acntEml, mbrNcnm, mbrTelno, prflImgUrl } = profile;
  // 한 번에 한 항목만 펼친다. 다른 항목을 열면 열려 있던 항목은 입력을 버리고 닫힌다
  const [editingKey, setEditingKey] = useState(null);

  const rowProps = (key) => ({
    isEditing: editingKey === key,
    onEdit: () => setEditingKey(key),
    onClose: () => setEditingKey(null),
  });

  return (
    <div className="flex flex-col gap-12">
      <section
        aria-labelledby="basic-info-title"
        className="flex flex-col gap-5"
      >
        <h2 id="basic-info-title" className={SECTION_TITLE}>
          기본 정보
        </h2>
        <div className={CARD_ROWS}>
          <ProfileImageField prflImgUrl={prflImgUrl} mbrNcnm={mbrNcnm}>
            {snsTyCd ? (
              <>
                <span>
                  <SnsBadge snsTyCd={snsTyCd} />
                  {SNS_NAME[snsTyCd]} 계정으로 로그인 중
                </span>
                <small className="text-sm text-subtle">
                  연동 계정 · 수정불가
                </small>
              </>
            ) : (
              <>
                <Lock className="size-4 shrink-0" />
                <span>{acntEml}</span>
                <small className="text-sm text-subtle">
                  아이디로 사용 · 수정불가
                </small>
              </>
            )}
          </ProfileImageField>
          <NicknameField mbrNcnm={mbrNcnm} {...rowProps('nickname')} />
          <PhoneField mbrTelno={mbrTelno} {...rowProps('phone')} />
          {!snsTyCd && <PasswordChangeCard {...rowProps('password')} />}
        </div>
      </section>
      <section
        aria-labelledby="account-info-title"
        className="flex flex-col gap-5"
      >
        <h2 id="account-info-title" className={SECTION_TITLE}>
          계정 정보
        </h2>
        <div className={CARD_ROWS}>
          <AccountInfoCard
            snsTyCd={snsTyCd}
            mbrJoinPathCd={profile.mbrJoinPathCd}
            mbrRegDt={profile.mbrRegDt}
            mbrLastLgnDt={profile.mbrLastLgnDt}
          />
        </div>
      </section>
      <div className="-mt-6">
        <button
          type="button"
          onClick={onWithdraw}
          className="inline-flex items-center gap-1 text-subtle hover:text-ink"
        >
          회원 탈퇴
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
