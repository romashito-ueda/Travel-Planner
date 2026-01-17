import { TripData } from "@/lib/types";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Link } from "wouter";

interface OverviewProps {
  data: TripData;
}

export default function Overview({ data }: OverviewProps) {
  const startDate = new Date(data.dateRange.start);
  const endDate = new Date(data.dateRange.end);
  const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="pb-24 pt-8 px-4 max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2 text-center">
        <span className="inline-block px-3 py-1 bg-primary/5 text-primary text-xs font-semibold rounded-full tracking-wider">
          ITINERARY
        </span>
        <h1 className="text-3xl font-bold font-jp leading-tight text-foreground">
          {data.tripTitle}
        </h1>
        <p className="text-muted-foreground flex items-center justify-center gap-2 text-sm font-medium">
          <Calendar className="w-4 h-4" />
          {format(startDate, "yyyy年M月d日", { locale: ja })} - {format(endDate, "M月d日", { locale: ja })}
          <span className="bg-muted px-2 py-0.5 rounded text-xs ml-1">
            {daysCount}日間
          </span>
        </p>
      </header>

      {/* Hero Image/Card */}
      <div className="relative aspect-video bg-muted rounded-xl overflow-hidden shadow-sm border border-border/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" 
          alt="Paris" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 z-20 text-white">
          <p className="font-medium text-lg">Bon Voyage!</p>
          <p className="text-white/80 text-sm">Have a safe trip.</p>
        </div>
      </div>

      {/* Quick Stats/Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center space-y-1">
          <span className="text-2xl font-bold text-primary">{data.events.filter(e => e.type === 'flight').length}</span>
          <span className="text-xs text-muted-foreground font-medium">Flights</span>
        </div>
        <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center space-y-1">
          <span className="text-2xl font-bold text-primary">{data.events.filter(e => e.type === 'hotel').length}</span>
          <span className="text-xs text-muted-foreground font-medium">Hotels</span>
        </div>
      </div>

      {/* Critical Constraints */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider ml-1">Key Constraints</h2>
        {data.constraints.map(constraint => (
          <div key={constraint.id} className="bg-destructive/5 border border-destructive/20 p-4 rounded-xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-destructive text-sm mb-0.5">
                {format(new Date(constraint.date), "M月d日", { locale: ja })} {constraint.time}
              </p>
              <p className="text-sm text-foreground/80 leading-snug">
                {constraint.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Action */}
      <Link href="/schedule">
        <a className="block w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          スケジュールを見る
          <ArrowRight className="w-4 h-4" />
        </a>
      </Link>
    </div>
  );
}
