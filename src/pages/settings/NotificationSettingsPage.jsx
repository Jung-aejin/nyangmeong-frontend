import NotificationSettingsForm from '@/features/notification/settings/NotificationSettingsForm';
import { useNotificationSettings } from '@/features/notification/queries';

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

      {isPending && <p className="text-[#566465]">불러오는 중이에요</p>}
      {isError && (
        <p role="alert" className="text-[#566465]">
          설정을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
        </p>
      )}
      {settings && <NotificationSettingsForm settings={settings} />}
    </div>
  );
}
