import {
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  X,
} from 'lucide-react';
import { KIND, PLACES, SPOTS } from './placeData';

// 이름과 좌표로 카카오맵 링크를 만든다. 장소 ID가 없어도 해당 위치에 이름 핀이 찍힌다
const kakaoMapLink = (type, name, [lat, lng]) =>
  `https://map.kakao.com/link/${type}/${encodeURIComponent(name)},${lat},${lng}`;

export default function PlacePopup({ id, onClose }) {
  const place = PLACES[id];
  const spot = SPOTS[id];
  return (
    <div
      role="dialog"
      aria-label={`${place.name} 요약`}
      className="absolute bottom-8 left-1/2 z-[4] w-[min(360px,calc(100%-32px))] -translate-x-1/2 rounded-modal bg-white p-5 shadow-depth-md max-md:bottom-[calc(var(--sheet-peek)+16px)]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full text-muted hover:bg-surface-2"
      >
        <X className="size-5" />
      </button>
      <span className="mb-1 block text-sm text-subtle">
        {KIND[place.cat]} · {place.d.toFixed(1)}km
      </span>
      <h3 className="pr-8 text-xl font-bold text-ink">{place.name}</h3>
      <dl className="mt-3 grid grid-cols-[20px_minmax(0,1fr)] gap-x-2 gap-y-1.5 text-sm text-ink-2">
        <dt>
          <Clock className="size-[18px] text-subtle" />
        </dt>
        <dd>
          <b className="font-semibold text-tone-green-fg">{place.open}</b> ·{' '}
          {place.hours}
        </dd>
        <dt>
          <Phone className="size-[18px] text-subtle" />
        </dt>
        <dd>{place.phone}</dd>
        <dt>
          <MapPin className="size-[18px] text-subtle" />
        </dt>
        <dd>{place.addr}</dd>
      </dl>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={kakaoMapLink('map', place.name, spot)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-brand-500 font-semibold text-white hover:bg-brand-600"
        >
          상세보기
          <ExternalLink className="size-[18px]" />
        </a>
        <a
          href={kakaoMapLink('to', place.name, spot)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-input-line bg-white font-semibold text-ink-2 hover:bg-surface-2"
        >
          <Navigation className="size-[18px]" />
          길찾기
        </a>
      </div>
    </div>
  );
}
