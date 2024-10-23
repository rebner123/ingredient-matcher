import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatError(error) {
    return {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    };
  }