export function getPointOnTimeline(timeline: Array<Date>, date: Date) {
  return timeline.findIndex(item => String(item) === String(date));
}

export function parseToDotsFormat(value: string) {
  return value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
}
