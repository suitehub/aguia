import { useMemo, useState, useEffect } from "react";
import { LayoutGrid, Users, CalendarPlus, BarChart3, Target, Settings, CalendarDays, ChevronDown, Bell, BookOpen, ShoppingCart, ChevronRight, ArrowRight, ArrowLeft, Search, Clock, BookMarked, GraduationCap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Bar, BarChart, Legend } from "recharts";
import eagle from "@/assets/logo.png";
import mountain from "@/assets/mountain.jpg";
import hero from "@/assets/hero.jpg";
import { Avatar } from "./Avatar";
import { colportores, lancamentos, getColportor, semana, totais, brl, diaLabel, PERIODOS, type Periodo, type Seguimento, loadMeditations, saveMeditations, loadTrainingPdfs, saveTrainingPdfs, loadBookOffers, saveBookOffers, type Meditation, type TrainingPdf, type BookOffer } from "./data";

const Pray = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <path d="M12 3c-1 2-1.5 4-1.5 6v5l-4 4.5L8 20l4-4" /><path d="M12 3c1 2 1.5 4 1.5 6v5l4 4.5L16 20l-4-4" /><path d="M12 9v7" />
  </svg>
);

type Page = "geral" | "colportores" | "lancamentos" | "relatorios" | "metas" | "meditacoes" | "treinamentos";
const nav: { id: Page; label: string; icon: typeof Users }[] = [
  { id: "geral", label: "Visão Geral", icon: LayoutGrid },
  { id: "colportores", label: "Colportores", icon: Users },
  { id: "lancamentos", label: "Lançamentos", icon: CalendarPlus },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "meditacoes", label: "Meditações", icon: BookMarked },
  { id: "treinamentos", label: "Ofertas", icon: GraduationCap },
  { id: "metas", label: "Metas", icon: Target },
];

