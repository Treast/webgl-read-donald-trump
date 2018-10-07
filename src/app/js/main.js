import App from './utils/App';
import SceneManager from "./utils/SceneManager";
import ObjectLoader from './utils/ObjectLoader'

let app = new App();
let curve = null;

app.isReady().then(() => {
  let sceneManager = new SceneManager()
  sceneManager.enableStats()
  ObjectLoader.loadCollada('./assets/Trump10.dae')
    .then(collada => {
      console.log(collada.scene)
      sceneManager.addObjectToScene(collada.scene)
      let position = sceneManager.getObject("Spline").geometry.getAttribute('position')
      let vertices = []
      let scale = 2;
      for(let i = 0; i < position.count; i += 3) {
        vertices.push(new THREE.Vector3(position.array[i] / scale, position.array[i + 1] / scale, position.array[i + 2] / scale))
      }
      curve = new THREE.CatmullRomCurve3(vertices)
    })

  sceneManager.animate(() => {
    let time = Date.now()
    let loopTime = 20 * 1000
    let t = (time % loopTime) / loopTime

    if(curve && true) {
      let point = Math.floor(curve.getLength() * t);
      let pointNext = (point + 1) % curve.getLength();
      let cameraPosition = curve.getPoint(point)
      let cameraTangent = curve.getTangent(point)

      sceneManager.setCameraPosition(cameraPosition.x / 100, cameraPosition.y / 100, cameraPosition.z / 100)
      sceneManager.camera.rotation.set(cameraTangent.x, cameraTangent.y, cameraTangent.z)
      sceneManager.camera.lookAt(curve.getPoint(pointNext + 1))
      //sceneManager.getObject("Trump").position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
      //sceneManager.getObject("Trump").rotation.set(cameraTangent.x, cameraTangent.y, cameraTangent.z)
      //sceneManager.getObject("Trump").lookAt(curve.getPoint(pointNext + 1))
    }
  })
});
