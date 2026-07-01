import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import AuthForm from "@/components/partials/auth-form";
import { useAuth } from "@/contexts/auth";
import { canRegister } from "@/services/auth";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading, login, setupFirstUser } = useAuth();
  const mode: "login" | "register" = location.pathname === "/register" ? "register" : "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState(
    (location.state as { email?: string; message?: string } | null)?.email ?? "",
  );
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [canRegisterState, setCanRegisterState] = useState(false);
  const [checkingRegister, setCheckingRegister] = useState(true);

  const from = (location.state as { from?: string } | null)?.from || "/";
  const successMessage =
    (location.state as { message?: string } | null)?.message ?? "";

  useEffect(() => {
    let ignore = false;

    async function checkRegisterStatus() {
      try {
        const response = await canRegister();
        if (!ignore) {
          setCanRegisterState(Boolean(response.can_register));
        }
      } catch {
        if (!ignore) {
          setCanRegisterState(false);
        }
      } finally {
        if (!ignore) {
          setCheckingRegister(false);
        }
      }
    }

    setCheckingRegister(true);
    void checkRegisterStatus();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (mode === "register" && !checkingRegister && !canRegisterState) {
      navigate("/login", { replace: true });
    }
  }, [canRegisterState, checkingRegister, mode, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (mode === "register") {
        await setupFirstUser(name, email, password);
        navigate("/login", {
          replace: true,
          state: {
            email,
            message: "Conta criada com sucesso. Faça login para continuar.",
          },
        });
        return;
      }

      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthForm
      mode={mode}
      name={name}
      email={email}
      password={password}
      submitting={submitting}
      error={error}
      successMessage={successMessage}
      canRegister={canRegisterState}
      onSubmit={handleSubmit}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSwitchMode={() => navigate(mode === "register" ? "/login" : "/register", { replace: true })}
    />
  );
}
