import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", error = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-xl border bg-input px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
        error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border"
      } ${className}`}
      {...props}
    />
  );
});
