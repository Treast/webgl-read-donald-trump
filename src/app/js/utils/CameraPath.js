import THREE from './Bundle'
import EventBus from './EventBus'
import PathEvent from "./PathEvent";
import Timeline from "./Timeline";
import TimeEvent from "./TimeEvent";

export default class CameraPath {
  constructor(object) {
    this.scrollPosition = 0
    this.loaded = false
    this.buildFromLine(object)
    this.buildTimeline()
    EventBus.listen('loading:disappear', () => {
      this.onMouseWheel()
    })
  }

  buildTimeline() {
    let pathEvents = [
      new PathEvent(400, 650, "Trump")
    ];
    let timeEvents = [
      new TimeEvent(0, 300, "Title 1"),
      new TimeEvent(301, 600, "Title 2"),
      new TimeEvent(601, 900, "Title 3"),
    ];
    this.timeline = new Timeline(pathEvents, timeEvents);
    this.timeline.buildTimelineHTML()
  }

  buildFromLine(object) {
    let position = object.geometry.getAttribute('position')
    let vertices = []
    let scale = 1;
    for(let i = 0; i < position.array.length; i += position.itemSize) {
      vertices.push(new THREE.Vector3(position.array[i] / scale, position.array[i + 1] / scale, position.array[i + 2] / scale))
    }
    this.curve = new THREE.CatmullRomCurve3(vertices)
    this.curvePoints = []
    for (let i = 0; i < this.curve.getLength(); i++){
      let p = this.curve.getUtoTmapping(0, i);
      let p1 = this.curve.getPoint(p);
      this.curvePoints.push(p1);
    }
    this.loaded = true
  }

  onMouseWheel() {
    window.addEventListener('mousewheel', (e) => {
      this.scrollPosition += e.deltaY / 10000;

      if(this.scrollPosition < 0) {
        this.scrollPosition = 0
      }
    })
  }

  hasLoaded() {
    return this.loaded
  }

  getCameraPosition() {
    let scale = 100
    let point = Math.floor(this.curvePoints.length * this.scrollPosition + this.curvePoints.length) % this.curvePoints.length;
    let cameraPosition = this.curvePoints[point]

    this.timeline.setPoint(point)

    return {
      x: cameraPosition.x / scale,
      y: cameraPosition.y / scale,
      z: cameraPosition.z / scale,
    }
  }

  getCameraLookAt() {
    let point = Math.floor(this.curvePoints.length * this.scrollPosition + this.curvePoints.length) % this.curvePoints.length;

    if(this.timeline.hasPathEventIn(point)) {
      return this.timeline.getPathEventIn(point);
    }

    let pointNext = (point + 1) % this.curvePoints.length;
    return this.curvePoints[pointNext + 1]
  }
}