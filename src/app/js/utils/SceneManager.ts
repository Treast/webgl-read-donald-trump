import THREE from './Bundle';
import CameraPath from './CameraPath';
import * as Stats from 'stats.js';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls, Vector3 } from 'three';
import Flag from './Flag';
import EventBus from './EventBus';
import * as dat from 'dat.gui';
import Fact from './Fact';
import MouseHandler from './MouseHandler';
import { ControlsPosition, FlagInformations, IFact } from '../typings';
import factsJSON from '../json/facts';
import flagsJSON from '../json/flags';

class SceneManager {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraPath: CameraPath;
  private renderer: THREE.WebGLRenderer;
  private mouseHandler: MouseHandler;
  private stats: Stats;
  private controls: OrbitControls = null;
  private flags: Flag[] = [];
  private facts: Fact[] = [];
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
    this.mouseHandler = new MouseHandler(this.camera);
    this.onResize();
    this.onLoadFinished();
  }

  enableOrbitControls() {
    this.controls = new THREE.OrbitControls(this.camera);
  }

  onLoadFinished() {
    EventBus.listen('scene:loaded', () => {
      this.createFacts();
      this.createFlags();
    });
  }

  createFacts() {
    const facts: IFact[] = factsJSON;

    for (const fact of facts) {
      const factObject = this.getObject(fact.parent);
      const buttonObject = factObject.getObjectByName('Bouton_Plus');
      const infosObject = factObject.getObjectByName('Infos');
      infosObject.visible = false;
      buttonObject.visible = false;
      const f = new Fact(fact.date, fact.title, fact.content, fact.url, buttonObject, infosObject);
      this.facts.push(f);
      factObject.add(f.getFactSprite());
      factObject.add(f.getFactInfosSprite());
    }

    Fact.onFactClick();
  }

  createFlags() {
    const flags: FlagInformations[] = flagsJSON;

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

  getScene() {
    return this.scene;
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
  }

  createCameraPath(object: THREE.Line) {
    if (!this.controls) {
      this.cameraPath = new CameraPath(object);
    }
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

    this.mouseHandler.performRaycast();

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

    if (this.controls) {
      this.controls.update();
    }

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
