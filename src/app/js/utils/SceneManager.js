import THREE from './Bundle'

export default class SceneManager {
  constructor() {
    this.initializeScene()
  }

  initializeScene() {
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.onResize()
  }

  onResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }

  createScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(-8.1, 3.1, 1.9)
    this.camera.lookAt(0.1, 1, -0.8)
    this.cameraHelper = new THREE.CameraHelper(this.camera)
    this.scene.add(this.camera)
    this.scene.add(this.cameraHelper)
    //this.controls = new THREE.OrbitControls(this.camera)
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
  }

  animate(animation = () => {}) {
    requestAnimationFrame(() => {this.animate(animation)})
    //this.controls.update()
    this.renderer.render(this.scene, this.camera)
    animation();
  }

  addObjectToScene(object) {
    this.scene.add(object)
  }

  getObject(name) {
    return this.scene.getObjectByName(name, true)
  }
}