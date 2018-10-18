import THREE from './Bundle';
import EventBus from './EventBus';
import Timeline from './Timeline';
import timeEventsJSON from '../json/timeEvents';
import pathEventsJSON from '../json/pathEvents';

export default class CameraPath {
  private scrollPosition: number = 0;
  private loaded: boolean = false;
  private timeline: Timeline = null;
  private curve: THREE.CatmullRomCurve3 = null;
  private curvePoints: THREE.Vector3[] = [];

  constructor(object: THREE.Line) {
    this.buildFromLine(object);
    this.buildTimeline();
    EventBus.listen('loading:disappear', () => {
      this.onMouseWheel();
    });
  }

  buildTimeline() {
    const pathEvents = pathEventsJSON;
    const timeEvents = timeEventsJSON;
    this.timeline = new Timeline(pathEvents, timeEvents);
    this.timeline.buildTimelineHTML();
  }

  buildFromLine(object: THREE.Line) {
    const geometry = object.geometry as THREE.BufferGeometry;
    const position = geometry.getAttribute('position');
    const vertices = [];
    const scale = 1;
    for (let i = 0; i < position.array.length; i += position.itemSize) {
      vertices.push(new THREE.Vector3(position.array[i] / scale, position.array[i + 1] / scale, position.array[i + 2] / scale));
    }
    this.curve = new THREE.CatmullRomCurve3(vertices);
    this.curvePoints = [];
    for (let i = 0; i < this.curve.getLength(); i += 1) {
      const p = this.curve.getUtoTmapping(0, i);
      const p1 = this.curve.getPoint(p);
      this.curvePoints.push(p1);
    }
    this.loaded = true;
  }

  onMouseWheel() {
    window.addEventListener('mousewheel', (e: MouseWheelEvent) => {
      this.scrollPosition += e.deltaY / 10000;

      if (this.scrollPosition < 0) {
        this.scrollPosition = 0;
      }
    });
  }

  hasLoaded() {
    return this.loaded;
  }

  getCameraPosition() {
    const scale = 100;
    const point = Math.floor(this.curvePoints.length * this.scrollPosition + this.curvePoints.length) % this.curvePoints.length;
    const cameraPosition = this.curvePoints[point];

    this.timeline.setPoint(point);

    return {
      x: cameraPosition.x / scale,
      y: cameraPosition.y / scale,
      z: cameraPosition.z / scale,
    };
  }

  getCameraLookAt() {
    const point = Math.floor(this.curvePoints.length * this.scrollPosition + this.curvePoints.length) % this.curvePoints.length;

    if (this.timeline.hasPathEventIn(point)) {
      return this.timeline.getPathEventIn(point);
    }

    const pointNext = (point + 1) % this.curvePoints.length;
    return this.curvePoints[pointNext + 1];
  }
}
