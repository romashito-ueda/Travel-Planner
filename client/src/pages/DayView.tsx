import { useState, useRef, useEffect } from "react";
import { TripData, TripEvent, getStatusColor, getTypeIcon, Recommendation } from "@/lib/types";
import { formatTime, formatDate, formatShortDate, isDateActive, cn } from "@/lib/utils";
import { Plane, Train, Hotel, MapPin, Circle, Clock, ChevronDown, ChevronUp, AlertTriangle, Calendar, Sparkles, X, ExternalLink } from "lucide-react";
import { addDays, parseISO, isSameDay } from "date-fns";
import { Drawer } from "vaul";
import { RecommendationCard } from "@/components/RecommendationCard";

interface DayViewProps {
  data: TripData;
}

const IconMap = {
  Plane,
  Train,
  Hotel,
  MapPin,
  Circle,
};

export default function DayView({ data }: DayViewProps) {
  const startDate = parseISO(data.dateRange.start);
  const endDate = parseISO(data.dateRange.end);
  const days: Date[] = [];
  let curr = startDate;
  while (curr <= endDate) {
    days.push(curr);
    curr = addDays(curr, 1);
  }

  const [selectedDate, setSelectedDate] = useState(data.dateRange.start);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected date
  useEffect(() => {
    if (scrollRef.current) {
      const activeBtn = scrollRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDate]);

  const currentEvents = data.events
    .filter(e => isSameDay(parseISO(e.start), parseISO(selectedDate)))
    .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

  const currentConstraint = data.constraints.find(c => isSameDay(parseISO(c.date), parseISO(selectedDate)));

  return (
    <div className="pb-24 h-full flex flex-col">
      {/* Date Selector Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-border">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto py-3 px-4 gap-2 no-scrollbar snap-x"
        >
          {days.map((day) => {
            const dateStr = day.toISOString();
            const isActive = isDateActive(selectedDate, dateStr);
            return (
              <button
                key={dateStr}
                data-active={isActive}
                onClick={() => setSelectedDate(dateStr)}
                className={cn(
                  "snap-center flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105" 
                    : "bg-white text-muted-foreground border-border hover:bg-muted"
                )}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                  {formatShortDate(dateStr).split('(')[1].replace(')', '')}
                </span>
                <span className={cn("text-lg font-bold font-mono", isActive ? "text-white" : "text-foreground")}>
                  {day.getDate()}
                </span>
              </button>
            );
          })}
        </div>
        <div className="px-4 py-2 bg-muted/30 text-center border-b border-border/50">
          <h2 className="text-sm font-semibold text-foreground">
            {formatDate(selectedDate)}
          </h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-md mx-auto w-full">
        
        {/* Daily Constraint Banner */}
        {currentConstraint && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-destructive uppercase tracking-wide">Important</p>
              <p className="text-sm font-medium text-destructive-foreground">
                 {currentConstraint.time} - {currentConstraint.description}
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {currentEvents.length > 0 ? (
          <div className="relative pl-4 border-l-2 border-border space-y-8">
            {currentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="w-8 h-8 opacity-20" />
            </div>
            <p>予定はありません</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: TripEvent }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = IconMap[getTypeIcon(event.type) as keyof typeof IconMap] || Circle;
  const statusColor = getStatusColor(event.status);

  // Helper to format time range spanning midnight
  const formatEventTime = (startStr: string, endStr: string) => {
    const start = parseISO(startStr);
    const end = parseISO(endStr);
    const isNextDay = !isSameDay(start, end);
    
    return {
      start: formatTime(startStr),
      end: formatTime(endStr),
      isNextDay
    };
  };

  const timeDisplay = formatEventTime(event.start, event.end);

  return (
    <div className="relative group">
      {/* Timeline Dot */}
      <div className={cn(
        "absolute -left-[21px] top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10",
        event.status === 'confirmed' ? "bg-primary" : "bg-muted-foreground"
      )} />

      <div 
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "relative bg-card rounded-xl border shadow-sm transition-all duration-200 overflow-hidden cursor-pointer",
          expanded ? "ring-2 ring-primary/5" : "hover:shadow-md",
          event.status === 'todo' && "border-dashed bg-slate-50/50"
        )}
      >
        <div className="p-4 flex gap-4">
          {/* Time Column */}
          <div className="flex flex-col items-center min-w-[3.5rem] pt-1">
            <span className="text-sm font-bold font-mono text-foreground">{timeDisplay.start}</span>
            <span className="h-full w-px bg-border/50 my-1"></span>
            <div className="flex flex-col items-center">
              {timeDisplay.isNextDay && <span className="text-[9px] leading-tight text-muted-foreground font-medium mb-0.5">翌日</span>}
              <span className="text-xs text-muted-foreground font-mono">{timeDisplay.end}</span>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={cn("p-1.5 rounded-md bg-muted", statusColor.split(' ')[0])}>
                  <Icon className={cn("w-4 h-4", statusColor.split(' ')[1])} />
                </span>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wider",
                  statusColor
                )}>
                  {event.status}
                </span>
              </div>
              {event.details && (
                <button className="text-muted-foreground">
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
            
            <h3 className="font-bold text-foreground text-lg leading-tight mt-1">
              {event.nameJa ? (
                <>
                  <span className="block">{event.nameJa}</span>
                  <span className="block text-xs font-normal text-muted-foreground mt-0.5">{event.title}</span>
                </>
              ) : (
                event.title
              )}
            </h3>
            
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{event.locationJa || event.location}</span>
            </div>

            {/* Recommendations Button */}
            {event.recommendations && event.recommendations.length > 0 && (
              <div className="mt-3">
                 <Drawer.Root>
                  <Drawer.Trigger asChild>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-2.5 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg border border-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 fill-indigo-200" />
                      おすすめの場所
                    </button>
                  </Drawer.Trigger>
                  <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                    <Drawer.Content className="bg-background flex flex-col rounded-t-[20px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
                      <div className="p-4 bg-background rounded-t-[20px] flex-1 overflow-y-auto">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />
                        
                        <div className="max-w-md mx-auto space-y-6 pb-safe">
                          <header className="text-center space-y-1 mb-8">
                            <h2 className="text-2xl font-bold text-foreground">おすすめの過ごし方</h2>
                            <p className="text-muted-foreground text-sm">{event.nameJa || event.title}</p>
                          </header>

                          <div className="space-y-6">
                            {event.recommendations.map((rec: Recommendation, i: number) => (
                              <RecommendationCard key={i} rec={rec} />
                            ))}
                          </div>
                          
                          <div className="pt-4">
// ... (rest of file)
                            <Drawer.Close asChild>
                              <button className="w-full py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors">
                                閉じる
                              </button>
                            </Drawer.Close>
                          </div>
                        </div>
                      </div>
                    </Drawer.Content>
                  </Drawer.Portal>
                </Drawer.Root>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Details */}
        {expanded && event.details && (
          <div className="px-4 pb-4 pl-[4.5rem] animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="p-3 bg-muted/50 rounded-lg text-sm text-foreground/80 border border-border/50">
              <p className="whitespace-pre-line">{event.details}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
