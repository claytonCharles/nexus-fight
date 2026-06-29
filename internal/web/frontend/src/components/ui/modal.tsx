import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">{title}</h3>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>

          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 py-6 text-card-foreground">{children}</div>

        {footer ? <div className="flex justify-end gap-2 border-t border-border px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
