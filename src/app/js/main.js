import App from './utils/App';
import SceneManager from "./utils/SceneManager";
import ObjectLoader from './utils/ObjectLoader'

let app = new App();
let curve = null;
let curvePoints = []
let curveLength = 0
let scrollPosition = 0;

let lookAts = [
  {
    begin: 45,
    end: 60,
    lookAt: "Trump"
  }
]

app.isReady().then(() => {
  let sceneManager = new SceneManager()
  sceneManager.enableStats()
  ObjectLoader.loadCollada('./assets/Trump.dae')
    .then(collada => {
      console.log(collada.scene)
      sceneManager.addObjectToScene(collada.scene)
      let spline = sceneManager.getObject("Spline")
      sceneManager.createCameraPath(spline)

      let trump = sceneManager.getObject("Trump")
      sceneManager.addLookAtObject(40, 70, trump)
    })



  sceneManager.animate(() => {

  })
});
