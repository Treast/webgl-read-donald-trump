import THREE from './Bundle';
import SceneManager from './SceneManager';
import TimelineEvent from './TimelineEvent';

export default class PathEvent extends TimelineEvent {
  private lookAtObject: THREE.Object3D;
  private readonly scale: number;

  constructor(begin: number, end: number, lootAtObject: string) {
    super(begin, end);
    this.lookAtObject = SceneManager.getObject(lootAtObject);
    this.scale = 100;
  }

  isPointInTimeEvent(point: number): boolean {
    return !!(point >= this.begin && point <= this.end);
  }

  getLookAtObjectPosition(): THREE.Vector3 {
    return new THREE.Vector3(this.lookAtObject.position.x / this.scale,
                             this.lookAtObject.position.y / this.scale,
                             this.lookAtObject.position.z / this.scale);
  }
}
