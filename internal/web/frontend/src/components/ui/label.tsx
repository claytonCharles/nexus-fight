type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function Label({ required = false, className = "", children, ...props }: LabelProps) {
  return (
    <label className={`mb-1.5 block text-sm font-medium text-slate-700 ${className}`} {...props}>
      {children}
      {required ? <span className="ml-1 text-amber-600">*</span> : null}
    </label>
  );
}
