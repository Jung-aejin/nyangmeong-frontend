import { Newspaper } from 'lucide-react';
import { useState } from 'react';

/** 언론사 썸네일 URL로 표시. 없거나 불러오지 못하면 자리 표시 */
export default function NewsThumb({ src, className = '', iconSize = 40 }) {
  const [failed, setFailed] = useState(false);
  const base = `overflow-hidden rounded-[10px] bg-[#f4f6f6] ${className}`;

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`grid place-items-center border border-dashed border-[#b9c4c4] text-[#b9c4c4] ${base}`}
      >
        <Newspaper size={iconSize} />
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${base}`}
    />
  );
}