export function Leader() {
  const [page, setPage] = useState<Page>("geral");
  const [sel, setSel] = useState<string | null>(null);
  const go = (p: Page) => { setPage(p); setSel(null); };
  return (
    <div className="rounded-[2.6rem] bg-navy-deep p-3 shadow-2xl ring-1 ring-navy-soft">
      <div className="flex h-[780px] w-[1180px] overflow-hidden rounded-[2rem] bg-background">
        <aside className="relative flex w-[210px] shrink-0 flex-col bg-navy px-5 pb-6 pt-4 text-primary-foreground">
          <div className="flex flex-col items-center">
            <img src={eagle} alt="" width={160} height={160} className="h-36 w-36 object-contain" />
          </div>
          <nav className="mt-6 space-y-1.5">
            {nav.map((n) => (
              <button key={n.id} onClick={() => go(n.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[16px] font-medium transition ${page === n.id ? "btn-gold font-semibold" : "text-primary-foreground/90 hover:bg-navy-soft"}`}>
                <n.icon className="h-5 w-5" /> {n.label}
              </button>
            ))}
          </nav>
          <img src={mountain} alt="" width={420} height={280} loading="lazy" className="pointer-events-none absolute bottom-24 left-0 w-full opacity-90 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_60%,transparent)]" />
          <button className="relative mt-auto flex items-center gap-3 rounded-xl bg-navy-soft/60 px-4 py-3 text-[15px]"><Settings className="h-5 w-5" /> Configurações</button>
        </aside>
        <main className="flex-1 overflow-y-auto px-9 pb-6 pt-7">
          <header className="mb-5 flex items-start justify-between">
            <div>
              <h1 className="text-[32px] font-bold leading-tight text-navy">Bom dia, Pr. Otávio!</h1>
              <p className="text-[17px] text-muted-foreground">Acompanhe a colportagem da sua equipe.</p>
            </div>
            <div className="flex items-center gap-5">
              <button className="card-soft flex items-center gap-3 px-4 py-3 text-[14px] text-navy"><CalendarDays className="h-5 w-5" /> Hoje, 10 de nov. de 2026 <ChevronDown className="h-4 w-4" /></button>
              <button className="card-soft relative grid h-12 w-12 place-items-center rounded-full text-navy"><Bell className="h-5 w-5" /><span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-gold" /></button>
            </div>
          </header>
          {page === "geral" && <Overview onVerTodos={() => go("lancamentos")} onOpen={(id) => { setPage("colportores"); setSel(id); }} />}
          {page === "colportores" && <ColportoresPage sel={sel} setSel={setSel} />}
          {page === "lancamentos" && <LancamentosPage />}
          {page === "relatorios" && <RelatoriosPage />}
          {page === "meditacoes" && <MeditacoesPage />}
          {page === "treinamentos" && <TreinamentosPage />}
          {page === "metas" && <MetasPage />}
        </main>
      </div>
    </div>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 54, c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-[140px] w-[140px] place-items-center rounded-full bg-gold-soft/50">
      <svg viewBox="0 0 130 130" className="absolute inset-0 -rotate-90">
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--border)" strokeWidth="9" />
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--gold)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(c * pct) / 100} ${c}`} />
      </svg>
      <span className="text-[34px] font-bold text-navy">{pct}%</span>
    </div>
  );
}

function Overview({ onVerTodos, onOpen }: { onVerTodos: () => void; onOpen: (id: string) => void }) {
  const ult = [
    { id: "1", seg: "Casa em Casa", v: 5 }, { id: "2", seg: "Indicação", v: 3 }, { id: "3", seg: "Casa em Casa", v: 4 },
  ];
  const tSemana = useMemo(() => totais(lancamentos.filter(l => l.dia < 7)), []);
  return (
    <div className="grid grid-cols-[1.2fr_1fr] gap-5">
      <div className="relative h-[220px] overflow-hidden rounded-[1.1rem] shadow-[var(--shadow-card)]">
        <img src={hero} alt="Colportor em missão" width={1200} height={608} className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-transparent" />
        <div className="relative p-7 text-primary-foreground">
          <h2 className="text-[32px] font-bold leading-[1.05]">Equipe em<br />Missão</h2>
          <div className="mb-4 mt-3 h-1 w-14 rounded bg-gold" />
          <p className="text-[15px] leading-snug opacity-90">Ide por todo o mundo<br />e pregai o evangelho.</p>
          <p className="mt-2 text-[13px] opacity-80">Marcos 16:15</p>
        </div>
      </div>
      <div className="card-soft p-5">
        <h3 className="flex items-center gap-2 text-[19px] font-semibold text-navy"><Target className="h-6 w-6 text-gold" /> Meta da Semana</h3>
        <div className="mt-3 flex items-center gap-8">
          <Ring pct={72} />
          <ul className="space-y-3 text-[17px] text-navy">
            <li className="flex items-center gap-3"><BookOpen className="h-6 w-6 text-leaf" /><b className="font-bold">{tSemana.ofertas}</b> Ofertas</li>
            <li className="flex items-center gap-3"><ShoppingCart className="h-6 w-6 text-gold" /><b className="font-bold">{tSemana.vendas}</b> Vendas</li>
            <li className="flex items-center gap-3"><Pray className="h-6 w-6 text-grape" /><b className="font-bold">{tSemana.oracoes}</b> Orações</li>
          </ul>
        </div>
      </div>
      <div className="card-soft p-5">
        <h3 className="text-[19px] font-semibold text-navy">Desempenho Diário</h3>
        <div className="mt-2 h-[160px]">
          <ResponsiveContainer>
            <AreaChart data={semana} margin={{ left: -24, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--sky)" stopOpacity={0.35} /><stop offset="1" stopColor="var(--sky)" stopOpacity={0.05} /></linearGradient>
                <linearGradient id="gy" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--gold)" stopOpacity={0.3} /><stop offset="1" stopColor="var(--gold)" stopOpacity={0.05} /></linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" />
              <XAxis dataKey="dia" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--foreground)" }} />
              <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--foreground)" }} />
              <Area type="monotone" dataKey="ofertas" stroke="var(--sky)" strokeWidth={2.5} fill="url(#gb)" dot={{ r: 4, fill: "var(--sky)" }} />
              <Area type="monotone" dataKey="vendas" stroke="var(--gold)" strokeWidth={2.5} fill="url(#gy)" dot={{ r: 4, fill: "var(--gold)" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-1 flex justify-center gap-8 text-[13px] text-navy">
          <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-sky" />Ofertas</span>
          <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-gold" />Vendas</span>
        </div>
      </div>
      <div className="card-soft p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[19px] font-semibold text-navy">Últimos Lançamentos</h3>
          <button onClick={onVerTodos} className="flex items-center gap-1 text-[14px] font-medium text-sky">Ver todos <ArrowRight className="h-4 w-4" /></button>
        </div>
        <ul className="mt-2 divide-y divide-border">
          {ult.map((u) => { const c = getColportor(u.id); return (
            <li key={u.id}><button onClick={() => onOpen(u.id)} className="flex w-full items-center gap-4 py-2.5 text-left">
              <Avatar c={c} size={50} />
              <div className="flex-1"><div className="text-[16px] font-semibold text-navy">{c.nome}</div><div className="text-[14px] text-muted-foreground">Hoje • {u.seg} • {u.v} vendas</div></div>
              <ChevronRight className="h-5 w-5 text-navy" />
            </button></li>); })}
        </ul>
      </div>
      <div className="col-span-2 grid grid-cols-4 gap-5">
        <Stat icon={<Users className="h-7 w-7" />} tone="bg-sky-soft text-sky" n="12" l="Colportores" />
        <Stat icon={<BookOpen className="h-7 w-7" />} tone="bg-leaf-soft text-leaf" n={String(tSemana.ofertas)} l="Ofertas Feitas" />
        <Stat icon={<ShoppingCart className="h-7 w-7" />} tone="bg-gold-soft text-gold" n={String(tSemana.vendas)} l="Vendas" sub={brl(tSemana.valor)} />
        <Stat icon={<Pray className="h-7 w-7" />} tone="bg-grape-soft text-grape" n={String(tSemana.oracoes)} l="Orações" />
      </div>
    </div>
  );
}

function Stat({ icon, tone, n, l, sub }: { icon: React.ReactNode; tone: string; n: string; l: string; sub?: string }) {
  return (
    <div className="card-soft flex items-center gap-4 p-4">
      <div className={`grid h-16 w-16 place-items-center rounded-full ${tone}`}>{icon}</div>
      <div><div className="text-[30px] font-bold leading-none text-navy">{n}</div><div className="mt-1 whitespace-nowrap text-[16px] text-navy/80">{l}</div>{sub && <div className="mt-0.5 text-[14px] font-medium text-navy">{sub}</div>}</div>
    </div>
  );
}

function Title({ t, s }: { t: string; s?: string }) {
  return <div className="mb-4"><h2 className="text-[22px] font-semibold text-navy">{t}</h2>{s && <p className="text-[14px] text-muted-foreground">{s}</p>}</div>;
}

function ColportoresPage({ sel, setSel }: { sel: string | null; setSel: (s: string | null) => void }) {
  const [q, setQ] = useState("");
  if (sel) {
    const c = getColportor(sel);
    const regs = lancamentos.filter((l) => l.colportorId === sel && l.dia < 30);
    const t = totais(regs);
    return (
      <div>
        <button onClick={() => setSel(null)} className="mb-4 flex items-center gap-2 text-[14px] font-medium text-sky"><ArrowLeft className="h-4 w-4" /> Voltar aos colportores</button>
        <div className="card-soft mb-5 flex items-center gap-5 p-5">
          <Avatar c={c} size={72} />
          <div className="flex-1"><div className="text-[22px] font-semibold text-navy">{c.nome}</div><div className="text-muted-foreground">{c.seguimento} • {c.cidade}</div></div>
          <span className="rounded-full bg-gold-soft px-3 py-1 text-[13px] font-medium text-navy">Últimos 30 dias</span>
        </div>
        <div className="mb-5 grid grid-cols-4 gap-5">
          <Stat icon={<BookOpen className="h-7 w-7" />} tone="bg-leaf-soft text-leaf" n={String(t.ofertas)} l="Ofertas" />
          <Stat icon={<ShoppingCart className="h-7 w-7" />} tone="bg-gold-soft text-gold" n={String(t.vendas)} l={brl(t.valor)} />
          <Stat icon={<Pray className="h-7 w-7" />} tone="bg-grape-soft text-grape" n={String(t.oracoes)} l="Orações" />
          <Stat icon={<Clock className="h-7 w-7" />} tone="bg-sky-soft text-sky" n={`${t.horas}h`} l="Horas" />
        </div>
        <LancTable rows={regs.slice(0, 12)} showNome={false} />
      </div>
    );
  }
  const list = colportores.filter((c) => c.nome.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="flex items-end justify-between"><Title t="Colportores" s="Selecione um colportor para ver seus registros." />
        <label className="card-soft mb-4 flex items-center gap-2 px-3 py-2"><Search className="h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" className="bg-transparent text-[14px] outline-none" /></label></div>
      <div className="grid grid-cols-3 gap-4">
        {list.map((c) => { const t = totais(lancamentos.filter((l) => l.colportorId === c.id && l.dia < 7)); return (
          <button key={c.id} onClick={() => setSel(c.id)} className="card-soft flex items-center gap-4 p-4 text-left transition hover:-translate-y-0.5">
            <Avatar c={c} size={52} />
            <div className="flex-1"><div className="font-semibold text-navy">{c.nome}</div><div className="text-[13px] text-muted-foreground">{c.seguimento} • {t.vendas} vendas na semana</div></div>
            <ChevronRight className="h-5 w-5 text-navy" />
          </button>); })}
      </div>
    </div>
  );
}

function LancTable({ rows, showNome = true }: { rows: typeof lancamentos; showNome?: boolean }) {
  return (
    <div className="card-soft overflow-hidden">
      <table className="w-full text-[14px]">
        <thead className="bg-secondary text-left text-navy"><tr>
          <th className="px-4 py-3 font-semibold">Data</th>{showNome && <th className="px-4 py-3 font-semibold">Colportor</th>}
          <th className="px-4 py-3 font-semibold">Seguimento</th><th className="px-4 py-3 font-semibold">Ofertas</th><th className="px-4 py-3 font-semibold">Vendas</th>
          <th className="px-4 py-3 font-semibold">Valor</th><th className="px-4 py-3 font-semibold">Orações</th><th className="px-4 py-3 font-semibold">Horas</th><th className="px-4 py-3 font-semibold">Desafios</th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {rows.map((l) => { const c = getColportor(l.colportorId); return (
            <tr key={l.id} className="text-navy">
              <td className="px-4 py-2.5">{diaLabel(l.dia)}</td>
              {showNome && <td className="px-4 py-2.5"><span className="flex items-center gap-2"><Avatar c={c} size={30} />{c.nome}</span></td>}
              <td className="px-4 py-2.5"><span className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${l.seguimento === "Indicação" ? "bg-grape-soft text-grape" : "bg-sky-soft text-sky"}`}>{l.seguimento}</span></td>
              <td className="px-4 py-2.5">{l.ofertas}</td><td className="px-4 py-2.5">{l.vendas}</td><td className="px-4 py-2.5">{brl(l.valor)}</td>
              <td className="px-4 py-2.5">{l.oracoes}</td><td className="px-4 py-2.5">{l.horas}h</td>
              <td className="max-w-[200px] truncate px-4 py-2.5 text-muted-foreground">{l.desafios || "—"}</td>
            </tr>); })}
        </tbody>
      </table>
    </div>
  );
}

function Pills<T extends string>({ items, value, onChange }: { items: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-xl bg-secondary p-1">
      {items.map((i) => <button key={i} onClick={() => onChange(i)} className={`rounded-lg px-4 py-1.5 text-[14px] font-medium transition ${value === i ? "btn-gold" : "text-navy/70"}`}>{i}</button>)}
    </div>
  );
}

function LancamentosPage() {
  const [seg, setSeg] = useState<"Todos" | Seguimento>("Todos");
  const rows = lancamentos.filter((l) => l.dia < 3 && (seg === "Todos" || l.seguimento === seg));
  return (
    <div>
      <div className="flex items-end justify-between"><Title t="Lançamentos" s="Registros diários enviados pelos colportores." />
        <div className="mb-4"><Pills items={["Todos", "Casa em Casa", "Indicação"] as const} value={seg} onChange={setSeg} /></div></div>
      <LancTable rows={rows} />
    </div>
  );
}

function RelatoriosPage() {
  const [periodo, setPeriodo] = useState<Periodo>("Semanal");
  const [modo, setModo] = useState<"Individual" | "Por Seguimento" | "Geral">("Geral");
  const [cid, setCid] = useState("1");
  const dias = PERIODOS[periodo];
  const base = useMemo(() => lancamentos.filter((l) => l.dia < dias), [dias]);
  const filtrado = modo === "Individual" ? base.filter((l) => l.colportorId === cid) : base;
  const t = totais(filtrado);
  const chart = modo === "Por Seguimento"
    ? (["Casa em Casa", "Indicação"] as const).map((s) => ({ nome: s, ...totais(base.filter((l) => l.seguimento === s)) }))
    : modo === "Geral"
      ? colportores.map((c) => ({ nome: c.nome.split(" ")[0], ...totais(base.filter((l) => l.colportorId === c.id)) }))
      : Array.from({ length: Math.min(dias, 14) }, (_, i) => { const d = Math.min(dias, 14) - 1 - i; return { nome: diaLabel(d), ...totais(filtrado.filter((l) => l.dia === d)) }; });
  return (
    <div>
      <Title t="Relatórios" s="Acesso exclusivo da liderança." />
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <Pills items={["Diário", "Semanal", "Mensal", "Semestral"] as const} value={periodo} onChange={setPeriodo} />
        <Pills items={["Individual", "Por Seguimento", "Geral"] as const} value={modo} onChange={setModo} />
        {modo === "Individual" && (
          <select value={cid} onChange={(e) => setCid(e.target.value)} className="card-soft px-3 py-2 text-[14px] text-navy outline-none">
            {colportores.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        )}
      </div>
      <div className="mb-5 grid grid-cols-4 gap-5">
        <Stat icon={<BookOpen className="h-7 w-7" />} tone="bg-leaf-soft text-leaf" n={String(t.ofertas)} l="Ofertas" />
        <Stat icon={<ShoppingCart className="h-7 w-7" />} tone="bg-gold-soft text-gold" n={String(t.vendas)} l={brl(t.valor)} />
        <Stat icon={<Pray className="h-7 w-7" />} tone="bg-grape-soft text-grape" n={String(t.oracoes)} l="Orações" />
        <Stat icon={<Clock className="h-7 w-7" />} tone="bg-sky-soft text-sky" n={`${t.horas}h`} l="Horas Trabalhadas" />
      </div>
      <div className="card-soft p-5">
        <h3 className="mb-3 text-[17px] font-semibold text-navy">{modo === "Por Seguimento" ? "Casa em Casa × Indicação" : modo === "Geral" ? "Resultados da equipe" : getColportor(cid).nome} — {periodo}</h3>
        <div className="h-[260px]">
          <ResponsiveContainer>
            <BarChart data={chart} margin={{ left: -16 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="nome" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--foreground)" }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="ofertas" name="Ofertas" fill="var(--sky)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="vendas" name="Vendas" fill="var(--gold)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="oracoes" name="Orações" fill="var(--grape)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {modo === "Individual" && <div className="mt-5"><LancTable rows={filtrado.slice(0, 8)} showNome={false} /></div>}
    </div>
  );
}

function MetasPage() {
  return (
    <div>
      <Title t="Metas" s="Progresso da equipe na semana." />
      <div className="grid grid-cols-3 gap-5">
        {[{ l: "Ofertas", v: 187, m: 260, i: <BookOpen className="h-6 w-6 text-leaf" /> }, { l: "Vendas", v: 38, m: 50, i: <ShoppingCart className="h-6 w-6 text-gold" /> }, { l: "Orações", v: 54, m: 75, i: <Pray className="h-6 w-6 text-grape" /> }].map((g) => (
          <div key={g.l} className="card-soft flex flex-col items-center gap-3 p-6">
            <div className="flex items-center gap-2 text-[18px] font-semibold text-navy">{g.i}{g.l}</div>
            <Ring pct={Math.round((g.v / g.m) * 100)} />
            <div className="text-navy"><b>{g.v}</b> de {g.m}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MeditacoesPage() {
  const [items, setItems] = useState<Meditation[]>([]);
  const [viewMode, setViewMode] = useState<"semana" | "mes" | "ano">("mes");
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [verse, setVerse] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  useEffect(() => { setItems(loadMeditations()); }, []);
  const reset = () => { setTitle(""); setVerse(""); setContent(""); setEditingId(null); };
  const medByDate = useMemo(() => {
    const map = new Map<string, Meditation>();
    items.forEach(m => map.set(m.date, m));
    return map;
  }, [items]);
  const openDay = (dateStr: string) => {
    setSelectedDate(dateStr);
    const found = medByDate.get(dateStr);
    if (found) { setEditingId(found.id); setTitle(found.title); setVerse(found.verse); setContent(found.content); }
    else { setEditingId(null); setTitle(""); setVerse(""); setContent(""); }
  };
  const save = () => {
    if (!selectedDate || !title) return alert("Selecione um dia e preencha o título.");
    const exists = items.find(m => m.date === selectedDate && m.id !== editingId);
    if (exists && !editingId) return alert("Já existe uma meditação para essa data.");
    let next: Meditation[];
    if (editingId) {
      next = items.map(m => m.id === editingId ? { ...m, date: selectedDate, title, verse, content } : m);
    } else {
      next = [...items, { id: String(Date.now()), date: selectedDate, title, verse, content }];
    }
    next.sort((a,b) => a.date.localeCompare(b.date));
    setItems(next); saveMeditations(next); reset(); setSelectedDate("");
  };
  const del = () => {
    if (!editingId) return;
    const next = items.filter(m => m.id !== editingId);
    setItems(next); saveMeditations(next); reset(); setSelectedDate("");
  };
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const firstDow = new Date(cursor.y, cursor.m, 1).getDay(); // 0 Sun
  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const prevMonth = () => setCursor(c => c.m === 0 ? { y: c.y-1, m: 11 } : { y: c.y, m: c.m-1 });
  const nextMonth = () => setCursor(c => c.m === 11 ? { y: c.y+1, m: 0 } : { y: c.y, m: c.m+1 });
  const toDateStr = (y:number,m:number,d:number) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  return (
    <div>
      <Title t="Meditações Diárias" s="Clique em um dia para adicionar, editar ou excluir a meditação." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-navy/70">Visualizar:</span>
        {(["semana","mes","ano"] as const).map(v => (
          <button key={v} onClick={()=>setViewMode(v)} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium ${viewMode===v?"btn-gold":"bg-secondary text-navy"}`}>{v==="semana"?"Semana":v==="mes"?"Mês":"Ano"}</button>
        ))}
      </div>
      {viewMode === "mes" && (
        <div className="card-soft p-4">
          <div className="mb-3 flex items-center justify-between">
            <button onClick={prevMonth} className="rounded-lg border border-border px-3 py-1 text-navy">‹</button>
            <div className="font-semibold capitalize text-navy">{monthLabel}</div>
            <button onClick={nextMonth} className="rounded-lg border border-border px-3 py-1 text-navy">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[12px] text-navy/70">
            {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d=><div key={d} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({length: firstDow}).map((_,i)=><div key={"e"+i} />)}
            {Array.from({length: daysInMonth}).map((_,i)=>{
              const d = i+1;
              const ds = toDateStr(cursor.y, cursor.m, d);
              const has = medByDate.has(ds);
              return (
                <button key={ds} onClick={()=>openDay(ds)} className={`min-h-[44px] rounded-lg border p-1 text-left text-[13px] ${selectedDate===ds?"border-gold bg-gold-soft":"border-border hover:bg-secondary"} ${has?"font-semibold":""}`}>
                  <div className="text-navy">{d}</div>
                  {has && <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-leaf" title="Tem meditação" />}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[12px] text-navy/70"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-leaf" /> Com meditação</span><span>Sem marcação = sem meditação</span></div>
        </div>
      )}
      {viewMode === "semana" && (
        <div className="card-soft p-4 text-[13px] text-navy">
          <p className="text-muted-foreground">Visualização semanal simplificada: use o modo <b>Mês</b> para clicar nos dias e gerenciar meditações. (Protótipo)</p>
        </div>
      )}
      {viewMode === "ano" && (
        <div className="card-soft p-4 text-[13px] text-navy">
          <p className="text-muted-foreground">Visualização anual simplificada: navegue pelo mês no modo <b>Mês</b>. (Protótipo)</p>
        </div>
      )}
      {selectedDate && (
        <div className="card-soft mt-5 p-4">
          <h3 className="text-[16px] font-semibold text-navy">{editingId ? "Editar meditação" : "Adicionar meditação"} — {selectedDate}</h3>
          <label className="mt-3 block text-[13px] text-navy">Título<input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-[14px]" /></label>
          <label className="mt-3 block text-[13px] text-navy">Versículo bíblico<input value={verse} onChange={e=>setVerse(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-[14px]" /></label>
          <label className="mt-3 block text-[13px] text-navy">Conteúdo<textarea value={content} onChange={e=>setContent(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-[14px]" /></label>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={save} className="btn-gold rounded-lg px-4 py-2 text-[14px] font-semibold">{editingId ? "Salvar" : "Adicionar"}</button>
            {editingId && <button onClick={del} className="rounded-lg border border-red-200 px-4 py-2 text-[14px] text-red-600">Excluir</button>}
            <button onClick={()=>{reset(); setSelectedDate("");}} className="rounded-lg border border-border px-4 py-2 text-[14px] text-navy">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TreinamentosPage() {
  const [pdfs, setPdfs] = useState<TrainingPdf[]>([]);
  const [books, setBooks] = useState<BookOffer[]>([]);
  const [pdfTitle, setPdfTitle] = useState(""); const [pdfDesc, setPdfDesc] = useState(""); const [pdfCat, setPdfCat] = useState(""); const [pdfUrl, setPdfUrl] = useState("");
  const [bName, setBName] = useState(""); const [bDesc, setBDesc] = useState(""); const [bArgs, setBArgs] = useState(""); const [bApp, setBApp] = useState(""); const [bOffer, setBOffer] = useState("");
  useEffect(() => { setPdfs(loadTrainingPdfs()); setBooks(loadBookOffers()); }, []);
  const addPdf = () => {
    if (!pdfTitle.trim()) return alert("Informe o título do PDF.");
    const item: TrainingPdf = { id: String(Date.now()), title: pdfTitle.trim(), description: pdfDesc.trim(), category: pdfCat.trim() || "Geral", url: pdfUrl, date: new Date().toLocaleDateString("pt-BR") };
    const next = [item, ...pdfs]; setPdfs(next); saveTrainingPdfs(next);
    setPdfTitle(""); setPdfDesc(""); setPdfCat(""); setPdfUrl("");
  };
  const delPdf = (id: string) => { const next = pdfs.filter(p=>p.id!==id); setPdfs(next); saveTrainingPdfs(next); };
  const addBook = () => {
    if (!bName.trim()) return alert("Informe o nome do livro.");
    const item: BookOffer = { id: String(Date.now()), bookName: bName.trim(), description: bDesc.trim(), arguments: bArgs.trim(), approach: bApp.trim(), offer: bOffer.trim() };
    const next = [item, ...books]; setBooks(next); saveBookOffers(next);
    setBName(""); setBDesc(""); setBArgs(""); setBApp(""); setBOffer("");
  };
  const delBook = (id: string) => { const next = books.filter(b=>b.id!==id); setBooks(next); saveBookOffers(next); };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.type !== "application/pdf") return alert("Envie um arquivo PDF.");
    if (f.size > 5 * 1024 * 1024) return alert("Arquivo muito grande (máx 5MB neste protótipo).");
    const reader = new FileReader();
    reader.onload = () => setPdfUrl(String(reader.result || ""));
    reader.readAsDataURL(f);
  };
  return (
    <div>
      <Title t="Ofertas" s="Gerencie materiais em PDF e ofertas de livros para os colportores." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-soft p-5">
          <div className="mb-4 border-b border-border pb-3">
            <h3 className="text-[18px] font-semibold text-navy">Ofertas em PDF</h3>
            <p className="text-[13px] text-muted-foreground">Cadastre materiais de apoio com título, categoria e arquivo.</p>
          </div>
          <div className="space-y-3">
            <label className="block text-[13px] font-medium text-navy">Título<input value={pdfTitle} onChange={e=>setPdfTitle(e.target.value)} placeholder="Ex.: Como apresentar uma oferta" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-gold/40" /></label>
            <label className="block text-[13px] font-medium text-navy">Descrição<input value={pdfDesc} onChange={e=>setPdfDesc(e.target.value)} placeholder="Resumo curto do material" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-gold/40" /></label>
            <label className="block text-[13px] font-medium text-navy">Categoria<input value={pdfCat} onChange={e=>setPdfCat(e.target.value)} placeholder="Ex.: Abordagem" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-gold/40" /></label>
            <label className="block text-[13px] font-medium text-navy">Arquivo PDF<input type="file" accept="application/pdf" onChange={onFile} className="mt-1 w-full text-[13px]" /></label>
            {pdfUrl && <div className="rounded-lg bg-leaf-soft px-3 py-2 text-[12px] text-navy">Arquivo carregado (protótipo). Será exibido ao colportor quando salvo.</div>}
            <button onClick={addPdf} className="btn-gold w-full rounded-lg px-4 py-2.5 text-[14px] font-semibold">Adicionar oferta em PDF</button>
          </div>
          <div className="mt-5">
            <h4 className="text-[13px] font-semibold uppercase tracking-wide text-navy/70">Itens cadastrados ({pdfs.length})</h4>
            {pdfs.length === 0 ? <p className="mt-2 text-[13px] text-muted-foreground">Nenhum PDF cadastrado.</p> : (
              <ul className="mt-2 space-y-2">{pdfs.map(p=>(
                <li key={p.id} className="flex items-start justify-between gap-2 rounded-lg border border-border bg-background p-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-navy">{p.title}</div>
                    <div className="text-[12px] text-muted-foreground">{p.category} • {p.date}{p.url ? " • com arquivo" : " • sem arquivo"}</div>
                  </div>
                  <button onClick={()=>delPdf(p.id)} className="shrink-0 text-[13px] text-red-600 underline">Excluir</button>
                </li>
              ))}</ul>
            )}
          </div>
        </section>
        <section className="card-soft p-5">
          <div className="mb-4 border-b border-border pb-3">
            <h3 className="text-[18px] font-semibold text-navy">Ofertas de livros</h3>
            <p className="text-[13px] text-muted-foreground">Cadastre argumentos, abordagem e proposta por livro.</p>
          </div>
          <div className="space-y-3">
            <label className="block text-[13px] font-medium text-navy">Nome do livro<input value={bName} onChange={e=>setBName(e.target.value)} placeholder="Ex.: O Grande Conflito" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-gold/40" /></label>
            <label className="block text-[13px] font-medium text-navy">Descrição<textarea value={bDesc} onChange={e=>setBDesc(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-gold/40" /></label>
            <label className="block text-[13px] font-medium text-navy">Argumentos de venda<textarea value={bArgs} onChange={e=>setBArgs(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-gold/40" /></label>
            <label className="block text-[13px] font-medium text-navy">Sugestão de abordagem<textarea value={bApp} onChange={e=>setBApp(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-gold/40" /></label>
            <label className="block text-[13px] font-medium text-navy">Oferta/proposta<input value={bOffer} onChange={e=>setBOffer(e.target.value)} placeholder="Ex.: condição especial nesta visita" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-gold/40" /></label>
            <button onClick={addBook} className="btn-gold w-full rounded-lg px-4 py-2.5 text-[14px] font-semibold">Adicionar oferta de livro</button>
          </div>
          <div className="mt-5">
            <h4 className="text-[13px] font-semibold uppercase tracking-wide text-navy/70">Itens cadastrados ({books.length})</h4>
            {books.length === 0 ? <p className="mt-2 text-[13px] text-muted-foreground">Nenhum livro cadastrado.</p> : (
              <ul className="mt-2 space-y-2">{books.map(b=>(
                <li key={b.id} className="flex items-start justify-between gap-2 rounded-lg border border-border bg-background p-3">
                  <div className="min-w-0 font-semibold text-navy">{b.bookName}</div>
                  <button onClick={()=>delBook(b.id)} className="shrink-0 text-[13px] text-red-600 underline">Excluir</button>
                </li>
              ))}</ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export { Pray };
