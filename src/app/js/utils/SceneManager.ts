import THREE from './Bundle';
import CameraPath from './CameraPath';
import * as Stats from 'stats.js';
import * as TWEEN from '@tweenjs/tween.js';

class SceneManager {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraPath: CameraPath;
  private renderer: THREE.WebGLRenderer;
  private stats: Stats;

  constructor() {
    this.initializeScene();
  }

  initializeScene() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.onResize();
  }

  onResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  enableStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-8.1, 3.1, 1.9);
    this.camera.lookAt(0.1, 1, -0.8);
    this.cameraPath = null;
    this.scene.add(this.camera);
    // this.controls = new THREE.OrbitControls(this.camera)
  }

  createCameraPath(object: THREE.Line) {
    this.cameraPath = new CameraPath(object);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  animate(animation = () => {}) {
    requestAnimationFrame(() => { this.animate(animation); });
    if (this.stats) {
      this.stats.begin();
    }
    TWEEN.update();

    if (this.cameraPath && this.cameraPath.hasLoaded()) {
      const cameraPosition = this.cameraPath.getCameraPosition();
      const cameraLookAt = this.cameraPath.getCameraLookAt();
      TWEEN.removeAll();
      new TWEEN.Tween(this.camera.position)
        .to(cameraPosition, 200)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
      this.camera.lookAt(cameraLookAt);
    }

    // this.controls.update()
    this.renderer.render(this.scene, this.camera);
    animation();
    if (this.stats) {
      this.stats.end();
    }
  }

  addObjectToScene(object: THREE.Object3D) {
    this.scene.add(object);
  }

  getObject(name: string) {
    return this.scene.getObjectByName(name);
  }
}

export default new SceneManager();
