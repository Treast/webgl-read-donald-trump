import App from './utils/App';
import SceneManager from './utils/SceneManager';
import Loading from './utils/Loading';
import EventBus from './utils/EventBus';

const app = new App();

app.isReady().then(() => {
  const loadingElement: HTMLElement = document.querySelector('#loader-page');
  const loading = new Loading(loadingElement);
  loading.init();

  SceneManager.enableStats();

  EventBus.listen('loading:finished', () => {
    const scene = loading.get('./assets/Trump.dae');
    SceneManager.addObjectToScene(scene.scene);

    const spline = SceneManager.getObject('Spline');
    SceneManager.createCameraPath(spline);

    SceneManager.animate(() => {});
  });
});
