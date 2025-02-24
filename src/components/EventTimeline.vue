<template>
  <g-gantt-chart
    :chart-start="startDate"
    :chart-end="endDate"
    precision="day"
    grid
    current-time
    width="100%"
    bar-start="start"
    bar-end="end"
    date-format="YYYY-MM-DD HH:mm"
    @dragstart-bar.prevent=""
    @drag-bar.prevent=""
    @dragend-bar.prevent=""
  >
    <g-gantt-row
      v-for="(groupEventData, index) in genshinEventsData"
      :key="index"
      :label="groupEventData.label"
      :bars="groupEventData.events"
      highlight-on-hover
    />
    <g-gantt-row
      v-for="(groupEventData, index) in wuwaEventsData"
      :key="index"
      :label="groupEventData.label"
      :bars="groupEventData.events"
      highlight-on-hover
    />
  </g-gantt-chart>
</template>

<script setup lang="ts">
import { dateObjectToFormattedDate, type TimelineEvents } from '@/data/comon'
import { getGenshinEventsData } from '@/data/genshin'
import { getWuwaEventsData } from '@/data/wuwa'
import { onMounted, ref } from 'vue'

const startDate = ref(dateObjectToFormattedDate(new Date()))
const endDate = ref(dateObjectToFormattedDate(new Date()))
const genshinEventsData = ref<TimelineEvents[]>([])
const wuwaEventsData = ref<TimelineEvents[]>([])

onMounted(async () => {
  const genshinData = getGenshinEventsData()
  if (genshinData.length > 0) {
    genshinEventsData.value = genshinData
    // since all events, regardless of the group, have the same start and end date we can just use the first one
    updateDateRange(genshinData[0].start, genshinData[0].end)
  }

  const wuwaData = await getWuwaEventsData()
  if (wuwaData.length > 0) {
    wuwaEventsData.value = wuwaData
    // since all events, regardless of the group, have the same start and end date we can just use the first one
    updateDateRange(wuwaData[0].start, wuwaData[0].end)
  }
})

function updateDateRange(startDateString: string, endDateString: string) {
  if (new Date(startDate.value) > new Date(startDateString)) startDate.value = startDateString
  if (new Date(endDate.value) < new Date(endDateString)) endDate.value = endDateString
}
</script>

<style scoped>
/* Override the default text color of the bar labels */
:deep(.g-gantt-bar-label > *) {
  color: black;
}
</style>
