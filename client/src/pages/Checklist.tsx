import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import checklistData from "@/data/checklist.json";

type CategoryDef = { key: string; labelJa: string };
type ChecklistItem = { id: string; text: string; category: string; checked: boolean };

const STORAGE_KEY = "trip-checklist-v2";

export default function Checklist() {
  const categories: CategoryDef[] = checklistData.categories;
  const categoryLabel = new Map(categories.map(c => [c.key, c.labelJa]));

  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as ChecklistItem[];
    return checklistData.items as ChecklistItem[];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const total = items.length;
  const checkedCount = items.filter(i => i.checked).length;
  const progress = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  return (
    <div className="pb-24 pt-8 px-4 max-w-md mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold mb-2">持ち物リスト</h1>
        <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-border/50">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-bold font-mono text-primary">{progress}%</span>
        </div>
      </header>

      <div className="space-y-8">
        {categories.map(cat => {
          const catItems = items.filter(i => i.category === cat.key);
          if (catItems.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-3">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1">
                {cat.labelJa}
              </h2>

              <div className="bg-card rounded-xl border shadow-sm divide-y divide-border">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors group"
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                        item.checked
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30 group-hover:border-primary/50"
                      )}
                    >
                      {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>

                    <div className="flex-1">
                      <p
                        className={cn(
                          "font-medium transition-all",
                          item.checked
                            ? "text-muted-foreground line-through decoration-border"
                            : "text-foreground"
                        )}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
