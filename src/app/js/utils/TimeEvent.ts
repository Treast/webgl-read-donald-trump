import TimelineEvent from './TimelineEvent';

export default class TimeEvent extends TimelineEvent {
  private element: HTMLElement;
  private title: string;
  private isVisited: boolean;

  constructor(begin: number, end: number, title: string) {
    super(begin, end);
    this.title = title;
    this.isVisited = false;
  }

  getTitle(): string {
    return this.title;
  }

  setElement(element: HTMLElement) {
    this.element = element;
  }

  isSelected(point: number): boolean {
    return !!(point >= this.begin && point <= this.end);
  }

  setVisited() {
    this.isVisited = true;
    this.element.classList.add('visited');
  }

  setSelected(isSelected: boolean) {
    if (isSelected) {
      this.element.classList.add('selected');
      this.setVisited();
    } else {
      this.element.classList.remove('selected');
    }
  }
}
