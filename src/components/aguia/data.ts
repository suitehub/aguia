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

export type Meditation = { id: string; date: string; title: string; verse: string; content: string };
export type TrainingPdf = { id: string; title: string; description: string; category: string; url: string; date: string };
export type BookOffer = { id: string; bookName: string; description: string; arguments: string; approach: string; offer: string };

export function getTodaySaoPaulo(): string {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const y = parts.find(p => p.type === "year")?.value;
    const m = parts.find(p => p.type === "month")?.value;
    const d = parts.find(p => p.type === "day")?.value;
    return `${y}-${m}-${d}`;
  } catch {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
}

const LS_MEDITATIONS = "aguia_meditations";
const LS_TRAINING_PDFS = "aguia_training_pdfs";
const LS_BOOK_OFFERS = "aguia_book_offers";

export function loadMeditations(): Meditation[] {
  try {
    const raw = localStorage.getItem(LS_MEDITATIONS);
    const arr: Meditation[] = raw ? JSON.parse(raw) : [];
    // seed demo for today if none exists for today
    const today = getTodaySaoPaulo();
    const hasToday = arr.some(m => m.date === today);
    if (!hasToday) {
      arr.push({
        id: "demo-today",
        date: today,
        title: "Antes de começar, coloque Deus em primeiro lugar. (exemplo demonstrativo)",
        verse: "Mateus 6:33 — \"Busquem, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas lhes serão acrescentadas.\"",
        content: "Todos os dias começamos uma nova jornada. Para quem trabalha com a colportagem, cada manhã traz oportunidades, desafios, pessoas diferentes e situações que nem sempre podemos prever.\n\nÀs vezes, ficamos tão preocupados com os resultados, com as vendas e com aquilo que precisamos alcançar, que acabamos deixando de lado aquilo que deveria estar em primeiro lugar: nossa comunhão com Deus.\n\nJesus nos ensina que devemos buscar primeiro o Reino de Deus. Isso significa que nossa prioridade não deve ser apenas aquilo que queremos conquistar, mas quem estamos nos tornando durante o caminho.\n\nAntes de sair para apresentar um livro, antes de conversar com alguém ou estabelecer suas metas, reserve um momento para entregar seu dia a Deus.\n\nLembre-se: você não está apenas oferecendo livros. Está levando mensagens que podem transformar vidas.\n\nAplicação para hoje:\nAntes de iniciar suas atividades, separe alguns minutos para orar e peça a Deus que prepare as pessoas que você encontrará hoje.\n\nDesafio do dia:\nCompartilhe uma mensagem de esperança com pelo menos uma pessoa durante sua jornada."
      });
      try { localStorage.setItem(LS_MEDITATIONS, JSON.stringify(arr)); } catch {}
    }
    return arr;
  } catch { return []; }
}
export function saveMeditations(items: Meditation[]) {
  try { localStorage.setItem(LS_MEDITATIONS, JSON.stringify(items)); } catch {}
}
export function loadTrainingPdfs(): TrainingPdf[] {
  try {
    const raw = localStorage.getItem(LS_TRAINING_PDFS);
    const arr: TrainingPdf[] = raw ? JSON.parse(raw) : [];
    if (arr.length === 0) {
      arr.push(
        { id: "demo-pdf-1", title: "Como apresentar uma oferta (exemplo)", description: "Guia demonstrativo sobre estrutura de apresentação.", category: "Abordagem", url: "", date: "Demo" },
        { id: "demo-pdf-2", title: "Técnicas para despertar interesse (exemplo)", description: "Exemplo de material de apoio ao colportor.", category: "Interesse", url: "", date: "Demo" },
        { id: "demo-pdf-3", title: "Como contornar objeções (exemplo)", description: "Material demonstrativo — sem PDF real anexado.", category: "Objeções", url: "", date: "Demo" }
      );
      try { localStorage.setItem(LS_TRAINING_PDFS, JSON.stringify(arr)); } catch {}
    }
    return arr;
  } catch { return []; }
}
export function saveTrainingPdfs(items: TrainingPdf[]) {
  try { localStorage.setItem(LS_TRAINING_PDFS, JSON.stringify(items)); } catch {}
}
export function loadBookOffers(): BookOffer[] {
  try {
    const raw = localStorage.getItem(LS_BOOK_OFFERS);
    const arr: BookOffer[] = raw ? JSON.parse(raw) : [];
    if (arr.length === 0) {
      arr.push({
        id: "demo-book-1",
        bookName: "O Grande Conflito (exemplo)",
        description: "Exemplo demonstrativo de oferta de livro para visualizar o layout.",
        arguments: "Aborda a grande controvérsia entre o bem e o mal de forma clara e envolvente.",
        approach: "Comece perguntando sobre esperança e o futuro; conecte com temas atuais.",
        offer: "Proposta exemplo: condição especial nesta visita."
      });
      try { localStorage.setItem(LS_BOOK_OFFERS, JSON.stringify(arr)); } catch {}
    }
    return arr;
  } catch { return []; }
}
export function saveBookOffers(items: BookOffer[]) {
  try { localStorage.setItem(LS_BOOK_OFFERS, JSON.stringify(items)); } catch {}
}

export const semana = [
  { dia: "Seg", ofertas: 42, vendas: 8 }, { dia: "Ter", ofertas: 38, vendas: 18 }, { dia: "Qua", ofertas: 62, vendas: 27 },
  { dia: "Qui", ofertas: 47, vendas: 18 }, { dia: "Sex", ofertas: 63, vendas: 27 }, { dia: "Sáb", ofertas: 78, vendas: 34 }, { dia: "Dom", ofertas: 63, vendas: 27 },
];
