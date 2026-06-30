import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

const baseClasses = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

const variantClasses = {
  primary: "bg-primary text-primary-foreground hover:brightness-90 focus:ring-primary shadow-sm",
  secondary: "border border-border bg-card text-card-foreground hover:bg-popover focus:ring-ring",
  ghost: "hover:bg-accent hover:text-accent-foreground text-foreground",
  danger: "bg-destructive text-destructive-foreground hover:brightness-90 focus:ring-destructive shadow-sm",
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
  icon: "size-9",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", variant = "primary", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
});
