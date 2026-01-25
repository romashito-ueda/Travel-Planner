import { ArrowLeft, Clock, AlertTriangle, Tag } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { getRecommendationDoc } from "@/data/recommendations/index";
import type { RecommendationItem, RecommendationSection } from "@/data/recommendations/index";
import { RecommendationCard } from "@/components/RecommendationCard";

export default function RecommendationPage({ slug }: { slug: string }) {
  const [location, setLocation] = useLocation();
  const doc = getRecommendationDoc(slug);

  if (!doc) {
    return (
      <div className="pb-24 pt-8 px-4 max-w-md mx-auto space-y-6">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/schedule")}
            className="w-10 h-10 rounded-xl border bg-card flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">おすすめが見つかりません</h1>
            <p className="text-sm text-muted-foreground">{slug}</p>
          </div>
        </header>

        <div className="bg-card rounded-xl border shadow-sm p-4 text-sm text-muted-foreground">
          このページはまだ用意されていません。URL（slug）と recommendations データを確認してください。
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto space-y-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/schedule")}
            className="w-10 h-10 rounded-xl border bg-card flex items-center justify-center hover:bg-muted/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold leading-tight">{doc.titleJa}</h1>
            {doc.subtitleJa && (
              <p className="text-sm text-muted-foreground">{doc.subtitleJa}</p>
            )}
          </div>
        </div>
      </header>

      {/* Guardrails */}
      {doc.guardrails && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-destructive uppercase tracking-wide">
                Important
              </p>
              <p className="text-sm font-semibold text-foreground">
                {doc.guardrails.headlineJa}
              </p>
            </div>
          </div>

          {doc.guardrails.rules && doc.guardrails.rules.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
              {doc.guardrails.rules.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          )}

          {doc.guardrails.recommendedReturnTimeToAirport && (
            <div className="flex items-center gap-2 text-sm text-foreground/80 pt-1">
              <Clock className="w-4 h-4" />
              <span>
                推奨：空港に戻る目安{" "}
                <span className="font-bold font-mono">
                  {new Date(doc.guardrails.recommendedReturnTimeToAirport).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  )}
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-10">
        {doc.sections.map(section => (
          <section key={section.key} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold">{section.titleJa}</h2>
              {section.descriptionJa && (
                <p className="text-sm text-muted-foreground">{section.descriptionJa}</p>
              )}
            </div>

            <div className="space-y-4">
              {section.items.map(item => (
                <RecItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function RecItem({ item }: { item: any }) {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-4 space-y-3">
      <div className="space-y-1">
        <h3 className="font-bold text-foreground text-base leading-tight">
          {item.title}
        </h3>
        {item.summary && (
          <p className="text-sm text-muted-foreground">{item.summary}</p>
        )}
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((t: string) => (
            <span
              key={t}
              className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground inline-flex items-center gap-1"
            >
              <Tag className="w-3 h-3 opacity-50" />
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Time budget */}
      {(item.timeBudget?.minMinutes || item.timeBudget?.recommendedMinutes) && (
        <div className="text-sm text-foreground/80 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            目安：最低 {item.timeBudget?.minMinutes ?? "-"} 分／推奨{" "}
            {item.timeBudget?.recommendedMinutes ?? "-"} 分
          </span>
        </div>
      )}

      {/* Expandable details */}
      {(item.howTo?.length || item.plan || item.facts || item.riskNotes?.length) && (
        <details className="rounded-lg border bg-muted/30 p-3">
          <summary className="cursor-pointer text-sm font-bold text-foreground">
            詳細を表示
          </summary>

          <div className="mt-3 space-y-4 text-sm text-foreground/80">
            {item.howTo?.length > 0 && (
              <div className="space-y-2">
                <p className="font-bold">手順</p>
                <ol className="list-decimal pl-5 space-y-1">
                  {item.howTo.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            )}

            {item.riskNotes?.length > 0 && (
              <div className="space-y-2">
                <p className="font-bold">注意</p>
                <ul className="list-disc pl-5 space-y-1">
                  {item.riskNotes.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.plan && (
              <div className="space-y-2">
                <p className="font-bold">時間配分（例）</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(item.plan).map(([k, v]) => {
                    const timeStr = typeof v === "string" ? v : "";
                    const d = timeStr ? new Date(timeStr) : null;
                    const valid = d && !Number.isNaN(d.getTime());

                    return (
                      <div key={k} className="rounded-md bg-background border p-2">
                        <p className="text-[11px] font-bold text-muted-foreground">{k}</p>
                        <p className="font-mono font-bold">
                          {valid ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {item.facts && (
              <div className="space-y-2">
                <p className="font-bold">事実メモ</p>
                <pre className="text-xs whitespace-pre-wrap bg-background border rounded-md p-2 overflow-x-auto">
{JSON.stringify(item.facts, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </details>
      )}

      {/* Optional: show a RecommendationCard-style block if you want consistent photo behavior */}
      {item.searchQuery && (
        <div className="pt-1">
          <RecommendationCard
            rec={{
              title: item.title,
              description: item.summary || "",
              image: "",
              searchQuery: item.searchQuery
            }}
          />
        </div>
      )}
    </div>
  );
}