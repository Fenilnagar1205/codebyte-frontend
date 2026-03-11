const variants = {
  primary: "btn-primary",
  ghost:   "btn-ghost",
  danger:  "bg-transparent text-orange border border-orange rounded-lg px-6 py-3 text-[15px] font-semibold transition-all duration-200 hover:bg-orange/10 disabled:opacity-50",
};

const sizes = {
  sm: "!px-4 !py-2 !text-[13px]",
  md: "",
  lg: "!px-9 !py-3.5 !text-base",
};

export default function Button({
  children,
  variant  = "primary",
  size     = "md",
  fullWidth = false,
  glow     = false,
  disabled = false,
  onClick,
  type     = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        variants[variant] || variants.primary,
        sizes[size],
        fullWidth ? "w-full" : "",
        glow      ? "animate-glow" : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
