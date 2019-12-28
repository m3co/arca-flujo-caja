export function getPointOnTimeline(timeline: Array<Date>, date: Date) {
  return timeline.findIndex(item => String(item) === String(date));
}
