import lucas from "@/assets/av-lucas.jpg";
import ana from "@/assets/av-ana.jpg";
import rafael from "@/assets/av-rafael.jpg";

export type Seguimento = "Casa em Casa" | "Indicação";
export type Colportor = { id: string; nome: string; foto?: string; seguimento: Seguimento; cidade: string };
export type Lancamento = {
  id: string; colportorId: string; dia: number; seguimento: Seguimento;
  ofertas: number; vendas: number; valor: number; oracoes: number; horas: number; desafios: string;
};

export const LIVROS = ["O Grande Conflito", "O Desejado de Todas as Nações", "Caminho a Cristo", "Saúde e Bem-Estar", "Histórias da Bíblia", "Vida Feliz"];

export const colportores: Colportor[] = [
  { id: "1", nome: "Lucas Mendes", foto: lucas, seguimento: "Casa em Casa", cidade: "Curitiba" },
  { id: "2", nome: "Ana Beatriz", foto: ana, seguimento: "Indicação", cidade: "Londrina" },
  { id: "3", nome: "Rafael Souza", foto: rafael, seguimento: "Casa em Casa", cidade: "Maringá" },
  { id: "4", nome: "Juliana Prado", seguimento: "Indicação", cidade: "Cascavel" },
  { id: "5", nome: "Mateus Lima", seguimento: "Casa em Casa", cidade: "Ponta Grossa" },
  { id: "6", nome: "Débora Alves", seguimento: "Casa em Casa", cidade: "Curitiba" },
  { id: "7", nome: "Pedro Henrique", seguimento: "Indicação", cidade: "Foz do Iguaçu" },
  { id: "8", nome: "Sara Oliveira", seguimento: "Casa em Casa", cidade: "Londrina" },
  { id: "9", nome: "Gabriel Rocha", seguimento: "Indicação", cidade: "Maringá" },
  { id: "10", nome: "Larissa Costa", seguimento: "Casa em Casa", cidade: "Guarapuava" },
  { id: "11", nome: "Tiago Ramos", seguimento: "Casa em Casa", cidade: "Curitiba" },
  { id: "12", nome: "Raquel Nunes", seguimento: "Indicação", cidade: "Toledo" },
];

const desafios = ["Chuva forte pela manhã.", "Muitas casas fechadas no bairro.", "Preciso de mais exemplares de Caminho a Cristo.", "Dia abençoado, boas conversas.", "Cansaço físico, oração pela saúde.", ""];

// Deterministic fictional data: 180 days (dia 0 = hoje)
function rnd(seed: number) { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }
export const lancamentos: Lancamento[] = [];
for (let d = 0; d < 180; d++) {
  for (const c of colportores) {
    const s = Number(c.id) * 97 + d * 13;
    if (rnd(s) < 0.15) continue;
    const ofertas = 8 + Math.floor(rnd(s + 1) * 20);
    const vendas = Math.floor(rnd(s + 2) * 7);
    lancamentos.push({
      id: `${c.id}-${d}`, colportorId: c.id, dia: d, seguimento: c.seguimento,
      ofertas, vendas, valor: vendas * (45 + Math.floor(rnd(s + 3) * 60)),
      oracoes: 2 + Math.floor(rnd(s + 4) * 8), horas: 5 + Math.floor(rnd(s + 5) * 5),
      desafios: desafios[Math.floor(rnd(s + 6) * desafios.length)],
    });
  }
}

export const getColportor = (id: string) => colportores.find((c) => c.id === id)!;
export const PERIODOS = { Diário: 1, Semanal: 7, Mensal: 30, Semestral: 180 } as const;
export type Periodo = keyof typeof PERIODOS;

export function totais(list: Lancamento[]) {
  return list.reduce((a, l) => ({ ofertas: a.ofertas + l.ofertas, vendas: a.vendas + l.vendas, valor: a.valor + l.valor, oracoes: a.oracoes + l.oracoes, horas: a.horas + l.horas }), { ofertas: 0, vendas: 0, valor: 0, oracoes: 0, horas: 0 });
}
export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export function diaLabel(d: number) {
  if (d === 0) return "Hoje"; if (d === 1) return "Ontem";
  const dt = new Date(2026, 10, 10 - d); return dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export const semana = [
  { dia: "Seg", ofertas: 42, vendas: 8 }, { dia: "Ter", ofertas: 38, vendas: 18 }, { dia: "Qua", ofertas: 62, vendas: 27 },
  { dia: "Qui", ofertas: 47, vendas: 18 }, { dia: "Sex", ofertas: 63, vendas: 27 }, { dia: "Sáb", ofertas: 78, vendas: 34 }, { dia: "Dom", ofertas: 63, vendas: 27 },
];
