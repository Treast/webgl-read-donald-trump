import '../../scss/app.scss';

export default class App {
  isReady() {
    return new Promise((resolve) => {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') resolve();
      });
    });
  }
}
