import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export default function Input({ label, error, hint, id, className = "", ...props }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 sm:py-2.5 rounded-xl border text-base sm:text-sm outline-none
          transition-all duration-150
          focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-400
          ${error
            ? "border-red-400 bg-red-50 focus:ring-red-400/30 focus:border-red-400"
            : "border-gray-200 bg-white hover:border-gray-300"
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
      {hint && !error && <p className="text-gray-400 text-xs">{hint}</p>}
    </div>
  );
}
