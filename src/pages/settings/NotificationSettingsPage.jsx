import PageSkeleton from '@/components/PageSkeleton';
import SkeletonCard from '@/components/SkeletonCard';
import NotificationSettingsForm from '@/features/notification/settings/NotificationSettingsForm';
import { useNotificationSettings } from '@/features/notification/queries';

/** 로딩 자리: 설정 카드별 높이 */
const SETTING_CARD_HEIGHTS = [
  'h-[216px]',
  'h-[298px]',
  'h-[137px]',
  'h-[216px]',
  'h-[190px]',
  'h-[286px]',
];

export default function NotificationSettingsPage() {
  const { data: settings, isPending, isError } = useNotificationSettings();

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-14">
      <section className="mb-5 rounded-[20px] border border-[#d3e2dc] bg-[#e6efeb] px-8 py-9">
        <p className="text-base font-medium text-[#285a5c]">Settings</p>
        <h1 className="text-2xl font-bold text-[#1a3234]">설정</h1>
        <p className="text-base text-[#566465]">
          어떤 알림을 어디로 받을지 정해요
        </p>
      </section>

      {isPending && (
        <PageSkeleton>
          {SETTING_CARD_HEIGHTS.map((height, index) => (
            <SkeletonCard key={index} className={height} />
          ))}
        </PageSkeleton>
      )}
      {isError && (
        <p role="alert" className="text-[#566465]">
          설정을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
        </p>
      )}
      {settings && <NotificationSettingsForm settings={settings} />}
    </div>
  );
}
