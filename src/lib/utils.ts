import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  const nameParts = name.split(' ');
  let initials: string[] = [];

  for (const part of nameParts.slice(0, 2)) {
    if (part) {
      initials.push(part[0].toUpperCase());
    }
  }
  return initials.join('');
}
