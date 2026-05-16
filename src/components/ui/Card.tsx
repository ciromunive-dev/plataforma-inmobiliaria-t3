import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  padding?: "sm" | "md" | "lg";
};

const paddings = { sm: "p-3 sm:p-4", md: "p-4 sm:p-6", lg: "p-5 sm:p-8" };

export default function Card({ padding = "md", className = "", children, ...props }: Props) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
