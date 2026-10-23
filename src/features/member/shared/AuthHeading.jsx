export default function AuthHeading({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="mb-1.5 text-[26px] font-bold tracking-[-0.02em] text-ink max-md:text-2xl">
        {title}
      </h2>
      <p className="text-sm leading-normal text-subtle">{subtitle}</p>
    </div>
  );
}
