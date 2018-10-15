export default class TimelineEvent {
  constructor(begin, end) {
    this.begin = begin;
    this.end = end;
  }

  isPointInTimeEvent(point) {
    return !!(point >= this.begin && point <= this.end)
  }
}