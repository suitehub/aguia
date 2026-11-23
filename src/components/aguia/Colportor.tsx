import { useEffect, useState } from "react";
import { Menu, CalendarDays, BookOpen, ShoppingCart, Minus, Plus, Check, Home, PlusCircle, BarChart3, User, MessageCircle, Clock, Bell, Signal, Wifi, BatteryFull, ChevronDown, GraduationCap, Trophy, Crown } from "lucide-react";
import eagle from "@/assets/logo.png";
import { Pray } from "./Leader";
import { LIVROS, getTodaySaoPaulo, loadMeditations, loadTrainingPdfs, loadBookOffers, lancamentos, colportores, getColportor, PERIODOS, type Seguimento } from "./data";

function Stepper({ v, set, step = 1 }: { v: number; set: (n: number) => void; step?: number }) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <button onClick={() => set(Math.max(0, v - step))} aria-label="Diminuir" className="grid h-8 w-8 place-items-center rounded-full bg-sky-soft text-navy"><Minus className="h-4 w-4" strokeWidth={3} /></button>
      <span className="text-[22px] font-bold text-navy">{v}</span>
      <button onClick={() => set(v + step)} aria-label="Aumentar" className="grid h-8 w-8 place-items-center rounded-full bg-sky-soft text-navy"><Plus className="h-4 w-4" strokeWidth={3} /></button>
    </div>
  );
}
function Tile({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return <div className="card-soft p-3"><div className="flex items-center gap-2 text-[14px] font-semibold text-navy">{icon}{label}</div>{children}</div>;
}

export function ColportorApp() {
  const [seg, setSeg] = useState<Seguimento>("Casa em Casa");
  const [ofertas, setOfertas] = useState(0);
  const [oracoes, setOracoes] = useState(0);
  const [horas, setHoras] = useState(0);
  const [valor, setValor] = useState("");
  const [livros, setLivros] = useState<Record<string, number>>({});
  const [desafios, setDesafios] = useState("");
  const [saved, setSaved] = useState(false);
  const [notif, setNotif] = useState(false);
  const [tab, setTab] = useState("lancar");
  const [todaySP, setTodaySP] = useState(getTodaySaoPaulo());
  const [meditations] = useState(() => loadMeditations());
  const [trainingPdfs] = useState(() => loadTrainingPdfs());
  const [bookOffers] = useState(() => loadBookOffers());
  const [openOfferSection, setOpenOfferSection] = useState<"pdfs" | "livros" | "outros">("pdfs");
  const [rankPeriod, setRankPeriod] = useState<"Semanal"|"Mensal"|"Semestral">("Semanal");
  const [rankMod, setRankMod] = useState<Seguimento>("Casa em Casa");
  const vendas = Object.values(livros).reduce((a, b) => a + b, 0);

  useEffect(() => { const t = setTimeout(() => setNotif(true), 900); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const update = () => setTodaySP(getTodaySaoPaulo());
    const id = setInterval(update, 30000);
    const onVis = () => { if (document.visibilityState === "visible") update(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  const toggleLivro = (l: string) => setLivros((p) => { const n = { ...p }; if (l in n) delete n[l]; else n[l] = 1; return n; });
  const setQtd = (l: string, q: number) => setLivros((p) => { const n = { ...p }; if (q <= 0) delete n[l]; else n[l] = q; return n; });
  const salvar = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  const todayMeditation = meditations.find(m => m.date === todaySP) || null;
  const rankingData = useMemo(() => {
    const dias = PERIODOS[rankPeriod];
    const filtered = lancamentos.filter(l => l.dia < dias && l.seguimento === rankMod);
    const byCol = new Map<string, number>();
    filtered.forEach(l => byCol.set(l.colportorId, (byCol.get(l.colportorId) || 0) + l.horas));
    const arr = Array.from(byCol.entries()).map(([id, horas]) => {
      const c = getColportor(id);
      return { id, nome: c?.nome || "?", horas, foto: c?.foto };
    });
    arr.sort((a,b) => b.horas - a.horas || a.nome.localeCompare(b.nome));
    return arr;
  }, [rankPeriod, rankMod]);
  const myId = "1"; // protótipo: usuário logado
  const myRankIndex = rankingData.findIndex(r => r.id === myId);
  const myRank = myRankIndex >= 0 ? myRankIndex + 1 : null;
  const myHoras = myRankIndex >= 0 ? rankingData[myRankIndex].horas : 0;

  return (
    <div className="rounded-[3.2rem] bg-navy-deep p-2.5 shadow-2xl ring-[3px] ring-muted-foreground/40">
      <div className="relative flex h-[760px] w-[360px] flex-col overflow-hidden rounded-[2.7rem] bg-background">
        <div className="relative bg-navy px-6 pb-12 pt-3 text-primary-foreground">
          <div className="flex items-center justify-between text-[14px] font-semibold">
            <span>21:00</span>
            <span className="absolute left-1/2 top-2 h-7 w-28 -translate-x-1/2 rounded-full bg-navy-deep" />
            <span className="flex items-center gap-1"><Signal className="h-4 w-4" /><Wifi className="h-4 w-4" /><BatteryFull className="h-5 w-5" /></span>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center">
              <img src={eagle} alt="" width={128} height={128} className="h-28 w-28 object-contain" />
            </div>
            <Menu className="h-7 w-7" />
          </div>
          <svg viewBox="0 0 360 40" preserveAspectRatio="none" className="absolute -bottom-px left-0 h-10 w-full"><path d="M0 40 L0 22 Q90 0 200 10 T360 6 L360 40Z" fill="var(--background)" /></svg>
        </div>

        {notif && (
          <button onClick={() => setNotif(false)} className="absolute left-3 right-3 top-11 z-20 flex items-start gap-3 rounded-2xl bg-card/95 p-3 text-left shadow-xl ring-1 ring-border backdrop-blur animate-in slide-in-from-top-4 fade-in">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-navy"><img src={eagle} alt="" width={28} height={28} className="h-7 w-7 object-contain" /></div>
            <div className="min-w-0 flex-1"><div className="flex justify-between text-[12px] text-muted-foreground"><span className="font-semibold uppercase tracking-wide">Águia</span><span>21:00</span></div>
              <div className="text-[14px] font-semibold text-navy">Hora do lançamento!</div><div className="text-[13px] text-muted-foreground">Não esqueça de registrar suas atividades de hoje.</div></div>
          </button>
        )}

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {tab === "lancar" && (<>
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-1 h-8 w-8 text-navy" />
              <div><h2 className="text-[22px] font-semibold leading-tight text-navy">Lançamento do Dia</h2><p className="text-[13px] text-navy/80">Registre suas atividades de colportagem.</p></div>
            </div>
            <div className="card-soft mt-4 flex items-center gap-3 p-3">
              <BookOpen className="h-6 w-6 shrink-0 text-navy" />
              <div className="flex-1"><div className="text-[13px] font-medium text-navy">Seguimento</div>
                <div className="relative mt-1"><select value={seg} onChange={(e) => setSeg(e.target.value as Seguimento)} className="w-full appearance-none rounded-lg border border-border bg-card px-2 py-1.5 text-[14px] font-medium text-navy outline-none">
                  <option>Casa em Casa</option><option>Indicação</option></select><ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-navy" /></div></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Tile icon={<BookOpen className="h-5 w-5 text-sky" />} label="Ofertas"><Stepper v={ofertas} set={setOfertas} /></Tile>
              <Tile icon={<ShoppingCart className="h-5 w-5 text-gold" />} label="Vendas">
                <div className="mt-2 text-center text-[22px] font-bold text-navy">{vendas}</div>
                <div className="text-center text-[11px] text-muted-foreground">livros</div>
              </Tile>
              <Tile icon={<Pray className="h-5 w-5 text-grape" />} label="Orações"><Stepper v={oracoes} set={setOracoes} /></Tile>
              <Tile icon={<Clock className="h-5 w-5 text-leaf" />} label="Horas Trabalhadas"><Stepper v={horas} set={setHoras} /></Tile>
            </div>
            <div className="card-soft mt-3 p-3">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-navy"><ShoppingCart className="h-5 w-5 text-gold" />Vendas</div>
              <label className="mt-2 block text-[12px] text-muted-foreground">Valor total vendido no dia</label>
              <div className="mt-1 flex items-center rounded-lg border border-border px-2"><span className="text-[14px] text-navy/70">R$</span>
                <input inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value.replace(/[^\d,]/g, ""))} placeholder="0,00" className="w-full bg-transparent px-2 py-1.5 text-[15px] font-semibold text-navy outline-none" /></div>
              <div className="mt-3 text-[12px] text-muted-foreground">Livros vendidos</div>
              <ul className="mt-1 space-y-1.5">
                {LIVROS.map((l) => { const on = l in livros; return (
                  <li key={l} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${on ? "border-gold bg-gold-soft" : "border-border"}`}>
                    <button onClick={() => toggleLivro(l)} className="flex flex-1 items-center gap-2 text-left text-[13px] text-navy">
                      <span className={`grid h-4 w-4 place-items-center rounded ${on ? "bg-gold" : "border border-muted-foreground/50"}`}>{on && <Check className="h-3 w-3" strokeWidth={3} />}</span>{l}
                    </button>
                    {on && <div className="flex items-center gap-2">
                      <button onClick={() => setQtd(l, livros[l] - 1)} aria-label="Menos" className="grid h-6 w-6 place-items-center rounded-full bg-card text-navy shadow-sm"><Minus className="h-3 w-3" strokeWidth={3} /></button>
                      <span className="w-4 text-center text-[14px] font-bold text-navy">{livros[l]}</span>
                      <button onClick={() => setQtd(l, livros[l] + 1)} aria-label="Mais" className="grid h-6 w-6 place-items-center rounded-full bg-card text-navy shadow-sm"><Plus className="h-3 w-3" strokeWidth={3} /></button>
                    </div>}
                  </li>); })}
              </ul>
            </div>
            <div className="card-soft mt-3 p-3">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-navy"><MessageCircle className="h-5 w-5 text-orange" />Desafios</div>
              <textarea value={desafios} onChange={(e) => setDesafios(e.target.value)} rows={3} placeholder="Descreva desafios, dificuldades ou necessidades do dia..." className="mt-2 w-full resize-none rounded-lg border border-border bg-transparent p-2 text-[13px] text-navy outline-none" />
            </div>
            <button onClick={salvar} className="btn-gold mt-4 flex w-full items-center justify-center gap-3 rounded-2xl py-3.5 text-[17px] font-semibold">
              <Check className="h-5 w-5" strokeWidth={3} /> {saved ? "Lançamento salvo!" : "Salvar Lançamento"}
            </button>
          </>)}

          {tab === "meditacao" && (
            <div className="mt-2">
              <p className="text-[12px] font-medium uppercase tracking-wide text-navy/60">Meditação do dia</p>
              <h2 className="text-[22px] font-semibold leading-tight text-navy">Meditação Diária</h2>
              <p className="mt-1 text-[14px] font-medium text-navy/80">{new Date(todaySP + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
              {todayMeditation ? (
                <div className="mt-4 space-y-4">
                  <div className="card-soft p-4">
                    <h3 className="text-[18px] font-semibold leading-snug text-navy">{todayMeditation.title.replace(" (exemplo demonstrativo)", "")}</h3>
                    {todayMeditation.title.includes("exemplo demonstrativo") && <span className="mt-2 inline-block rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-medium text-navy">Conteúdo demonstrativo</span>}
                  </div>
                  <div className="rounded-xl border-l-4 border-gold bg-gold-soft/40 p-4">
                    <p className="text-[13px] font-semibold uppercase tracking-wide text-navy/70">Texto bíblico</p>
                    <p className="mt-1 text-[14px] italic leading-relaxed text-navy">{todayMeditation.verse}</p>
                  </div>
                  <div className="card-soft p-4">
                    <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-navy/90">{todayMeditation.content}</p>
                  </div>
                </div>
              ) : (
                <div className="card-soft mt-4 p-6 text-center">
                  <p className="text-[15px] text-muted-foreground">Ainda não há meditação disponível para hoje.</p>
                </div>
              )}
            </div>
          )}

          {tab === "treinamento" && (
            <div className="mt-2 space-y-4">
              <div>
                <h2 className="text-[22px] font-semibold leading-tight text-navy">Ofertas</h2>
                <p className="text-[13px] text-navy/80">Materiais e estratégias para fortalecer sua apresentação e suas vendas.</p>
              </div>
              <div className="card-soft overflow-hidden">
                <button onClick={()=>setOpenOfferSection(openOfferSection==="pdfs"?"":"pdfs")} className="flex w-full items-center justify-between px-4 py-3 text-left">
                  <span className="font-semibold text-navy">Ofertas em PDF</span>
                  <span className="text-navy/60">{openOfferSection==="pdfs"?"−":"+"}</span>
                </button>
                {openOfferSection==="pdfs" && (
                  <div className="border-t border-border px-4 pb-4 pt-3">
                    {trainingPdfs.length === 0 ? <p className="text-[13px] text-muted-foreground">Nenhuma oferta disponível.</p> : (
                      <ul className="space-y-3">{trainingPdfs.map(p => (
                        <li key={p.id} className="rounded-xl border border-border p-3">
                          <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-soft text-sky"><BookOpen className="h-5 w-5" /></div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-navy">{p.title}</div>
                              <div className="mt-0.5 text-[11px] text-muted-foreground">{p.category} • {p.date} • PDF</div>
                              <div className="mt-2 text-[13px] leading-relaxed text-navy/80">{p.description}</div>
                              {p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="btn-gold mt-3 inline-flex rounded-lg px-3 py-1.5 text-[12px] font-semibold">Abrir material</a> : <span className="mt-3 inline-block text-[12px] text-muted-foreground">Material demonstrativo (sem arquivo anexado).</span>}
                            </div>
                          </div>
                        </li>
                      ))}</ul>
                    )}
                  </div>
                )}
              </div>
              <div className="card-soft overflow-hidden">
                <button onClick={()=>setOpenOfferSection(openOfferSection==="livros"?"":"livros")} className="flex w-full items-center justify-between px-4 py-3 text-left">
                  <span className="font-semibold text-navy">Ofertas de livros</span>
                  <span className="text-navy/60">{openOfferSection==="livros"?"−":"+"}</span>
                </button>
                {openOfferSection==="livros" && (
                  <div className="border-t border-border px-4 pb-4 pt-3">
                    {bookOffers.length === 0 ? <p className="text-[13px] text-muted-foreground">Nenhum material disponível.</p> : (
                      <ul className="space-y-3">{bookOffers.map(b => (
                        <li key={b.id} className="overflow-hidden rounded-xl border border-border">
                          <div className="bg-navy px-4 py-3 text-primary-foreground">
                            <div className="text-[16px] font-semibold">{b.bookName}</div>
                            {b.bookName.includes("(exemplo)") && <span className="mt-1 inline-block rounded-full bg-gold px-2 py-0.5 text-[10px] font-medium text-navy">Exemplo</span>}
                          </div>
                          <div className="bg-card p-4 text-[13px] text-navy/90">
                            <p className="leading-relaxed">{b.description}</p>
                            {b.arguments && <div className="mt-3"><div className="text-[11px] font-semibold uppercase tracking-wide text-navy/60">Argumentos</div><p className="mt-1">{b.arguments}</p></div>}
                            {b.approach && <div className="mt-3"><div className="text-[11px] font-semibold uppercase tracking-wide text-navy/60">Abordagem sugerida</div><p className="mt-1">{b.approach}</p></div>}
                            {b.offer && <div className="mt-3 rounded-lg bg-gold-soft/50 p-3"><div className="text-[11px] font-semibold uppercase tracking-wide text-navy/70">Oferta</div><p className="mt-1 font-medium text-navy">{b.offer}</p></div>}
                          </div>
                        </li>
                      ))}</ul>
                    )}
                  </div>
                )}
              </div>
              <div className="card-soft overflow-hidden">
                <button onClick={()=>setOpenOfferSection(openOfferSection==="outros"?"":"outros")} className="flex w-full items-center justify-between px-4 py-3 text-left">
                  <span className="font-semibold text-navy">Outros materiais</span>
                  <span className="text-navy/60">{openOfferSection==="outros"?"−":"+"}</span>
                </button>
                {openOfferSection==="outros" && (
                  <div className="border-t border-border px-4 pb-4 pt-3">
                    <p className="text-[12px] text-muted-foreground">Espaço reservado para técnicas de abordagem, objeções, fechamento e orientações. A liderança poderá adicionar conteúdos futuramente.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "ranking" && (
            <div className="mt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">Desempenho da equipe</p>
              <div className="mt-1 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-gold" />
                <h2 className="text-[24px] font-bold leading-tight text-navy">Ranking</h2>
              </div>
              <p className="mt-1 text-[13px] text-navy/70">Acompanhe as horas trabalhadas da equipe.</p>

              {/* Period filter */}
              <div className="mt-4 flex rounded-xl bg-secondary p-1">
                {(["Semanal","Mensal","Semestral"] as const).map(p => (
                  <button key={p} onClick={()=>setRankPeriod(p)} className={`flex-1 rounded-lg py-2 text-[13px] font-medium transition ${rankPeriod===p?"bg-gold text-navy":"text-navy/70"}`}>{p}</button>
                ))}
              </div>

              {/* Modality filter */}
              <div className="mt-3 flex gap-2">
                {(["Casa em Casa","Indicação"] as const).map(m => (
                  <button key={m} onClick={()=>setRankMod(m)} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium ${rankMod===m?"bg-gold text-navy":"bg-card text-navy ring-1 ring-border"}`}>
                    {m==="Casa em Casa"?<Home className="h-4 w-4"/>:<User className="h-4 w-4"/>}{m}
                  </button>
                ))}
              </div>

              {/* Podium */}
              {rankingData.length === 0 ? (
                <div className="card-soft mt-5 p-6 text-center text-[14px] text-muted-foreground">Sem dados para este período/modalidade.</div>
              ) : (
                <>
                  <div className="mt-6 flex items-end justify-center gap-2">
                    {/* 2nd */}
                    {rankingData[1] && (
                      <div className="flex w-[30%] flex-col items-center rounded-t-xl bg-card pt-3 pb-4 shadow ring-1 ring-border">
                        <div className="text-[12px] font-semibold text-navy/60">2º</div>
                        <div className="mt-1 grid h-12 w-12 place-items-center rounded-full bg-sky-soft text-[16px] font-bold text-sky">{rankingData[1].nome.charAt(0)}</div>
                        <div className="mt-2 text-center text-[12px] font-semibold text-navy leading-tight">{rankingData[1].nome.split(" ")[0]}</div>
                        <div className="text-[14px] font-bold text-navy">{rankingData[1].horas}h</div>
                      </div>
                    )}
                    {/* 1st */}
                    {rankingData[0] && (
                      <div className="flex w-[36%] flex-col items-center rounded-t-xl bg-gold pt-4 pb-5 shadow-lg ring-1 ring-gold/50">
                        <Crown className="h-5 w-5 text-navy" />
                        <div className="text-[12px] font-semibold text-navy/80">1º</div>
                        <div className="mt-1 grid h-14 w-14 place-items-center rounded-full bg-card text-[18px] font-bold text-navy">{rankingData[0].nome.charAt(0)}</div>
                        <div className="mt-2 text-center text-[13px] font-bold text-navy leading-tight">{rankingData[0].nome.split(" ")[0]}</div>
                        <div className="text-[16px] font-extrabold text-navy">{rankingData[0].horas}h</div>
                      </div>
                    )}
                    {/* 3rd */}
                    {rankingData[2] && (
                      <div className="flex w-[30%] flex-col items-center rounded-t-xl bg-card pt-3 pb-4 shadow ring-1 ring-border">
                        <div className="text-[12px] font-semibold text-navy/60">3º</div>
                        <div className="mt-1 grid h-12 w-12 place-items-center rounded-full bg-grape-soft text-[16px] font-bold text-grape">{rankingData[2].nome.charAt(0)}</div>
                        <div className="mt-2 text-center text-[12px] font-semibold text-navy leading-tight">{rankingData[2].nome.split(" ")[0]}</div>
                        <div className="text-[14px] font-bold text-navy">{rankingData[2].horas}h</div>
                      </div>
                    )}
                  </div>

                  {/* List for others (4th+) */}
                  {rankingData.length > 3 && (
                    <div className="card-soft mt-4 overflow-hidden">
                      <ul className="divide-y divide-border">
                        {rankingData.slice(3).map((r, idx) => (
                          <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                            <span className="w-6 text-[13px] font-semibold text-navy/60">{idx+4}º</span>
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-[13px] font-bold text-navy">{r.nome.charAt(0)}</div>
                            <span className="flex-1 text-[14px] font-medium text-navy">{r.nome}</span>
                            <span className="text-[14px] font-bold text-navy">{r.horas}h</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Sua posição */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border-l-4 border-gold bg-gold-soft/60 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/30 text-navy"><User className="h-5 w-5" /></div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-navy/60">Sua posição</div>
                  <div className="text-[15px] font-semibold text-navy">{getColportor(myId)?.nome || "Você"}</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold text-navy">{myRank ? `${myRank}º` : "—"}</div>
                  <div className="text-[13px] text-navy/80">{myHoras}h</div>
                </div>
              </div>
            </div>
          )}
          {tab === "hist" && <div className="mt-2 text-[14px] text-muted-foreground">Histórico (protótipo): use a visão do Líder para ver lançamentos.</div>}
          {tab === "perfil" && <div className="mt-2 text-[14px] text-muted-foreground">Perfil (protótipo).</div>}
        </div>

        <nav className="grid grid-cols-7 bg-navy px-0.5 pb-5 pt-2 text-[8px] text-primary-foreground">
          {[{ id: "inicio", l: "Início", i: Home }, { id: "lancar", l: "Lançar", i: PlusCircle }, { id: "hist", l: "Histórico", i: BarChart3 }, { id: "meditacao", l: "Meditação", i: BookOpen }, { id: "treinamento", l: "Ofertas", i: GraduationCap }, { id: "ranking", l: "Ranking", i: Trophy }, { id: "perfil", l: "Perfil", i: User }].map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} className={`mx-0 flex flex-col items-center gap-0.5 rounded-xl py-2 ${tab === n.id ? "btn-gold font-semibold" : ""}`}><n.i className="h-4 w-4" />{n.l}</button>
          ))}
          <span className="col-span-7 mx-auto mt-2 h-1 w-24 rounded-full bg-primary-foreground" />
        </nav>
        {saved && <div className="absolute inset-x-6 bottom-28 z-30 flex items-center gap-2 rounded-xl bg-navy px-4 py-3 text-[13px] text-primary-foreground shadow-xl animate-in fade-in"><Check className="h-4 w-4 text-gold" /> Lançamento enviado à liderança.</div>}
        <button onClick={() => setNotif(true)} title="Simular lembrete das 21h" className="absolute right-3 top-[150px] z-10 grid h-8 w-8 place-items-center rounded-full bg-card text-navy shadow ring-1 ring-border"><Bell className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
