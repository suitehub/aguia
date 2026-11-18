import { useMemo, useState } from "react";
import { LayoutGrid, Users, CalendarPlus, BarChart3, Target, Settings, CalendarDays, ChevronDown, Bell, BookOpen, ShoppingCart, ChevronRight, ArrowRight, ArrowLeft, Search, Clock } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Bar, BarChart, Legend } from "recharts";
import eagle from "@/assets/eagle.png";
import mountain from "@/assets/mountain.jpg";
import hero from "@/assets/hero.jpg";
import { Avatar } from "./Avatar";
import { colportores, lancamentos, getColportor, semana, totais, brl, diaLabel, PERIODOS, type Periodo, type Seguimento } from "./data";

const Pray = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <path d="M12 3c-1 2-1.5 4-1.5 6v5l-4 4.5L8 20l4-4" /><path d="M12 3c1 2 1.5 4 1.5 6v5l4 4.5L16 20l-4-4" /><path d="M12 9v7" />
  </svg>
);

type Page = "geral" | "colportores" | "lancamentos" | "relatorios" | "metas";
const nav: { id: Page; label: string; icon: typeof Users }[] = [
  { id: "geral", label: "Visão Geral", icon: LayoutGrid },
  { id: "colportores", label: "Colportores", icon: Users },
  { id: "lancamentos", label: "Lançamentos", icon: CalendarPlus },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "metas", label: "Metas", icon: Target },
];

export function Leader() {
  const [page, setPage] = useState<Page>("geral");
  const [sel, setSel] = useState<string | null>(null);
  const go = (p: Page) => { setPage(p); setSel(null); };
  return (
    <div className="rounded-[2.6rem] bg-navy-deep p-3 shadow-2xl ring-1 ring-navy-soft">
      <div className="flex h-[780px] w-[1180px] overflow-hidden rounded-[2rem] bg-background">
        <aside className="relative flex w-[210px] shrink-0 flex-col bg-navy px-5 pb-6 pt-8 text-primary-foreground">
          <div className="flex flex-col items-center">
            <img src={eagle} alt="" width={96} height={96} className="-mb-2 h-20 w-20 object-contain" />
            <div className="text-[34px] font-bold leading-none tracking-tight">ÁGUIA</div>
          </div>
          <nav className="mt-10 space-y-1.5">
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
            <li className="flex items-center gap-3"><BookOpen className="h-6 w-6 text-leaf" /><b className="font-bold">187</b> Ofertas</li>
            <li className="flex items-center gap-3"><ShoppingCart className="h-6 w-6 text-gold" /><b className="font-bold">38</b> Vendas</li>
            <li className="flex items-center gap-3"><Pray className="h-6 w-6 text-grape" /><b className="font-bold">54</b> Orações</li>
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
        <Stat icon={<BookOpen className="h-7 w-7" />} tone="bg-leaf-soft text-leaf" n="187" l="Ofertas Feitas" />
        <Stat icon={<ShoppingCart className="h-7 w-7" />} tone="bg-gold-soft text-gold" n="38" l="Vendas" />
        <Stat icon={<Pray className="h-7 w-7" />} tone="bg-grape-soft text-grape" n="54" l="Orações" />
      </div>
    </div>
  );
}

function Stat({ icon, tone, n, l }: { icon: React.ReactNode; tone: string; n: string; l: string }) {
  return (
    <div className="card-soft flex items-center gap-4 p-4">
      <div className={`grid h-16 w-16 place-items-center rounded-full ${tone}`}>{icon}</div>
      <div><div className="text-[30px] font-bold leading-none text-navy">{n}</div><div className="mt-1 whitespace-nowrap text-[16px] text-navy/80">{l}</div></div>
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

export { Pray };
