type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-border bg-card/90 text-card-foreground shadow-sm backdrop-blur ${className}`}>
      {children}
    </div>
  );
}
