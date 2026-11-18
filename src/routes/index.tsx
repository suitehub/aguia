import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Leader } from "@/components/aguia/Leader";
import { ColportorApp } from "@/components/aguia/Colportor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Águia — Controle e Acompanhamento da Colportagem" },
      { name: "description", content: "Painel do líder e lançamento diário do colportor no sistema Águia." },
      { property: "og:title", content: "Águia — Colportagem" },
      { property: "og:description", content: "Painel do líder e lançamento diário do colportor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<"lider" | "colportor">("lider");
  return (
    <div className="stage-bg relative min-h-screen overflow-x-auto">
      <div className="fixed bottom-4 left-4 z-50 flex rounded-full bg-card/80 p-0.5 text-[11px] shadow ring-1 ring-border backdrop-blur">
        {(["lider", "colportor"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`rounded-full px-3 py-1 font-medium ${view === v ? "bg-navy text-primary-foreground" : "text-muted-foreground"}`}>{v === "lider" ? "Líder" : "Colportor"}</button>
        ))}
      </div>
      <div className="flex min-h-screen w-max min-w-full items-center justify-center p-8">
        {view === "lider" ? <Leader /> : <ColportorApp />}
      </div>
    </div>
  );
}
