import App from './utils/App';
import SceneManager from "./utils/SceneManager";
import ObjectLoader from './utils/ObjectLoader'

let app = new App();

app.isReady().then(() => {
  let sceneManager = new SceneManager()
  ObjectLoader.loadCollada('./assets/Trump.dae')
    .then(collada => {
      sceneManager.addObjectToScene(collada.scene)
    })

  sceneManager.animate(() => {

  })
});
