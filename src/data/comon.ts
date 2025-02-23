import type { GanttBarObject } from '@infectoone/vue-ganttastic'
import type { CSSProperties } from 'vue'

export interface ganttBarConfig {
  id: string
  label?: string
  html?: string
  hasHandles?: boolean
  immobile?: boolean
  bundle?: string
  pushOnOverlap?: boolean
  dragLimitLeft?: number
  dragLimitRight?: number
  style?: CSSProperties
  class?: string
}

export interface TimelineEvents {
  label: string
  start: string
  end: string
  events: GanttBarObject[]
}

/**
 * Converts a date string to a date string in the format `YYYY-MM-DD HH:mm`.
 * @param {string} str - The date string to format.
 * @returns {string} The formatted date string.
 */
export function stringToFormattedDate(str: string): string {
  const date = new Date(str)
  return dateObjectToFormattedDate(date)
}

/**
 * Converts a Date object to a date string in the format `YYYY-MM-DD HH:mm`.
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date string.
 */
export function dateObjectToFormattedDate(date: Date): string {
  return date.toISOString().slice(0, 16).replace('T', ' ')
}

/**
 * Converts a string to a URL-friendly ID.
 * @param {string} str - The string to convert.
 * @returns {string} The URL-friendly ID.
 */
export function toId(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}
