import Card from '@/components/Card';
import { CardTitle } from './SummaryParts';

/**
 * [알레르기 · 기저질환] (FN-HLT-011-05)
 * - 마이페이지 프로필의 두 필드를 각각 한 줄로 조회만 함. 빈 줄은 "등록된 내용 없음", [전체 보기] 없음
 */
export default function ConditionCard({ profile }) {
  return (
    <Card
      title={
        <CardTitle icon="error">
          알레르기 · 기저질환
        </CardTitle>
      }
      sub="진료 시 반드시 확인"
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
