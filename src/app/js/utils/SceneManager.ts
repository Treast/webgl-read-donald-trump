import THREE from './Bundle';
import CameraPath from './CameraPath';
import * as Stats from 'stats.js';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three';
import Flag from './Flag';
import EventBus from './EventBus';
import * as dat from 'dat.gui';

interface ControlsPosition {
  x: number;
  y: number;
  z: number;
}

interface FlagInformations {
  name: string;
  parent: string;
  windForce: number;
}

class SceneManager {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraPath: CameraPath;
  private renderer: THREE.WebGLRenderer;
  private stats: Stats;
  private controls: OrbitControls;
  private flags: Flag[] = [];
  private params: ControlsPosition;

  constructor() {
    this.params = {
      x: 0,
      y: 0,
      z: 0,
    };
    const gui = new dat.GUI();
    this.initializeScene();
  }

  initializeScene() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.onResize();
    this.onLoadFinished();
  }

  onLoadFinished() {
    EventBus.listen('scene:loaded', () => {
      this.createFlags();
    });
  }

  createFlags() {
    const flags: FlagInformations[] = [
      {
        name: 'Drapeau_1',
        parent: 'drapeau_1',
        windForce: 2,
      },
      {
        name: 'Drapeau_2',
        parent: 'drapeau_2',
        windForce: 1.8,
      },
      {
        name: 'Drapeau_3',
        parent: 'drapeau_3',
        windForce: 2.2,
      },
    ];

    for (const flag of flags) {
      const object = this.getObject(flag.name);
      const flagMesh = new Flag(new THREE.Vector3(object.position.x - Flag.OFFSETX,
                                                  object.position.y - Flag.OFFSETY,
                                                  object.position.z - Flag.OFFSETZ),
                                object.rotation.toVector3(),
                                new THREE.Vector3(0.6, 0.6, 0.6),
                                flag.windForce);
      this.scene.getObjectByName(flag.parent).add(flagMesh.mesh);
      object.visible = false;
      this.flags.push(flagMesh);
    }
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
    this.scene.add(new THREE.AmbientLight(0x808080));
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-8.1, 3.1, 1.9);
    this.camera.lookAt(0.1, 1, -0.8);
    this.cameraPath = null;
    this.scene.add(this.camera);
    this.controls = new THREE.OrbitControls(this.camera);
  }

  createCameraPath(object: THREE.Line) {
    // this.cameraPath = new CameraPath(object);
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
    const time = Date.now();
    for (const flag of this.flags) {
      flag.simulate(time);
      flag.update();
    }

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

    this.controls.update();
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
