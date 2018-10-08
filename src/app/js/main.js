import App from './utils/App';
import SceneManager from "./utils/SceneManager";
import ObjectLoader from './utils/ObjectLoader'

let app = new App();
let curve = null;
let curveLength = 0
let scrollPosition = 0;

app.isReady().then(() => {
  let sceneManager = new SceneManager()
  sceneManager.enableStats()
  ObjectLoader.loadCollada('./assets/Trump.dae')
    .then(collada => {
      console.log(collada.scene)
      sceneManager.addObjectToScene(collada.scene)
      let position = sceneManager.getObject("Spline").geometry.getAttribute('position')
      sceneManager.getObject("Spline").material = new THREE.LineBasicMaterial({color: 0x00ff00})
      let vertices = []
      let scale = 1;
      for(let i = 0; i < position.array.length; i += position.itemSize) {
        curveLength++
        vertices.push(new THREE.Vector3(position.array[i] / scale, position.array[i + 1] / scale, position.array[i + 2] / scale))
      }
      curve = new THREE.CatmullRomCurve3(vertices)
      let geometry = new THREE.BufferGeometry().setFromPoints( curve.getPoints(200) );

      let material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// Create the final object to add to the scene
      let curveObject = new THREE.Line( geometry, material );
      sceneManager.addObjectToScene(curveObject)
    })

  window.addEventListener('mousewheel', (e) => {
    scrollPosition += e.deltaY / 5000;
  })

  sceneManager.animate(() => {
    if(curve && true) {
      let point = Math.floor(curveLength * scrollPosition);
      let pointNext = (point + 1) % curveLength;
      let cameraPosition = curve.getPoint(point)
      let cameraTangent = curve.getTangent(point)

      let scale = 100
      sceneManager.setCameraPosition(cameraPosition.x / scale, cameraPosition.y / scale, cameraPosition.z / scale)
      sceneManager.camera.rotation.set(cameraTangent.x, cameraTangent.y, cameraTangent.z)
      sceneManager.camera.lookAt(curve.getPoint(pointNext + 1))
      //sceneManager.getObject("Trump").position.set(cameraPosition.x / scale, cameraPosition.y / scale, cameraPosition.z / scale)
      //sceneManager.getObject("Trump").rotation.set(cameraTangent.x, cameraTangent.y, cameraTangent.z)
      //sceneManager.getObject("Trump").lookAt(curve.getPoint(pointNext + 1))
    }
  })
});
