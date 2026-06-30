import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { createBioimpedance } from "@/services/bioimpedance";
import type { CreateBioimpedanceDTO } from "@/types/bioimpedance";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  student_id: string;
};

const initialState: CreateBioimpedanceDTO = {
  student_id: "",
  tbw: 0,
  height: 0,
  weight: 0,
  body_fat_percent: 0,
  visceral_fat: 0,
  muscle_percent: 0,
  systolic: 0,
  diastolic: 0,
  bmr: 0,
  left_grip_strength: 0,
  right_grip_strength: 0,
  body_age: 0,
};

export default function BioimpedanceCreateModal({ open, onClose, onSuccess, student_id }: Props) {
  const [form, setForm] = useState<CreateBioimpedanceDTO>({ ...initialState, student_id });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({ ...initialState, student_id });
      setError(null);
    }
  }, [open, student_id]);

  const handleChange = (field: keyof CreateBioimpedanceDTO, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "student_id" ? value : Number(value),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await createBioimpedance(form);
      await onSuccess();
      onClose();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a bioimpedância.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Adicionar Bioimpedância"
      description="Preencha os dados do exame para salvar o registro do aluno."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar registro"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label required>TBW (L)</Label>
            <Input type="number" value={form.tbw || ""} min={0} step="0.1" onChange={(e) => handleChange("tbw", e.target.value)} />
          </div>
          <div>
            <Label required>Altura (cm)</Label>
            <Input type="number" value={form.height || ""} min={0} onChange={(e) => handleChange("height", e.target.value)} />
          </div>
          <div>
            <Label required>Peso (kg)</Label>
            <Input type="number" value={form.weight || ""} min={0} onChange={(e) => handleChange("weight", e.target.value)} />
          </div>
          <div>
            <Label required>Gordura (%)</Label>
            <Input type="number" value={form.body_fat_percent || ""} min={0} step="0.1" onChange={(e) => handleChange("body_fat_percent", e.target.value)} />
          </div>
          <div>
            <Label required>Visceral (%)</Label>
            <Input type="number" value={form.visceral_fat || ""} min={0} step="0.1" onChange={(e) => handleChange("visceral_fat", e.target.value)} />
          </div>
          <div>
            <Label required>Músculo (%)</Label>
            <Input type="number" value={form.muscle_percent || ""} min={0} step="0.1" onChange={(e) => handleChange("muscle_percent", e.target.value)} />
          </div>
          <div>
            <Label required>Sistólica (mmHg)</Label>
            <Input type="number" value={form.systolic || ""} min={0} onChange={(e) => handleChange("systolic", e.target.value)} />
          </div>
          <div>
            <Label required>Diastólica (mmHg)</Label>
            <Input type="number" value={form.diastolic || ""} min={0} onChange={(e) => handleChange("diastolic", e.target.value)} />
          </div>
          <div>
            <Label required>BMR (kcal)</Label>
            <Input type="number" value={form.bmr || ""} min={0} onChange={(e) => handleChange("bmr", e.target.value)} />
          </div>
          <div>
            <Label required>Força Mão Esquerda (kg)</Label>
            <Input type="number" value={form.left_grip_strength || ""} min={0} step="0.1" onChange={(e) => handleChange("left_grip_strength", e.target.value)} />
          </div>
          <div>
            <Label required>Força Mão Direita (kg)</Label>
            <Input type="number" value={form.right_grip_strength || ""} min={0} step="0.1" onChange={(e) => handleChange("right_grip_strength", e.target.value)} />
          </div>
          <div>
            <Label required>Idade Corporal (anos)</Label>
            <Input type="number" value={form.body_age || ""} min={0} onChange={(e) => handleChange("body_age", e.target.value)} />
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </Modal>
  );
}
