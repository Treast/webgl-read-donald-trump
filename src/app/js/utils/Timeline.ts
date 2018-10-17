import PathEvent from './PathEvent';
import TimeEvent from './TimeEvent';

export default class Timeline {
  private readonly pathEvents: PathEvent[];
  private readonly timeEvents: TimeEvent[];

  constructor(pathEvents: PathEvent[], timeEvents: TimeEvent[]) {
    this.pathEvents = pathEvents;
    this.timeEvents = timeEvents;
  }

  hasPathEventIn(point: number) {
    for (const pathEvents of this.pathEvents) {
      if (pathEvents.isPointInTimeEvent(point)) {
        return true;
      }
    }
    return false;
  }

  getPathEventIn(point: number) {
    for (const pathEvents of this.pathEvents) {
      if (pathEvents.isPointInTimeEvent(point)) {
        return pathEvents.getLookAtObjectPosition();
      }
    }
    return null;
  }

  setPoint(point: number) {
    for (const timeEvent of this.timeEvents) {
      timeEvent.setSelected(timeEvent.isSelected(point));
    }
  }

  buildTimelineHTML() {
    const container = document.querySelector('#timeline ul');
    for (const timeEvent of this.timeEvents) {
      const li = document.createElement('li');
      li.innerText = timeEvent.getTitle();
      container.appendChild(li);
      timeEvent.setElement(li);
    }
  }
}
