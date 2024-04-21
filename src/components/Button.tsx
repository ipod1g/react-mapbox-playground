import { forwardRef } from "react";

import { cn } from "@/utils";

import type { ReactElement, ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200",
  inverse:
    "text-white border-2 border-gray-600 hover:border-yellow-300 hover:text-yellow-200 ",
  danger: "bg-red-600 text-white",
};

const sizes = {
  sm: "py-2 px-4 text-sm md:text-base",
  md: "py-2 px-6 text-base",
  lg: "py-3 px-8 text-lg",
};

type IconProps =
  | { startIcon: ReactElement; endIcon?: never }
  | { endIcon: ReactElement; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined };

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
} & IconProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "button",
      className = "",
      variant = "primary",
      size = "md",
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed rounded-md shadow-sm font-medium focus:outline-none",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        type={type}
        {...props}
      >
        {startIcon}
        <span className="mx-2">{props.children}</span> {endIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
