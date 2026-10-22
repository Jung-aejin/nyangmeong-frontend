import { MapPin } from 'lucide-react';

/**
 * 동네 인근 대략적인 위치 자리: 공개 화면에는 정확한 좌표를 주지 않아 지도 대신 반경 표시만 그린다
 * - area: 「서곡동 인근」처럼 라벨에 쓰는 문구
 * - isTall: 상세 화면의 큰 지도(320px), 글쓰기 미리보기는 200px
 */
export default function CareAreaMap({ area, isTall = false, className = '' }) {
  return (
    <div
      role="img"
      aria-label={`${area} 대략적인 위치`}
      className={`relative ${isTall ? 'h-[320px]' : 'h-[200px]'} overflow-hidden rounded-lg border border-line bg-[#f1f5f3] bg-[linear-gradient(0deg,rgba(255,255,255,0.55),rgba(255,255,255,0.55)),repeating-linear-gradient(0deg,#e6ecea_0_1px,transparent_1px_40px),repeating-linear-gradient(90deg,#e6ecea_0_1px,transparent_1px_40px)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -mt-[60px] -ml-[60px] size-[120px] rounded-full border-[1.5px] border-dashed border-brand-500 bg-brand-500/12"
      />
      <span className="absolute bottom-3 left-3 inline-flex h-7 items-center gap-1 rounded-full bg-white px-2.5 text-sm text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)]">
        <MapPin size={14} aria-hidden="true" className="text-brand-500" />
        {area}
      </span>
    </div>
  );
}
