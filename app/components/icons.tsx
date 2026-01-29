import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

/* ================== زواج ================== */
/* فستان أنيق بدون علاقة – جسم انسيابي ولمعة فخمة */
export function IconWedding({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...props}>
      <path
        d="M32 10c4 0 6 4 6 8 0 6-4 10-6 12-2-2-6-6-6-12 0-4 2-8 6-8Z"
        fill="currentColor"
      />
      <path
        d="M20 56c6-18 8-22 12-26 4 4 6 8 12 26"
        fill="currentColor"
      />
    </svg>
  );
}

/* ================== خطوبة ================== */
export function IconEngagement({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...props}>
      <circle cx="32" cy="36" r="12" stroke="currentColor" strokeWidth="3" />
      <polygon
        points="32,10 38,18 32,22 26,18"
        fill="currentColor"
      />
    </svg>
  );
}

/* ================== عمل ================== */
export function IconWork({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...props}>
      <rect x="14" y="24" width="36" height="24" rx="4" stroke="currentColor" strokeWidth="3" />
      <path d="M24 24v-6h16v6" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

/* ================== عبايات ================== */
/* أنيقة بدون وجه */
export function IconAbaya({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...props}>
      <path
        d="M32 10c6 6 10 14 14 42H18c4-28 8-36 14-42Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ================== رمضان ================== */
/* هلال مع فانوس */
export function IconRamadan({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...props}>
      <path
        d="M36 10a18 18 0 1 0 0 36 14 14 0 1 1 0-36Z"
        fill="currentColor"
      />
      <rect x="40" y="22" width="6" height="10" rx="1" fill="currentColor" />
    </svg>
  );
}

/* ================== بحر ================== */
export function IconBeach({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...props}>
      <path
        d="M8 40c6-6 12-6 18 0s12 6 18 0 12-6 18 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ================== شاليهات ================== */
export function IconChalets({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} {...props}>
      <path d="M12 44c6-4 14-6 20-6s14 2 20 6" stroke="currentColor" strokeWidth="3" />
      <path d="M24 40V28l8-6 8 6v12" stroke="currentColor" strokeWidth="3" />
      <path d="M22 28l10-8 10 8" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}