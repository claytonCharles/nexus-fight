import { Outlet, Link } from "react-router";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="h-16 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <h1 className="text-lg font-semibold">
            Nexus Fight
          </h1>

          <nav className="flex gap-6">
            <Link to="/">Home</Link>
            <Link to="/students">Alunos</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-8">
        <Outlet />
      </main>
    </div>
  );
}