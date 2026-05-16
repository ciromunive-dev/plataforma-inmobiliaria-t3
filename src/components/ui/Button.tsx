import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "outline";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
};

const styles: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 border border-transparent",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent",
  danger: "bg-red-500 text-white hover:bg-red-600 border border-transparent",
  outline: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
};

export default function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      disabled={disabled ?? loading}
      className={`
        inline-flex items-center justify-center gap-2
        min-h-[44px] px-4 py-2.5 rounded-lg text-sm font-medium
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${styles[variant]}
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
