type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function Label({ required = false, className = "", children, ...props }: LabelProps) {
  return (
    <label className={`mb-1.5 block text-sm font-medium text-muted-foreground ${className}`} {...props}>
      {children}
      {required ? <span className="ml-1 text-primary">*</span> : null}
    </label>
  );
}
