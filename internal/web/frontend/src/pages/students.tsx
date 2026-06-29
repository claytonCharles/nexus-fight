import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { listStudents } from "@/services/students";
import type { Student } from "@/types/students";
import CreateStudentModal from "@/components/partials/create-student-modal";
import Pagination from "@/components/partials/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";

export default function Students() {
  const location = useLocation();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSwitchingPage, setIsSwitchingPage] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [search, setSearch] = useState("");

  const updatePageInUrl = (page: number) => {
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = Number(searchParams.get("page") || "1");

    if (page === pageFromUrl) {
      return;
    }

    searchParams.set("page", String(page));

    navigate({ pathname: location.pathname, search: searchParams.toString() ? `?${searchParams.toString()}` : "" }, { replace: true });
  };

  const updateSearchInUrl = (value: string) => {
    const searchParams = new URLSearchParams(location.search);

    if (value.trim()) {
      searchParams.set("search", value.trim());
    } else {
      searchParams.delete("search");
    }

    searchParams.set("page", "1");

    navigate({ pathname: location.pathname, search: searchParams.toString() ? `?${searchParams.toString()}` : "" }, { replace: true });
  };

  async function fetchStudents(page = currentPage) {
    const isPageChange = page !== currentPage && hasLoadedOnce;

    try {
      setError("");

      if (!hasLoadedOnce) {
        setLoading(true);
      } else if (isPageChange) {
        setIsSwitchingPage(true);
      }

      const data = await listStudents(page, search);
      setStudents(data.list_student);
      setCurrentPage(data.page);
      setTotalPages(Math.max(1, Math.ceil(data.total / data.per_page)));
      setHasLoadedOnce(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
      setIsSwitchingPage(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromUrl = Number(params.get("page") || "1");
    const safePage = Number.isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;
    const searchFromUrl = params.get("search") || "";

    setCurrentPage(safePage);
    setSearch(searchFromUrl);
    fetchStudents(safePage);
  }, [location.search]);

  function openCreateModal() {
    setEditingStudent(null);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditingStudent(null);
  }

  return (
    <>
      <CreateStudentModal
        open={open}
        onClose={closeModal}
        onSuccess={() => fetchStudents(1)}
        studentToEdit={editingStudent}
      />

      <section className="space-y-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Alunos" }]} />
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-card-foreground">Alunos</h2>
              <p className="mt-1 text-muted-foreground">Lista de alunos cadastrados e em acompanhamento.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-6xl overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-border bg-popover/80 p-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:max-w-sm">
                <Input
                  placeholder="Busca por nome, email, telefone ou cpf."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    updateSearchInUrl(event.target.value);
                  }}
                />
              </div>

              <Button onClick={openCreateModal} variant="primary">
                Adicionar aluno
              </Button>
            </div>

              <table className="w-full border-collapse">
              <thead className="border-b border-border bg-popover/80">
                <tr>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Telefone</th>
                  <th className="px-4 py-3 text-left">Aniversário</th>
                  <th className="px-4 py-3 text-left">Ações</th>
                </tr>
              </thead>

              <tbody>
                {loading && !isSwitchingPage ? (
                  <tr>
                    <td colSpan={5} className="h-80">
                      <div className="flex h-full items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="h-80 text-center text-destructive">
                      {error}
                    </td>
                  </tr>
                ) : isSwitchingPage ? (
                  <tr>
                    <td colSpan={5} className="h-80">
                      <div className="flex h-full items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                      </div>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-80 text-center text-muted-foreground">
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="border-b border-border hover:bg-popover/70">
                      <td className="px-4 py-3 text-card-foreground">{student.name}</td>
                      <td className="px-4 py-3 text-card-foreground">{student.email ?? "-"}</td>
                      <td className="px-4 py-3 text-card-foreground">{student.phone ?? "-"}</td>
                      <td className="px-4 py-3 text-card-foreground">
                        {student.birthday ? new Date(student.birthday).toLocaleDateString("pt-BR") : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/students/${student.id}`}
                          className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-card-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary-foreground"
                        >
                          Ver detalhes
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => updatePageInUrl(page)}
            />
          </Card>
        </div>
      </section>
    </>
  );
}