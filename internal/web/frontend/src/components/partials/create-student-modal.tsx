import { useEffect, useState } from "react";
import { createStudent, updateStudent } from "@/services/students";
import type { CreateStudentDTO, Student } from "@/types/students";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={studentToEdit ? "Editar aluno" : "Adicionar aluno"}
      description="Cadastre ou atualize as informações do aluno de forma rápida."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (studentToEdit ? "Atualizando..." : "Salvando...") : studentToEdit ? "Atualizar" : "Salvar"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label required>Nome</Label>

          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
          />

          {errors.name?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>

        <div>
          <Label>Email</Label>

          <Input
            name="email"
            type="email"
            value={form.email ?? ""}
            onChange={handleChange}
            error={Boolean(errors.email)}
          />

          {errors.email?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>

        <div>
          <Label>Telefone</Label>

          <Input
            name="phone"
            value={form.phone ?? ""}
            onChange={handleChange}
            error={Boolean(errors.phone)}
          />

          {errors.phone?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>

        <div>
          <Label>CPF</Label>

          <Input
            name="cpf"
            value={form.cpf ?? ""}
            onChange={handleChange}
            error={Boolean(errors.cpf)}
          />

          {errors.cpf?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>

        <div>
          <Label required>Sexo</Label>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>

          {errors.gender?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>

        <div className="md:col-span-2">
          <Label required>Órgão</Label>

          <Input
            name="headquarters"
            value={form.headquarters}
            onChange={handleChange}
            error={Boolean(errors.headquarters)}
          />

          {errors.headquarters?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>

        <div>
          <Label required>Aniversário</Label>

          <Input
            name="birthday"
            type="date"
            value={form.birthday}
            onChange={handleChange}
            error={Boolean(errors.birthday)}
          />

          {errors.birthday?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>
      </div>
    </Modal>
  );
}