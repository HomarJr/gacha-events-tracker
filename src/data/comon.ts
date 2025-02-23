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

export function stringToFormattedDate(str: string): string {
  const date = new Date(str)
  return dateObjectToFormattedDate(date)
}

export function dateObjectToFormattedDate(date: Date): string {
  return date.toISOString().slice(0, 16).replace('T', ' ')
}

export function toId(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}
