import THREE from './Bundle'
import EventBus from './EventBus'

export default class CameraPath {
  constructor(object) {
    this.lookAtObjects = []
    this.scrollPosition = 0
    this.loaded = false
    this.buildFromLine(object)
    EventBus.listen('loading:disappear', () => {
      this.onMouseWheel()
    })
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

  addLookAtObject(begin, end, object) {
    this.lookAtObjects.push({
      begin: begin,
      end: end,
      object: object
    })
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
    let scale = 100
    let point = Math.floor(this.curvePoints.length * this.scrollPosition + this.curvePoints.length) % this.curvePoints.length;

    for(let lookAtObject of this.lookAtObjects) {
      if(point >= lookAtObject.begin && point <= lookAtObject.end) {
        return new THREE.Vector3(lookAtObject.object.position.x / scale, lookAtObject.object.position.y / scale, lookAtObject.object.position.z / scale)
      }
    }
    let pointNext = (point + 1) % this.curvePoints.length;
    return this.curvePoints[pointNext + 1]
  }
}