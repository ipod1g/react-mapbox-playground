import { cn } from "@/utils";

import type { HTMLAttributes } from "react";

const variants = {
  success: "bg-blue-300/20 text-blue-500",
  neutral: "bg-gray-300/20 text-gray-500",
  error: "bg-red-300/20 text-red-500",
};

export type ChipProps = HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof variants;
};

export const Chip = ({
  className = "",
  variant = "neutral",
  ...props
}: ChipProps) => {
  return (
    <div
      className={cn("px-6 py-2 rounded-full", variants[variant], className)}
      {...props}
    >
      {props.children}
    </div>
  );
};

Chip.displayName = "Chip";
