import Card from '@/components/Card';
import { PATHS } from '@/routes/paths';
import { CardTitle, MoreLink } from './SummaryParts';

/**
 * [알레르기 · 기저질환] (FN-HLT-011-05)
 * - 마이페이지 프로필의 두 필드를 각각 한 줄로 조회만 함. 빈 줄은 "등록된 내용 없음"
 * - [수정하러 가기]는 두 필드가 모두 비면 [입력하러 가기]. 입력하는 마이페이지 반려동물 관리로 보냄 (명세 FN-HLT-011-05는 링크 없음, 추가 요청)
 */
export default function ConditionCard({ profile, petSn }) {
  const isEmpty = !profile.allrgCn && !profile.undrlDiseCn;

  return (
    <Card
      title={
        <CardTitle icon="error">
          알레르기 · 기저질환
        </CardTitle>
      }
      sub={<span className="text-sm/[1.6]">진료 시 반드시 확인</span>}
      action={
        <MoreLink to={PATHS.MYPAGE_PETS} state={{ petSn }}>
          {isEmpty ? '입력하러 가기' : '수정하러 가기'}
        </MoreLink>
      }
      className="flex-1"
    >
      <Line label="알레르기" value={profile.allrgCn} />
      <div className="mt-4 border-t border-line-soft pt-4">
        <Line label="기저질환" value={profile.undrlDiseCn} />
      </div>
    </Card>
  );
}

function Line({ label, value }) {
  return (
    <div>
      <p className="text-sm/[1.6] text-subtle">{label}</p>
      <p className={`mt-1 ${value ? '' : 'text-placeholder'}`}>
        {value || '등록된 내용 없음'}
      </p>
    </div>
  );
}
