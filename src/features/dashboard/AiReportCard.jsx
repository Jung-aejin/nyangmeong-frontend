import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export default function AiReportCard({ petNm, report }) {
  return (
    <section className="flex flex-col rounded-card border border-[#e8d27e] bg-[#fbe9a0] px-8 py-5 shadow-depth-sm max-[700px]:p-4">
      <div className="flex min-h-8 items-center justify-between gap-2 border-b border-[#e8d27e] pb-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-full bg-brand-500 text-[#fbe9a0]">
            <Sparkles className="size-[18px]" aria-hidden="true" />
          </span>
          AI 건강분석 리포트
        </h3>
        <span className="shrink-0 text-sm text-ink-2">최근 기록 기반</span>
      </div>
      <div className="mt-6 rounded-[4px] border border-[#e8d27e] bg-[#fffcf2] px-5 pt-6 pb-5">
        <p className="text-xl leading-snug font-bold text-brand-500">
          “{petNm}는 지금 {report.title}”
        </p>
        <ul className="mt-3 grid gap-2 border-t border-dashed border-[#e3d08a] pt-3">
          {report.tips.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-1.5 text-sm leading-normal text-ink-2"
            >
              <Check
                className="mt-0.5 size-[18px] shrink-0 text-tone-green-fg"
                aria-hidden="true"
              />
              {tip}
            </li>
          ))}
        </ul>
      </div>
      <Link
        to={PATHS.HEALTH}
        className="mt-auto self-end pt-4 font-semibold text-brand-600 hover:underline"
      >
        종합건강기록 &gt;
      </Link>
    </section>
  );
}
