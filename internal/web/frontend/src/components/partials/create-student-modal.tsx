import { useEffect, useState } from "react";
import { createStudent, updateStudent } from "@/services/students";
import type { CreateStudentDTO, Student } from "@/types/students";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentToEdit?: Student | null;
};

function createEmptyForm(): CreateStudentDTO {
  return {
    name: "",
    email: "",
    phone: "",
    cpf: "",
    gender: "M",
    headquarters: "",
    birthday: "",
  };
}

function formatBirthday(value: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export default function CreateStudentModal({ open, onClose, onSuccess, studentToEdit }: Props) {
  const [form, setForm] = useState<CreateStudentDTO>(createEmptyForm);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (studentToEdit) {
        setForm({
          name: studentToEdit.name ?? "",
          email: studentToEdit.email ?? "",
          phone: studentToEdit.phone ?? "",
          cpf: studentToEdit.cpf ?? "",
          gender: studentToEdit.gender === "F" ? "F" : "M",
          headquarters: studentToEdit.headquarters ?? "",
          birthday: formatBirthday(studentToEdit.birthday),
        });
      } else {
        setForm(createEmptyForm());
      }

      setErrors({});
    }
  }, [open, studentToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrors({});

      const payload = {
        ...form,
        birthday: new Date(form.birthday).toISOString(),
      };

      if (studentToEdit) {
        await updateStudent(studentToEdit.id, payload);
      } else {
        await createStudent(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 400) {
        setErrors(err.response.data);
        return;
      }

      alert(studentToEdit ? "Erro ao atualizar aluno." : "Erro ao salvar aluno.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            {studentToEdit ? "Editar aluno" : "Adicionar aluno"}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6">
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Nome *
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded border p-2"
            />

            {errors.name?.map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={form.email ?? ""}
              onChange={handleChange}
              className="w-full rounded border p-2"
            />

            {errors.email?.map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Telefone
            </label>

            <input
              name="phone"
              value={form.phone ?? ""}
              onChange={handleChange}
              className="w-full rounded border p-2"
            />

            {errors.phone?.map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              CPF
            </label>

            <input
              name="cpf"
              value={form.cpf ?? ""}
              onChange={handleChange}
              className="w-full rounded border p-2"
            />

            {errors.cpf?.map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Sexo *
            </label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded border p-2"
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>

            {errors.gender?.map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>

          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Órgão *
            </label>

            <input
              name="headquarters"
              value={form.headquarters}
              onChange={handleChange}
              className="w-full rounded border p-2"
            />

            {errors.headquarters?.map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Aniversário *
            </label>

            <input
              name="birthday"
              type="date"
              value={form.birthday}
              onChange={handleChange}
              className="w-full rounded border p-2"
            />

            {errors.birthday?.map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded border px-4 py-2 hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (studentToEdit ? "Atualizando..." : "Salvando...") : studentToEdit ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}