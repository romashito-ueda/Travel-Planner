import { Link, useLocation } from "wouter";
import { Calendar, Map, CheckSquare, FileText, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "概要" },
    { href: "/schedule", icon: Calendar, label: "日程" },
    { href: "/map", icon: Map, label: "地図" },
    { href: "/checklist", icon: CheckSquare, label: "持ち物" },
    { href: "/sources", icon: FileText, label: "資料" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-border z-50 pb-6 pt-1">
      <div className="flex justify-around items-center h-14 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href === "/schedule" && location.startsWith("/schedule"));
          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
                isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
              )}>
                {isActive && (
                  <span className="absolute -top-1 w-8 h-0.5 bg-primary rounded-full" />
                )}
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px]">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
