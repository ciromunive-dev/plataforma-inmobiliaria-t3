import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "outline" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
};

const styles: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md border border-transparent",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm border border-transparent",
  outline: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100 border border-transparent",
};

const sizes = {
  sm: "min-h-[36px] px-3 py-1.5 text-xs",
  md: "min-h-[44px] px-4 py-2.5 text-sm",
  lg: "min-h-[52px] px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  size = "md",
  disabled,
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      disabled={disabled ?? loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-150 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${styles[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
