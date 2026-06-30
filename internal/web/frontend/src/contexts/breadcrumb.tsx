import { createContext } from "react";
import type { BreadcrumbItem } from "@/components/ui/breadcrumb";

export type BreadcrumbContextType = {
  setBreadcrumb: (items: BreadcrumbItem[]) => void;
};

export const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);