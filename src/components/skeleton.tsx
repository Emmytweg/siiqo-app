import React from "react";
import clsx from "clsx";

interface SkeletonProps {
  type?: "rect" | "circle" | "text";
  count?: number;
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  type = "rect",
  count = 1,
  width,
  height,
  radius,
  className,
}) => {
  const baseClasses =
    "relative overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse";
  const shimmerClasses =
    "absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent";

  const getShape = () => {
    switch (type) {
      case "circle":
        return "rounded-full";
      case "text":
        return "rounded-md h-4";
      case "rect":
      default:
        return "rounded-lg";
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(baseClasses, getShape(), className)}
          style={{
            width,
            height,
            borderRadius: radius,
          }}
        >
          <div className={shimmerClasses} />
        </div>
      ))}
    </>
  );
};

export default Skeleton;
