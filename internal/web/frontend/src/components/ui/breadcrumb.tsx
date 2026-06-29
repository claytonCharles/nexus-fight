import { Link } from "react-router";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.to && !isLast ? (
              <Link to={item.to} className="transition hover:text-slate-900">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-slate-700" : ""}>{item.label}</span>
            )}
            {!isLast ? <span className="text-slate-400">/</span> : null}
          </div>
        );
      })}
    </nav>
  );
}
