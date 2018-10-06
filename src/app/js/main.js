import App from './utils/App';
import SceneManager from "./utils/SceneManager";
import ObjectLoader from './utils/ObjectLoader'

let app = new App();
let tubeGeometry, binormal = new THREE.Vector3(), normal = new THREE.Vector3();

app.isReady().then(() => {
  let sceneManager = new SceneManager()
  ObjectLoader.loadCollada('./assets/Trump10.dae')
    .then(collada => {
      console.log(collada.scene)
      sceneManager.addObjectToScene(collada.scene)
      let position = sceneManager.getObject("Spline").geometry.getAttribute('position')
      let vertices = []
      let scale = 1;
      for(let i = 0; i < position.count; i += 3) {
        vertices.push(new THREE.Vector3(position.array[i] / scale, position.array[i + 1] / scale, position.array[i + 2] / scale))
      }
      //sceneManager.camera.position.set(position.array[0], position.array[1], position.array[2])
      let curve = new THREE.CatmullRomCurve3(vertices)
      let points = curve.getPoints(200)
      tubeGeometry = new THREE.TubeBufferGeometry(curve, 6, 1, 8, true)

    })

  /*ObjectLoader.loadObjectWithMaterial('./assets/Trump.obj', './assets/Trump.mtl')
    .then(object => {
      console.log(object)
      sceneManager.addObjectToScene(object)
    }) */

  sceneManager.animate(() => {
    let time = Date.now()
    let loopTime = 10 * 1000
    let t = (time % loopTime) / loopTime

    if(tubeGeometry && true) {
      let segments = tubeGeometry.tangents.length
      let pickt = t * segments
      let pick = Math.floor(pickt)
      let pickNext = (pick + 1) % segments
      let pos = tubeGeometry.parameters.path.getPointAt(t)

      binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick])
      binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick])
      let dir = tubeGeometry.parameters.path.getTangentAt(t)
      let offset = 15

      normal.copy(binormal).cross(dir)
      pos.add(normal.clone().multiplyScalar(offset))
      sceneManager.camera.position.copy(pos)

      let lookAt = tubeGeometry.parameters.path.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1)
      console.log(pos)
      console.log(sceneManager.camera.position)
      lookAt.copy(pos).add(dir)
      sceneManager.camera.matrix.lookAt(sceneManager.camera.position, lookAt, normal)
      sceneManager.camera.rotation.setFromRotationMatrix(sceneManager.camera.matrix, sceneManager.camera.rotation.order)
      sceneManager.cameraHelper.update()
    }
  })
});
