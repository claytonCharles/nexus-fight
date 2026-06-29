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
      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 ${
        error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-slate-300"
      } ${className}`}
      {...props}
    />
  );
});
