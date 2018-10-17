export default class TimelineEvent {
  protected begin: number;
  protected end: number;

  constructor(begin: number, end: number) {
    this.begin = begin;
    this.end = end;
  }

  isPointInTimeEvent(point: number): boolean {
    return !!(point >= this.begin && point <= this.end);
  }
}
