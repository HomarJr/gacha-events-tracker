import { eventsData } from 'https://cdn.jsdelivr.net/gh/MadeBaruna/paimon-moe@main/src/data/timeline.js'
import {
  dateObjectToFormattedDate,
  stringToFormattedDate,
  toId,
  type ganttBarConfig,
  type TimelineEvents,
} from '@/data/comon'
import type { GanttBarObject } from '@infectoone/vue-ganttastic'

export function getGenshinEventsData(): TimelineEvents[] {
  const mappedGenshinEvenetsData: TimelineEvents[] = []
  const allGenshinEvents: GanttBarObject[][] = []

  let minDate = new Date()
  let maxDate = new Date()

  eventsData.forEach((events) => {
    const genshinEvents: GanttBarObject[] = []

    events.forEach((event) => {
      if (event.showOnHome === false) return

      const startDate = new Date(event.start)
      const endDate = new Date(event.end)

      if (startDate < minDate) minDate = startDate
      if (endDate > maxDate) maxDate = endDate

      const eventBarObject: GanttBarObject = {
        start: stringToFormattedDate(event.start),
        end: stringToFormattedDate(event.end),
        ganttBarConfig: {
          // TODO: show image and link and add link to official url
          id: toId(event.name),
          label: event.name,
          style: {
            background: event.color,
          },
        } as ganttBarConfig,
      }
      genshinEvents.push(eventBarObject)
    })

    allGenshinEvents.push(genshinEvents)
  })

  allGenshinEvents.forEach((genshinEvents) => {
    mappedGenshinEvenetsData.push({
      label: 'Genshin Impact',
      start: dateObjectToFormattedDate(minDate),
      end: dateObjectToFormattedDate(maxDate),
      events: genshinEvents,
    })
  })

  return mappedGenshinEvenetsData
}
