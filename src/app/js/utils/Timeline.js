export default class Timeline {
  constructor(pathEvents) {
    this.pathEvents = pathEvents
  }

  hasPathEventIn(point) {
    for(let pathEvents of this.pathEvents) {
      if(pathEvents.isPointInTimeEvent(point)) {
        return true;
      }
    }
    return false;
  }

  getPathEventIn(point) {
    for(let pathEvents of this.pathEvents) {
      if(pathEvents.isPointInTimeEvent(point)) {
        return pathEvents.getLookAtObjectPosition()
      }
    }
    return null;
  }
}