interface SignalMarkProps {
  className?: string;
  color?: string;
}

export default function SignalMark({ className, color = "currentColor" }: SignalMarkProps) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      className={className}
      aria-hidden="true"
    >
      <circle cx="6" cy="28" r="2.4" fill={color} />
      <path d="M11 28a9 9 0 0 1 9-9" stroke={color} strokeWidth="2" fill="none" />
      <path
        d="M11 28a15.5 15.5 0 0 1 15.5-15.5"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );
}
