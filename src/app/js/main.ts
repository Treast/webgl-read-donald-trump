import App from './utils/App';
import THREE from './utils/Bundle';
import SceneManager from './utils/SceneManager';
import Loading from './utils/Loading';
import EventBus from './utils/EventBus';
import { Glitch } from './animations/Glitch';

const app = new App();

app.isReady().then(() => {
  const loadingElement: HTMLElement = document.querySelector('#loader-page');
  const loading = new Loading(loadingElement);
  loading.init();

  SceneManager.enableStats();

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      const objectFrom = SceneManager.getObject('Trump') as THREE.Mesh;
      new Glitch(objectFrom).execute();
    }
  });

  EventBus.listen('loading:finished', () => {
    const scene = loading.get('./assets/Trump.dae');
    SceneManager.addObjectToScene(scene.scene);

    const spline = SceneManager.getObject('Spline');
    SceneManager.createCameraPath(spline as THREE.Line);

    SceneManager.animate(() => {});
  });
});
