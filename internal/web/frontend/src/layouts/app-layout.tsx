import { Outlet, Link, useLocation } from "react-router";
import { Home, PanelLeft, Users, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/theme";
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
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 border-r border-sidebar-border bg-sidebar p-6 text-sidebar-foreground transition-all duration-300 
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
                    } ${active ? "bg-primary text-primary-foreground shadow-lg" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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

        {sidebarOpen ? <div className="fixed inset-0 z-30 bg-sidebar/40 lg:hidden" onClick={() => setSidebarOpen(false)} /> : null}

        <div className={`flex-1 min-h-screen flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
          <header className="border-b border-border bg-card px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                <button
                  className="hidden rounded-xl hover:bg-popover p-2 text-foreground lg:inline-flex"
                  onClick={() => setSidebarCollapsed((v) => !v)}
                  aria-label={sidebarCollapsed ? "Expandir sidebar" : "Retrair sidebar"}
                >
                  <PanelLeft />
                </button>

                <button className="rounded-xl border border-border p-2 text-foreground lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <PanelLeft />
                </button>

                <nav className="ml-2 px-2 flex items-center gap-2 text-sm text-muted-foreground border-l border-border">
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="font-medium text-card-foreground">{activeLabel}</span>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-xl p-2 text-slate-600" aria-label="Trocar tema" onClick={() => toggleTheme()}>
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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