import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(timestamp: string | Date | number) {
  return format(new Date(timestamp), 'dd/MM/yyyy HH:mm', { locale: vi });
}
