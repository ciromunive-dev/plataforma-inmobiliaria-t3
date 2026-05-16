import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
};

const paddings = { none: "", sm: "p-3 sm:p-4", md: "p-4 sm:p-6", lg: "p-5 sm:p-8" };

export default function Card({ padding = "md", hover = false, className = "", children, ...props }: Props) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-sm
        ${paddings[padding]}
        ${hover ? "transition-all duration-200 hover:shadow-md hover:border-gray-200 cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
