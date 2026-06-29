import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Página não encontrada
        </h1>
        <p className="mt-3 text-base text-slate-600">
          A URL informada não corresponde a uma página disponível no sistema.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/">
            <Button variant="primary">Voltar ao início</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
