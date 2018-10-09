import App from './utils/App';
import SceneManager from "./utils/SceneManager";
import ObjectLoader from './utils/ObjectLoader'
import Loading from './utils/Loading'
import EventBus from './utils/EventBus'

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
  let loadingElement = document.querySelector('#loader-page');
  let loading = new Loading(loadingElement);
  loading.init();

  let sceneManager = new SceneManager();
  sceneManager.enableStats();

  EventBus.listen('loading:finished', () => {
    let scene = loading.get("./assets/Trump.dae");
    sceneManager.addObjectToScene(scene.scene);

    let spline = sceneManager.getObject("Spline");
    sceneManager.createCameraPath(spline);

    let trump = sceneManager.getObject("Trump");
    sceneManager.addLookAtObject(40, 70, trump)

    sceneManager.animate(() => {

    })
  })
});
