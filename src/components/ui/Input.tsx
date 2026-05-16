import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, id, className = "", ...props }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 sm:py-2.5 rounded-lg border text-base sm:text-sm outline-none
          transition-all duration-150
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-400
          ${error ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400" : "border-gray-300 bg-white"}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}
