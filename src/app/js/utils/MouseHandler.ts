import { Camera, Object3D, Raycaster } from 'three';
import SceneManager from './SceneManager';
import EventBus from './EventBus';
import { MousePosition } from '../typings';

export default class MouseHandler {
  private lastObject: Object3D = null;
  private mousePosition: MousePosition;
  private raycaster: Raycaster;
  private readonly camera: Camera;

  constructor(camera: Camera) {
    this.mousePosition = {
      x: 0,
      y: 0,
    };
    this.raycaster = new Raycaster();
    this.camera = camera;

    this.onMouseMove();
    this.onMouseClick();
  }

  onMouseMove() {
    document.addEventListener('mousemove', (e: MouseEvent) => {
      this.mousePosition = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    });
  }

  onMouseClick() {
    document.addEventListener('click', (e: MouseEvent) => {
      const object = this.getIntersects();
      if (object && object.userData.isInteractive) {
        EventBus.dispatch('raycast:click', { object });
      }
    });
  }

  getIntersects() {
    this.raycaster.setFromCamera(this.mousePosition, this.camera);

    const intersects = this.raycaster.intersectObjects(SceneManager.getScene().children, true);

    if (intersects.length > 0) {
      return intersects[0].object;
    }

    return null;
  }

  performRaycast() {
    const object = this.getIntersects();
    if (object && this.lastObject !== object && object.userData.isInteractive) {
      EventBus.dispatch('raycast:enter', { object });
      EventBus.dispatch('raycast:leave', { object: this.lastObject });
      this.lastObject = object;
    }
  }
}
