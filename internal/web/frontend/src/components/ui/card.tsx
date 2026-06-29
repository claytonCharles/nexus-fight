type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white/90 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur ${className}`}>
      {children}
    </div>
  );
}
