import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateVideoCallLink(): string {
  const roomId = Math.random().toString(36).substring(2, 15);
  return `https://meet.jit.si/leadgen-${roomId}`;
}

export function generateGoogleMapsUrl(company: string, location?: string): string {
  const query = location ? `${company} ${location}` : company;
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}