import { useState, useEffect } from "react";
import { TripData, ChecklistItem } from "@/lib/types";
import { Check, User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistProps {
  data: TripData;
}

export default function Checklist({ data }: ChecklistProps) {
  // Initialize state from localStorage or default data
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem("trip-checklist");
    return saved ? JSON.parse(saved) : data.checklist;
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("trip-checklist", JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Group by category
  const categories = Array.from(new Set(items.map(i => i.category)));
  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

  return (
    <div className="pb-24 pt-8 px-4 max-w-md mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold mb-2">Packing List</h1>
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
        {categories.map(category => (
          <div key={category} className="space-y-3">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1">
              {category}
            </h2>
            <div className="bg-card rounded-xl border shadow-sm divide-y divide-border">
              {items.filter(i => i.category === category).map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors group"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    item.checked 
                      ? "bg-primary border-primary" 
                      : "border-muted-foreground/30 group-hover:border-primary/50"
                  )}>
                    {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium transition-all",
                      item.checked ? "text-muted-foreground line-through decoration-border" : "text-foreground"
                    )}>
                      {item.item}
                    </p>
                  </div>

                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1",
                    item.assignee === 'me' ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                  )}>
                    {item.assignee === 'me' ? <User className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                    {item.assignee}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
