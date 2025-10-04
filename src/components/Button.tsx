"use client";

import React from "react";
import clsx from "clsx";

type Variant = "orange" | "navy" | "outline";
type Size = "sm" | "md" | "lg";

interface AppButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  title?: string;
  ariaLabel?: "buton" | "";
  fullWidth?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<AppButtonProps> = ({
  children,
  variant = "orange",
  size = "md",
  title,
  ariaLabel,
  fullWidth = false,
  className,
  onClick,
  disabled = false,
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles: Record<Variant, string> = {
    orange:
      "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500",
    navy: "hover:bg-slate-800 bg-slate-900 text-white focus:ring-primary-700",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizeStyles: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
