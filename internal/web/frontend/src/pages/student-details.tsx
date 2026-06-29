import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { deactivateStudent, getStudent } from "@/services/students";
import type { Student } from "@/types/students";
import CreateStudentModal from "@/components/partials/create-student-modal";

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Aluno não informado.");
      setLoading(false);
      return;
    }

    async function fetchStudent() {
      try {
        setLoading(true);
        setError("");
        const data = await getStudent(id as string);
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  function formatDate(value?: string | Date | null) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("pt-BR");
  }

  function formatActive(value: number) {
    return value === 1 ? "Ativo" : "Inativo";
  }

  async function handleDeactivateStudent() {
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
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Detalhes do aluno</h2>
          <p className="text-slate-500">Informações completas do estudante selecionado.</p>
        </div>

        <Link
          to="/students"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Voltar para a lista
        </Link>
      </div>

      <CreateStudentModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSuccess={() => {
          setOpenEditModal(false);
          if (id) {
            getStudent(id as string).then(setStudent).catch(() => setError("Não foi possível atualizar os dados do aluno."));
          }
        }}
        studentToEdit={student}
      />

      {loading ? (
        <div className="flex justify-center rounded-lg border bg-white p-12 shadow">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      ) : student ? (
        <div className="rounded-lg border bg-white p-8 shadow">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold">{student.name}</h3>
              <p className="text-slate-500">{student.email ?? "Email não informado"}</p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  student.active === 1 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
                }`}
              >
                {formatActive(student.active)}
              </span>

              <button
                onClick={() => setOpenEditModal(true)}
                className="rounded border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
              >
                Editar
              </button>

              <button
                onClick={handleDeactivateStudent}
                className="rounded border border-red-600 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                Deletar
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-slate-500">Telefone</p>
              <p className="mt-1 text-base">{student.phone ?? "-"}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-slate-500">CPF</p>
              <p className="mt-1 text-base">{student.cpf ?? "-"}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-slate-500">Sexo</p>
              <p className="mt-1 text-base">{student.gender === "F" ? "Feminino" : "Masculino"}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-slate-500">Órgão</p>
              <p className="mt-1 text-base">{student.headquarters}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-slate-500">Aniversário</p>
              <p className="mt-1 text-base">{formatDate(student.birthday)}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-slate-500">Cadastro</p>
              <p className="mt-1 text-base">{formatDate(student.created_at)}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-slate-500">Última atualização</p>
              <p className="mt-1 text-base">{formatDate(student.updated_at)}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
