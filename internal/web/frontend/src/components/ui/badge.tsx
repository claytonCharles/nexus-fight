type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ${className}`}>
      {children}
    </span>
  );
}
