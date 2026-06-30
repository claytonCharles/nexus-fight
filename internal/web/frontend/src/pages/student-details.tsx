import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deactivateStudent, getStudent } from "@/services/students";
import { listBioimpedances } from "@/services/bioimpedance";
import type { Student } from "@/types/students";
import type { Bioimpedance } from "@/types/bioimpedance";
import CreateStudentModal from "@/components/partials/create-student-modal";
import BioimpedanceCreateModal from "@/components/partials/bioimpedance-create-modal";
import BioimpedanceDetailsModal from "@/components/partials/bioimpedance-details-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useSafeBack from "@/hooks/use-back-safe";
import { ArrowLeftIcon } from "lucide-react";
import { BreadcrumbContext } from "@/contexts/breadcrumb";

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const safeBack = useSafeBack("/students");
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openBioCreateModal, setOpenBioCreateModal] = useState(false);
  const [openBioDetailsModal, setOpenBioDetailsModal] = useState(false);
  const [bioimpedances, setBioimpedances] = useState<Bioimpedance[]>([]);
  const [bioLoading, setBioLoading] = useState(true);
  const [selectedBio, setSelectedBio] = useState<Bioimpedance | null>(null);
  const breadcrumb = useContext(BreadcrumbContext);
  breadcrumb?.setBreadcrumb([
    { label: "Dashboard", to: "/" },
    { label: "Alunos", to: "/students" },
    { label: student?.name ?? "Aluno" }
  ]);

  const formatDate = useCallback((value?: string | Date | null) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("pt-BR");
  }, []);

  const formatActive = useCallback((value: number) => (value === 1 ? "Ativo" : "Inativo"), []);

  const fetchStudent = useCallback(async () => {
    if (!id) {
      setError("Aluno não informado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getStudent(id);
      setStudent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchBioimpedances = useCallback(async () => {
    if (!id) {
      setBioLoading(false);
      return;
    }

    try {
      setBioLoading(true);
      const list = await listBioimpedances(id);
      setBioimpedances(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar bioimpedâncias.");
    } finally {
      setBioLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
    fetchBioimpedances();
  }, [fetchStudent, fetchBioimpedances]);

  const handleDeactivateStudent = async () => {
    if (!student || !id) {
      return;
    }

    if (!window.confirm("Deseja realmente desativar este aluno?")) {
      return;
    }

    try {
      await deactivateStudent(id);
      navigate("/students");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      setError(message === "Não foi possível remover o aluno." ? "Este aluno já está desativado ou não pode ser removido." : message);
    }
  };

  const handleOpenBio = (bio: Bioimpedance) => {
    setSelectedBio(bio);
    setOpenBioDetailsModal(true);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={safeBack}>
            <ArrowLeftIcon className="size-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">Detalhes do aluno</h2>
            <p className="text-sm text-muted-foreground">Informações completas do estudante selecionado</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setOpenBioCreateModal(true)}>
            Adicionar bioimpedância
          </Button>
          <Button variant="secondary" onClick={() => setOpenEditModal(true)}>
            Editar aluno
          </Button>
        </div>
      </div>

      <CreateStudentModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSuccess={async () => {
          setOpenEditModal(false);
          await fetchStudent();
        }}
        studentToEdit={student}
      />

      <BioimpedanceCreateModal
        open={openBioCreateModal}
        onClose={() => setOpenBioCreateModal(false)}
        onSuccess={async () => {
          await fetchBioimpedances();
        }}
        student_id={id ?? ""}
      />

      <BioimpedanceDetailsModal
        open={openBioDetailsModal}
        onClose={() => setOpenBioDetailsModal(false)}
        bio={selectedBio}
      />

      {loading ? (
        <div className="flex justify-center rounded-3xl border border-border bg-card p-12 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
          {error}
        </div>
      ) : student ? (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Aluno</p>
                <h3 className="mt-2 text-3xl font-semibold text-card-foreground">{student.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{student.email ?? "Email não informado"}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${student.active === 1 ? "bg-emerald-100 text-emerald-700" : "bg-muted/50 text-muted-foreground"}`}>
                  {formatActive(student.active)}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setOpenEditModal(true)}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={handleDeactivateStudent}>
                  Desativar
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-border bg-popover p-4">
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="mt-2 text-lg font-semibold text-card-foreground">{student.phone ?? "-"}</p>
              </div>
              <div className="rounded-3xl border border-border bg-popover p-4">
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="mt-2 text-lg font-semibold text-card-foreground">{student.cpf ?? "-"}</p>
              </div>
              <div className="rounded-3xl border border-border bg-popover p-4">
                <p className="text-sm text-muted-foreground">Sexo</p>
                <p className="mt-2 text-lg font-semibold text-card-foreground">{student.gender === "F" ? "Feminino" : "Masculino"}</p>
              </div>
              <div className="rounded-3xl border border-border bg-popover p-4">
                <p className="text-sm text-muted-foreground">Órgão</p>
                <p className="mt-2 text-lg font-semibold text-card-foreground">{student.headquarters || "-"}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-3xl border border-border bg-card/80 p-4">
                <p className="text-sm text-muted-foreground">Aniversário</p>
                <p className="mt-2 text-lg font-semibold text-card-foreground">{formatDate(student.birthday)}</p>
              </div>
              <div className="rounded-3xl border border-border bg-card/80 p-4">
                <p className="text-sm text-muted-foreground">Cadastro</p>
                <p className="mt-2 text-lg font-semibold text-card-foreground">{formatDate(student.created_at)}</p>
              </div>
              <div className="rounded-3xl border border-border bg-card/80 p-4">
                <p className="text-sm text-muted-foreground">Última atualização</p>
                <p className="mt-2 text-lg font-semibold text-card-foreground">{formatDate(student.updated_at)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Bioimpedâncias</p>
                <h3 className="mt-2 text-2xl font-semibold text-card-foreground">Registros do aluno</h3>
              </div>
              <Button variant="primary" onClick={() => setOpenBioCreateModal(true)}>
                Novo registro
              </Button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {bioLoading ? (
                <div className="col-span-full rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
                  Carregando registros...
                </div>
              ) : bioimpedances.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-border bg-popover p-8 text-center text-muted-foreground">
                  Nenhuma bioimpedância cadastrada ainda.
                </div>
              ) : (
                bioimpedances.map((bio) => (
                  <div key={bio.id} className="rounded-3xl border border-border bg-popover p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Registrado em</p>
                        <p className="mt-1 text-lg font-semibold text-card-foreground">{formatDate(bio.created_at)}</p>
                      </div>
                      <Badge>{bio.body_age} anos</Badge>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl border border-border bg-card/70 p-4">
                        <p className="text-sm text-muted-foreground">Peso</p>
                        <p className="mt-1 text-lg font-semibold text-card-foreground">{bio.weight} kg</p>
                      </div>
                      <div className="rounded-3xl border border-border bg-card/70 p-4">
                        <p className="text-sm text-muted-foreground">Gordura</p>
                        <p className="mt-1 text-lg font-semibold text-card-foreground">{bio.body_fat_percent} %</p>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <Button variant="secondary" onClick={() => handleOpenBio(bio)}>
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      ) : null}
    </section>
  );
}
