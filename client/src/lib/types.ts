import tripData from "@/data/trip.json";
import checkListData from "@/data/checklist.json";

export type TripData = typeof tripData;
export type CheckList = typeof checkListData;

export type Recommendation = {
  title: string;
  description: string;
  image: string; // Data URI or local path
  searchQuery?: string;
};

/** 列車カードの要約表示（カード上に出す） */
export type TrainSummary = {
  serviceName?: string;          // 例: "IR26" / "TGV 9211"
  platform?: string | null;      // 例: "9"（未確定なら null）
  destination?: string;          // 例: "Luzern" / "Locarno"
};

/** 詳細モーダルに出す（時刻表・購入方法・行き方） */
export type TrainLeg = {
  from: string;
  to: string;
  depTime: string;               // "14:04" 形式
  arrTime: string;               // "15:05" 形式
  platformDep?: string;          // "9"
  platformArr?: string;          // "7"
  service: string;               // "IR 26 2327"
  direction?: string;            // "Locarno"
};

export type TrainTimetableRow = {
  optionNo: number;              // 1..n
  depTime: string;
  arrTime: string;
  duration: string;              // "1h01" 等
  transfers: number;             // 0,1,2...
  services: string[];            // ["IR26"] or ["IC61","RE24"]
  recommended?: boolean;
  legs?: TrainLeg[];
};

export type TrainTimetable = {
  note?: string;                 // 番線変更注意など
  rows: TrainTimetableRow[];
};

export type TrainDetails = {
  timetable?: TrainTimetable;
  howToBuy?: string;             // 改行入りの日本語
  howToGet?: string;             // 改行入りの日本語
};

/** イベント型（JSON由来 + 表示用拡張） */
export type TripEvent = TripData["events"][0] & {
  nameJa?: string;
  locationJa?: string;
  recommendations?: Recommendation[];

  // Train専用（あってもなくてもよい）
  trainSummary?: TrainSummary;
  trainDetails?: TrainDetails;
};

export type TripPlace = TripData["places"][0] & {
  nameJa?: string;
};

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
  switch (type) {
    case "flight": return "Plane";
    case "train": return "Train";
    case "hotel": return "Hotel";
    case "activity": return "MapPin";
    default: return "Circle";
  }
};
