import { Link } from "react-router-dom";

/** A play button with a gold reel dot. */
export function LogoMark({ size = 34, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="13" fill="#c8283a" />
      <path d="M18 13.5v21a1.5 1.5 0 0 0 2.3 1.3l17-10.5a1.5 1.5 0 0 0 0-2.6l-17-10.5A1.5 1.5 0 0 0 18 13.5z" fill="#fff" />
      <circle cx="12" cy="35" r="4.6" fill="#fbbf24" stroke="#c8283a" strokeWidth="2.2" />
    </svg>
  );
}

export default function Brand({ className = "" }) {
  return (
    <Link to="/" aria-label="Movie Portal home" className={`inline-flex w-fit items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="whitespace-nowrap text-[20px] font-bold leading-none tracking-[-0.045em] text-ink sm:text-[22px]">
        Movie <span className="accent text-[26px]">Portal</span>
      </span>
    </Link>
  );
}
