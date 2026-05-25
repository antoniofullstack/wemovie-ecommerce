import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success";
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-primary hover:bg-primary/90",
    success: "bg-success hover:bg-success/90",
  };

  return (
    <button
      className={`flex h-10 cursor-pointer items-center justify-center rounded text-xs font-bold uppercase text-white transition-colors ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
