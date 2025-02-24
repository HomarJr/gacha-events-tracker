import { stringToFormattedDate, toId, type ganttBarConfig, type TimelineEvents } from '@/data/comon'
import type { GanttBarObject } from '@infectoone/vue-ganttastic'

export interface WuWaEventData {
  id?: number // announcement id
  name: string
  description?: string
  img: string
  startDate: string // use Server time (UTC+8)
  endDate: string // use Server time (UTC+8)
  color?: string // defaults to automatically detecting the img color (prefer darker colors)
  url?: string // link to an informative page about the event, always prefer https://wutheringwaves.kurogames.com/en/main/news
  showOnHome?: boolean // whether we show it in the home dashboard
  isGlobal?: boolean
  sourceName?: string // the display name of the source URL
  reliability?: 'Speculation' | 'Official'
  group?: number // events with the same group will overlap and merge if they are within 1 hour from each other's start & end dates, respectively
}

export const WUWA_EVENT_GROUP = {
  PIONEER_PODCAST: 0,
  ILLUSIVE_REALM: 1,
  TOWER_OF_ADVERSITY: 2,
  DOUBLE_DROPS: 3,
  SEVEN_DAY_LOGIN: 4,
  PINCER_MANEUVER_WARRIORS: 5,
}

function replaceEventGroupReferences(eventsCode: string): string {
  return eventsCode.replace(/EVENT_GROUP\.(\w+)/g, function (_, groupName) {
    return (
      WUWA_EVENT_GROUP[groupName as keyof typeof WUWA_EVENT_GROUP]?.toString() ?? `"${groupName}"`
    )
  })
}

function ensureValidJson(eventsCode: string): string {
  // WuWaEventData keys + 'banners' and 'activities'
  const keysToReplace = [
    'banners',
    'activities',
    'id',
    'name',
    'description',
    'img',
    'startDate',
    'endDate',
    'color',
    'url',
    'showOnHome',
    'isGlobal',
    'sourceName',
    'reliability',
    'group',
  ]

  // Add double quotes to keys
  keysToReplace.forEach(function (key) {
    eventsCode = eventsCode.replace(new RegExp(`${key}:`, 'g'), `"${key}":`)
  })

  // Remove trailing commas before closing braces or brackets
  let updatedCode = eventsCode.replace(/,(\s*[\}\]])/g, '$1')

  // Replace backticks with double quotes and escape double quotes inside descriptions
  updatedCode = updatedCode.replace(/`([^`]*?)`/g, function (match) {
    const content = match.slice(1, -1)
    const escapedContent = content.replace(/"/g, '\\"')
    return `"${escapedContent}"`
  })

  return updatedCode
}

async function loadWuwaEvents(): Promise<
  { banners: WuWaEventData[]; activities: WuWaEventData[] } | undefined
> {
  const DELIMITER_START = 'const rawEvents: { banners: Event[]; activities: Event[] } = '
  const DELIMITER_END = 'export const events = {'

  const response = await fetch(
    'https://raw.githubusercontent.com/wuwatracker/wuwatracker/main/events.ts',
  )
  const tsCode = await response.text()

  const start = tsCode.indexOf(DELIMITER_START) + DELIMITER_START.length
  const end = tsCode.indexOf(DELIMITER_END)
  let eventsCode = tsCode.substring(start, end).trim()

  eventsCode = replaceEventGroupReferences(eventsCode)
  eventsCode = ensureValidJson(eventsCode)

  try {
    const events = JSON.parse(eventsCode)
    if (Array.isArray(events.banners) && Array.isArray(events.activities)) {
      return events
    } else {
      console.error('Parsed events structure is invalid:', events)
    }
  } catch (error) {
    console.error('Failed to parse events code:', error)
    console.info('Raw events code:', eventsCode)
  }
}

export async function getWuwaEventsData(): Promise<TimelineEvents[]> {
  const mappedWuwaEvents: TimelineEvents[] = []
  const allWuwaEvents: GanttBarObject[][] = []

  let minDate = new Date()
  let maxDate = new Date()

  const groupedByGroup: Record<number, GanttBarObject[]> = {}

  const wuwaEvents = await loadWuwaEvents()
  if (wuwaEvents) {
    const allEvents = wuwaEvents.banners.concat(wuwaEvents.activities)
    allEvents.forEach((event: WuWaEventData) => {
      if (event.reliability === 'Speculation') return

      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)

      if (startDate < minDate) minDate = startDate
      if (endDate > maxDate) maxDate = endDate

      const eventGroup = event.group ?? -1
      if (!groupedByGroup[eventGroup]) {
        groupedByGroup[eventGroup] = []
      }

      groupedByGroup[eventGroup].push({
        start: stringToFormattedDate(event.startDate),
        end: stringToFormattedDate(event.endDate),
        ganttBarConfig: {
          // TODO: show image and link and add link to official url
          id: toId(event.name),
          label: event.name,
          style: {
            background: event.color,
          },
        } as ganttBarConfig,
      })
    })

    for (const group in groupedByGroup) {
      //TODO: fix possible overlap in some events
      allWuwaEvents.push(groupedByGroup[group])
    }

    allWuwaEvents.forEach((wuwaEvents) => {
      mappedWuwaEvents.push({
        label: 'Wuthering Waves',
        start: stringToFormattedDate(minDate.toISOString()),
        end: stringToFormattedDate(maxDate.toISOString()),
        events: wuwaEvents,
      })
    })
  }

  return mappedWuwaEvents
}
