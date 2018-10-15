import THREE from './Bundle'
import EventBus from './EventBus'
import PathEvent from "./PathEvent";
import Timeline from "./Timeline";

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
      new PathEvent(40, 65, "Trump")
    ];
    this.timeline = new Timeline(pathEvents);
  }

  buildFromLine(object) {
    let position = object.geometry.getAttribute('position')
    let vertices = []
    let scale = 1;
    for(let i = 0; i < position.array.length; i += position.itemSize) {
      vertices.push(new THREE.Vector3(position.array[i] / scale, position.array[i + 1] / scale, position.array[i + 2] / scale))
    }
    this.curve = new THREE.CatmullRomCurve3(vertices)
    this.curvePoints = this.curve.getPoints(500)
    console.log('CurvePoints', this.curvePoints.length)
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