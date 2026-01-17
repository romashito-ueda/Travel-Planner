import tripData from "@/data/trip.json";

export type TripData = typeof tripData;
export type TripEvent = TripData["events"][0];
export type TripConstraint = TripData["constraints"][0];
export type TripPlace = TripData["places"][0];
export type ChecklistItem = TripData["checklist"][0];
export type SourceItem = TripData["sources"][0];

export type EventStatus = "confirmed" | "planned" | "todo";
export type EventType = "flight" | "train" | "hotel" | "activity" | "other";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "planned": return "bg-amber-100 text-amber-800 border-amber-200";
    case "todo": return "bg-slate-100 text-slate-600 border-slate-200 border-dashed";
    default: return "bg-slate-100 text-slate-800";
  }
};

export const getTypeIcon = (type: string) => {
  // Returns lucide icon name concept - implementation will be in component
  switch (type) {
    case "flight": return "Plane";
    case "train": return "Train";
    case "hotel": return "Hotel";
    case "activity": return "MapPin"; 
    default: return "Circle";
  }
};
