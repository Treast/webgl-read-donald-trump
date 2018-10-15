import THREE from './Bundle'
import SceneManager from './SceneManager'
import TimelineEvent from "./TimelineEvent";

export default class PathEvent extends TimelineEvent {
  constructor(begin, end, lootAtObject) {
    super(begin, end)
    this.lookAtObject = SceneManager.getObject(lootAtObject);
    this.scale = 100;
  }

  isPointInTimeEvent(point) {
    return !!(point >= this.begin && point <= this.end)
  }

  getLookAtObjectPosition() {
    return new THREE.Vector3(this.lookAtObject.position.x / this.scale, this.lookAtObject.position.y / this.scale, this.lookAtObject.position.z / this.scale);
  }
}