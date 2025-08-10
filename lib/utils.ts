import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate chat ID (abbreviation + timestamp)
export function generateChatId(): string {
  const timestamp = Date.now()
  const shortId = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${shortId}_${timestamp}`
}