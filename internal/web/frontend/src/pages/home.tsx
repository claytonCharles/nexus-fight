import { Card } from "@/components/ui/card";
import { BreadcrumbContext } from "@/contexts/breadcrumb";

import { useContext } from "react";

export default function Home() {
  const breadcrumb = useContext(BreadcrumbContext);
  breadcrumb?.setBreadcrumb([{ label: "Dashboard", to: "/" }]);

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <Card className="max-w-4xl">
        <div className="p-6">
          <p className="text-sm text-muted-foreground">Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold text-card-foreground">Nexus Fight</h1>
          <p className="mt-1 text-muted-foreground">Bem vindo ao painel administrativo.</p>
        </div>
      </Card>
    </section>
  );
}