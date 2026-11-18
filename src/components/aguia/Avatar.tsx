import type { Colportor } from "./data";
export function Avatar({ c, size = 48 }: { c: Colportor; size?: number }) {
  if (c.foto) return <img src={c.foto} alt={c.nome} width={size} height={size} loading="lazy" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  const ini = c.nome.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return <div className="grid shrink-0 place-items-center rounded-full bg-navy font-semibold text-gold" style={{ width: size, height: size, fontSize: size * 0.36 }}>{ini}</div>;
}
