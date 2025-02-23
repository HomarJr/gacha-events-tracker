// Genshin Impact: https://github.com/MadeBaruna/paimon-moe

declare module 'https://cdn.jsdelivr.net/gh/MadeBaruna/paimon-moe@main/src/data/timeline.js' {
  export type EventData = {
    name: string
    pos: string
    zoom?: string
    image: string
    start: string
    end: string
    color: string
    url: string
    showOnHome: boolean
    timezoneDependent?: boolean
  }
  export const eventsData: EventData[][]
}
