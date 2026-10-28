import { showToast } from '@/components/toastStore';
import { LOGIN_MESSAGES as MSG } from './loginMessages';
import { GoogleLogo, KakaoLogo, NaverLogo } from './SnsLogos';

const BASE =
  'relative flex h-12 w-full items-center justify-center rounded-xl px-12 font-semibold hover:brightness-[.97]';

const PROVIDERS = [
  { name: '네이버', Logo: NaverLogo, style: 'bg-[#03A94D] text-white' },
  { name: '카카오', Logo: KakaoLogo, style: 'bg-[#fee500] text-[#191600]' },
  {
    name: '구글',
    Logo: GoogleLogo,
    style: 'border border-input-line bg-white text-ink',
  },
];

// 외부 인증창은 백엔드 OAuth가 나온 뒤 연결한다. 지금은 안내만 보인다
export default function SnsLoginButtons() {
  return (
    <div className="flex flex-col gap-3">
      {PROVIDERS.map((provider) => {
        const Logo = provider.Logo;
        return (
          <button
            key={provider.name}
            type="button"
            onClick={() => showToast(MSG.notReady)}
            className={`${BASE} ${provider.style}`}
          >
            <span className="absolute top-1/2 left-3 grid size-7 -translate-y-1/2 place-items-center">
              <Logo />
            </span>
            {provider.name}로 로그인하기
          </button>
        );
      })}
    </div>
  );
}
