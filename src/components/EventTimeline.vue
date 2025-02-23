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
  </g-gantt-chart>
</template>

<script setup lang="ts">
import { dateObjectToFormattedDate, type TimelineEvents } from '@/data/comon'
import { getGenshinEventsData } from '@/data/genshin'
import { onMounted, ref } from 'vue'

const startDate = ref(dateObjectToFormattedDate(new Date()))
const endDate = ref(dateObjectToFormattedDate(new Date()))
const genshinEventsData = ref<TimelineEvents[]>([])

onMounted(() => {
  const data = getGenshinEventsData()
  if (data.length > 0) {
    genshinEventsData.value = data
    // since all group event groups have the same start and end date, we can just use the first one
    // TODO: add logic so that the start date is the earlist date of only the active events
    startDate.value = data[0].start
    endDate.value = data[0].end
  }
})
</script>

<style scoped>
/* Override the default text color of the bar labels */
:deep(.g-gantt-bar-label > *) {
  color: black;
}
</style>
