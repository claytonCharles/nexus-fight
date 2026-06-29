import { Outlet, Link, useLocation } from "react-router";
import { ChevronLeft, ChevronRight, Home, Menu, PanelLeft, Users, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Início", icon: Home },
  { to: "/students", label: "Alunos", icon: Users },
];

export default function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeLabel = navItems.find((n) => n.to === location.pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 border-r border-slate-200 bg-slate-950 p-6 text-slate-100 transition-all duration-300 
            ${sidebarCollapsed ? "w-20 lg:w-20" : "w-72 lg:w-72"} 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${sidebarCollapsed ? "flex items-center justify-center" : "flex items-center gap-3"}`}>
                <img src="/icon.svg" alt="Nexus Fight" className="h-8 w-8" />
                <span className={`transition-all duration-300 ${sidebarCollapsed ? "w-0 opacity-0" : "ml-2 text-sm font-semibold"}`}>Nexus Fight</span>
              </div>

              <button
                className="rounded-lg p-2 text-slate-300 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl text-sm font-medium transition ${sidebarCollapsed ? "justify-center px-0 py-3" : "px-4 py-3"
                    } ${active ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span className={sidebarCollapsed ? "hidden" : "block"}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen ? <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} /> : null}

        <div className={`flex-1 min-h-screen flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
          <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                <button
                  className="hidden rounded-xl hover:bg-slate-200 p-2 text-slate-600 lg:inline-flex"
                  onClick={() => setSidebarCollapsed((v) => !v)}
                  aria-label={sidebarCollapsed ? "Expandir sidebar" : "Retrair sidebar"}
                >
                  <PanelLeft />
                </button>

                <button className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <PanelLeft />
                </button>

                <nav className="ml-2 px-2 flex items-center gap-2 text-sm text-slate-600 border-l border-foreground">
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="text-slate-400">/</span>
                  <span className="font-medium text-slate-700">{activeLabel}</span>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-xl p-2 text-slate-600" aria-label="Trocar tema">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-9H21m-18 0H3m15.36 6.36l-.7.7M6.34 6.34l-.7.7m12.02 0l.7.7M6.34 17.66l.7.7M12 7a5 5 0 100 10 5 5 0 000-10z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}