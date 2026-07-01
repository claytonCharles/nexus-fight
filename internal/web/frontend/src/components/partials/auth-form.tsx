import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "login" | "register";
  name: string;
  email: string;
  password: string;
  submitting: boolean;
  error: string;
  successMessage?: string;
  canRegister: boolean;
  onSubmit: (event: React.FormEvent) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSwitchMode: () => void;
};

export default function AuthForm({
  mode,
  name,
  email,
  password,
  submitting,
  error,
  successMessage = "",
  canRegister,
  onSubmit,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSwitchMode,
}: AuthFormProps) {
  const isRegister = mode === "register";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="space-y-2 text-center">
          <span className="flex flex-col justify-center items-center gap-2">
            <img src="/icon.svg" alt="Nexus Fight" className="size-10" />
            <p className="text-md font-bold uppercase tracking-[0.2em] text-foreground ">Nexus Fight</p>
          </span>
          <h1 className="text-2xl font-semibold text-card-foreground">
            {isRegister ? "Criar conta" : "Entrar no sistema"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRegister
              ? "Crie a primeira conta para começar a utilizar o painel."
              : "Acesse o painel com seu e-mail e senha."}
          </p>
        </div>

        {successMessage ? (
          <p className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm text-primary">
            {successMessage}
          </p>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {isRegister ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Nome</label>
              <Input
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="Seu nome"
                required
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">E-mail</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button className="w-full" type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : isRegister ? "Criar conta" : "Entrar"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isRegister ? (
            <button type="button" className="font-medium text-primary hover:underline" onClick={onSwitchMode}>
              Já tenho uma conta
            </button>
          ) : (
            <button
              type="button"
              className={`font-medium ${canRegister ? "text-primary hover:underline" : "cursor-not-allowed text-muted-foreground"}`}
              onClick={canRegister ? onSwitchMode : undefined}
              disabled={!canRegister}
            >
              {canRegister ? "Criar primeira conta" : ""}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
