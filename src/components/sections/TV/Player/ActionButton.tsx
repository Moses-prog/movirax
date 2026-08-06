"use client";

import { cn } from "@/utils/helpers";
import { Tooltip } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

interface ActionButtonProps {
  label: string;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  tooltip?: string;
  disabled?: boolean;
  animationType?: "default" | "glow" | "bounce" | "spin" | "pulse" | "wiggle" | "flip";
  size?: "sm" | "md" | "lg";
  showRipple?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  href = "",
  children,
  onClick,
  tooltip,
  disabled,
  animationType = "default",
  size = "md",
  showRipple = true,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Add ripple effect
    if (showRipple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleId = Date.now();

      setRipples((prev) => [...prev, { id: rippleId, x, y }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 600);
    }

    // Click animation
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);

    onClick?.();
  };

  const sizeClasses = {
    sm: "[&>svg]:w-6 [&>svg]:h-6",
    md: "[&>svg]:w-8 [&>svg]:h-8",
    lg: "[&>svg]:w-10 [&>svg]:h-10",
  };

  const animationClasses = {
    default: "hover:[&>svg]:scale-125 [&>svg]:hover:text-warning",
    glow: `hover:[&>svg]:scale-125 [&>svg]:hover:text-warning 
            hover:drop-shadow-[0_0_12px_rgba(251,146,60,0.6)]
            hover:animate-pulse`,
    bounce: `hover:[&>svg]:scale-110 [&>svg]:hover:text-warning
             hover:animate-bounce`,
    spin: `hover:[&>svg]:scale-125 [&>svg]:hover:text-warning
           hover:[&>svg]:animate-spin`,
    pulse: `hover:[&>svg]:scale-125 [&>svg]:hover:text-warning
            [&>svg]:hover:animate-pulse`,
    wiggle: `hover:[&>svg]:scale-125 [&>svg]:hover:text-warning
             hover:[&>svg]:animate-wiggle`,
    flip: `hover:[&>svg]:scale-125 [&>svg]:hover:text-warning
           hover:[&>svg]:animate-flip`,
  };

  const Button = (
    <Tooltip content={tooltip} isDisabled={disabled || !tooltip} showArrow placement="bottom">
      <button
        aria-label={label}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          `group relative drop-shadow-md [&>svg]:transition-all [&>svg]:duration-300
           active:scale-95 transition-transform duration-150
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-2
           focus-visible:ring-offset-background`,
          sizeClasses[size],
          {
            [animationClasses[animationType]]: !disabled,
            "cursor-not-allowed opacity-50": disabled,
            "scale-90": isClicked,
          }
        )}
      >
        {/* Ripple effect container */}
        {showRipple && (
          <span className="absolute inset-0 overflow-hidden rounded-full">
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute animate-ripple bg-warning/30 rounded-full pointer-events-none"
                style={{
                  width: "20px",
                  height: "20px",
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </span>
        )}

        {/* Glow background for glow animation */}
        {animationType === "glow" && (
          <span className="absolute -inset-2 bg-gradient-to-r from-warning/0 via-warning/20 to-warning/0 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        )}

        {children}
      </button>
    </Tooltip>
  );

  return href ? (
    <Link href={href} className="flex items-center group">
      {Button}
    </Link>
  ) : (
    Button
  );
};

export default ActionButton;