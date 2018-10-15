import App from './utils/App';
import SceneManager from "./utils/SceneManager";
import Loading from './utils/Loading'
import EventBus from './utils/EventBus'

let app = new App();

app.isReady().then(() => {
  let loadingElement = document.querySelector('#loader-page');
  let loading = new Loading(loadingElement);
  loading.init();

  //let sceneManager = new SceneManager();
  SceneManager.enableStats();

  EventBus.listen('loading:finished', () => {
    let scene = loading.get("./assets/Trump.dae");
    SceneManager.addObjectToScene(scene.scene);

    let spline = SceneManager.getObject("Spline");
    SceneManager.createCameraPath(spline);

   // let trump = SceneManager.getObject("Trump");
    //SceneManager.addLookAtObject(40, 70, trump)

    SceneManager.animate(() => {

    })
  })
});
