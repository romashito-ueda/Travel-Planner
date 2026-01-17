import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isSameDay } from "date-fns";
import { ja } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(dateStr: string) {
  try {
    return format(parseISO(dateStr), "HH:mm");
  } catch (e) {
    return "--:--";
  }
}

export function formatDate(dateStr: string) {
  try {
    return format(parseISO(dateStr), "M月d日 (E)", { locale: ja });
  } catch (e) {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string) {
  try {
    return format(parseISO(dateStr), "d日(E)", { locale: ja });
  } catch (e) {
    return dateStr;
  }
}

export function isDateActive(currentDate: string, targetDate: string) {
  try {
    return isSameDay(parseISO(currentDate), parseISO(targetDate));
  } catch (e) {
    return false;
  }
}
