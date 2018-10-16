import TimelineEvent from "./TimelineEvent";

export default class TimeEvent extends TimelineEvent {
  constructor(begin, end, title) {
    super(begin, end)
    this.title = title
    this.isVisited = false
  }

  setElement(element) {
    this.element = element
  }

  isSelected(point) {
    return !!(point >= this.begin && point <= this.end)
  }

  setVisited() {
    this.isVisited = true
    this.element.classList.add('visited')
  }

  setSelected(isSelected) {
    if(isSelected) {
      this.element.classList.add('selected')
      this.setVisited()
    } else {
      this.element.classList.remove('selected')
    }

  }
}