export default class Timeline {
  constructor(pathEvents, timeEvents) {
    this.pathEvents = pathEvents
    this.timeEvents = timeEvents
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

  setPoint(point) {
    for(let timeEvent of this.timeEvents) {
      timeEvent.setSelected(timeEvent.isSelected(point))
    }
  }

  buildTimelineHTML() {
    let container = document.querySelector('#timeline ul')
    for(let timeEvent of this.timeEvents) {
      let li = document.createElement('li')
      li.innerText = timeEvent.title
      container.appendChild(li)
      timeEvent.setElement(li)
    }
  }
}