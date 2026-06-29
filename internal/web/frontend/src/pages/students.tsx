import { useEffect, useState } from "react";
import { listStudents } from "@/services/students";
import type { Student } from "@/types/students";
import CreateStudentModal from "@/components/partials/create-student-modal";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  async function fetchStudents() {
    try {
      setLoading(true);
      setError("");

      const data = await listStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <CreateStudentModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchStudents}
      />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              Alunos
            </h2>

            <p className="text-slate-500">
              Lista de alunos cadastrados.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Adicionar aluno
          </button>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-5xl rounded-lg border bg-white shadow">
            <table className="w-full border-collapse">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Telefone</th>
                  <th className="px-4 py-3 text-left">Aniversário</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="h-80">
                      <div className="flex h-full items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="h-80 text-center text-red-600"
                    >
                      {error}
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="h-80 text-center text-slate-500"
                    >
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">{student.email ?? "-"}</td>
                      <td className="px-4 py-3">{student.phone ?? "-"}</td>
                      <td className="px-4 py-3">
                        {student.birthday
                          ? new Date(student.birthday).toLocaleDateString("pt-BR")
                          : "-"
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}