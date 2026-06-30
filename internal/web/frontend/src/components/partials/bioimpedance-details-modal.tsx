import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Bioimpedance } from "@/types/bioimpedance";

type Props = {
  open: boolean;
  onClose: () => void;
  bio: Bioimpedance | null;
};

const metricItems = [
  { key: "TBW", label: "Água Corporal Total", field: "tbw", unit: "L" },
  { key: "Altura", label: "Altura", field: "height", unit: "cm" },
  { key: "Peso", label: "Peso", field: "weight", unit: "kg" },
  { key: "Gordura", label: "Gordura Corporal", field: "body_fat_percent", unit: "%" },
  { key: "Visceral", label: "Gordura Visceral", field: "visceral_fat", unit: "%" },
  { key: "Músculo", label: "Músculo", field: "muscle_percent", unit: "%" },
  { key: "Sistólica", label: "Pressão Sistólica", field: "systolic", unit: "mmHg" },
  { key: "Diastólica", label: "Pressão Diastólica", field: "diastolic", unit: "mmHg" },
  { key: "BMR", label: "Taxa Metabólica Basal", field: "bmr", unit: "kcal" },
  { key: "Força Mão Esquerda", label: "Força Mão Esquerda", field: "left_grip_strength", unit: "kg" },
  { key: "Força Mão Direita", label: "Força Mão Direita", field: "right_grip_strength", unit: "kg" },
  { key: "Idade Corpo", label: "Idade Corporal", field: "body_age", unit: "anos" },
];

export default function BioimpedanceDetailsModal({ open, onClose, bio }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detalhes da Bioimpedância"
      description="Confira os resultados completos do registro selecionado."
      // footer={<Button variant="secondary" onClick={onClose}>Fechar</Button>}
    >
      {bio ? (
        <div className="border border-border bg-popover">
          <table className="min-w-full table-fixed  border border-border text-sm text-left text-card-foreground">
            <colgroup>
              <col className="w-[42%]" />
              <col className="w-[58%]" />
            </colgroup>
            <thead className="bg-card/70 text-muted-foreground uppercase tracking-[0.12em] text-[11px]">
              <tr>
                <th className="border-b border-border px-4 py-3 text-left">Descrição</th>
                <th className="border-b border-border px-4 py-3 text-left">Valor</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {metricItems.map((metric) => (
                <tr key={metric.key} className="border-b border-border hover:bg-popover/70">
                  <th className="border px-4 py-4 text-left font-medium text-muted-foreground align-top">
                    {metric.label}
                  </th>
                  <td className="border-b px-4 py-4 text-left text-card-foreground align-top">
                    {String(bio[metric.field as keyof Bioimpedance])} {metric.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-popover p-6 text-center text-muted-foreground">
          Nenhum dado disponível.
        </div>
      )}
    </Modal>
  );
}
